"use strict";
/* Manual/local only: optional Puppeteer module supplied by PUPPETEER_MODULE.
   This never runs on GitHub Actions or external crawling jobs. */
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const ROOT=path.resolve(__dirname,"../..");
const puppeteer=require(process.env.PUPPETEER_MODULE||"puppeteer");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
let page,browser;
let passed=[];
function ok(label,condition){assert.ok(condition,label);passed.push(label)}
const server=http.createServer((req,res)=>{
 let name=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
 if(name.endsWith("/"))name+="index.html";
 const full=path.resolve(ROOT,"."+name);
 if(!full.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
 try{const body=fs.readFileSync(full);res.writeHead(200,{"Content-Type":mime[path.extname(full)]||"text/plain; charset=utf-8"});res.end(body)}
 catch{res.writeHead(404).end("Not found")}
});
(async()=>{
 try{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const url="http://127.0.0.1:"+server.address().port;
  browser=await puppeteer.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-first-run"]});
  page=await browser.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  for(const width of [360,768,1280]){
   await page.setViewport({width,height:840,deviceScaleFactor:1});
   await page.goto(url+"/library/",{waitUntil:"networkidle0"});
   await page.waitForFunction(()=>document.querySelector("#count")?.textContent.includes("44"),{timeout:12000});
   let info=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,win:window.innerWidth,entry:document.querySelector("#itemName").textContent,count:document.querySelectorAll(".item").length}));
   ok("gallery-loaded-"+width,info.count===44 && info.entry.length>1);
   ok("no-horizontal-overflow-"+width,info.doc<=info.win+2);
  }
  await page.select("#family","headers");
  ok("header-family-filter",await page.$eval("#itemList",el=>el.children.length)===3);
  await page.click('[data-id="WDT-HDR-001"]');
  ok("header-selected",await page.$eval("#itemId",el=>el.textContent)==="WDT-HDR-001");
  await page.setViewport({width:360,height:820});
  await page.click(".wd-mobile-menu summary");
  ok("mobile-menu-native-opens",await page.$eval(".wd-mobile-menu",el=>el.open===true));
  await page.click('[data-theme="studio"]');
  ok("theme-switch",await page.$eval("#preview",el=>el.dataset.wdTheme)==="studio");
  await page.click('[data-width="mobile"]');
  ok("viewport-toggle",await page.$eval("#preview",el=>el.classList.contains("mobile")));
  await page.select("#family","booking");
  ok("booking-family-filter",await page.$eval("#itemList",el=>el.children.length)===3);
  await page.click('[data-id="WDT-BOOK-001"]');
  await page.type("#wd-consultation-name","Demo Example");
  await page.type("#wd-consultation-email","demo@example.org");
  await page.type("#wd-consultation-scope","Local acceptance test. No data sent.");
  await page.click('[data-wdt-demo-form] [type="submit"]');
  ok("booking-demo-no-send",await page.$eval("[data-wdt-form-status]",el=>el.textContent.includes("NO booking made")));
  ok("props-inspector-populated",await page.$eval("#props",el=>el.children.length)>=3);
  for(const [template,frag] of [["saas","SaaS"],["local","Local"],["commerce","Commerce"]]){
   await page.setViewport({width:360,height:840});
   const resp=await page.goto(url+"/library/templates/"+template+".html",{waitUntil:"networkidle0"});
   ok("template-status-"+template,resp.status()===200);
   const info=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:window.innerWidth,main:!!document.querySelector("main"),title:document.title}));
   ok("template-responsive-"+template,info.w<=info.v+2);
   ok("template-semantic-"+template,info.main && info.title.includes(frag));
  }
  await page.goto(url+"/library/",{waitUntil:"networkidle0"});
  await page.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
  ok("reduced-motion-style",await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches));
  await page.setViewport({width:360,height:840,deviceScaleFactor:1});
  await page.reload({waitUntil:"networkidle0"});
  const allIds=await page.evaluate(()=>Array.from(document.querySelectorAll(".item")).map(e=>e.dataset.id));
  let bad=[];
  for(const id of allIds){
    await page.click('[data-id="'+id+'"]');
    const state=await page.evaluate(()=>({
      width:document.documentElement.scrollWidth, viewport:window.innerWidth,
      rendered:document.getElementById("previewContent").children.length,
      code:document.getElementById("source").textContent.length
    }));
    if(state.width>state.viewport+2||!state.rendered||!state.code)bad.push({id,...state});
  }
  ok("all-44-previews-render-at-mobile",allIds.length===44&&bad.length===0);
  await page.setViewport({width:768,height:840});
  await page.evaluate(()=>document.body.style.zoom="2");
  ok("approximate-200-percent-zoom-reflow",await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.evaluate(()=>document.body.style.zoom="");
  await page.focus("#search");
  await page.keyboard.press("Tab");
  ok("keyboard-navigation-focus",await page.evaluate(()=>document.activeElement?.id==="family"));
  ok("no-browser-page-errors",errors.length===0);
  console.log(JSON.stringify({status:"PASS",assertions:passed.length,checks:passed,errors},null,2));
 }catch(e){console.error(JSON.stringify({status:"FAIL",passed,reason:e.message,stack:e.stack},null,2));process.exitCode=1}
 finally{if(page)await page.close().catch(()=>{});if(browser)await browser.close().catch(()=>{});await new Promise(r=>server.close(r))}
})();
