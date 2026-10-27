import {defaultProject,normalizeProject,PRESETS,PAGE_DEFS,ADAPTERS,makePreviewDocument,buildSite,zipFiles,VERSION} from "./engine.js";
const $=id=>document.getElementById(id);
let project=defaultProject(),page="index",compose="index",foundryCss="",ready=false;
const setStatus=msg=>$("preview-status").textContent=msg;
const getPage=slug=>project.pages.find(p=>p.slug===slug);
function setPressed(query,key,value){
 document.querySelectorAll(query).forEach(b=>{const active=b.dataset[key]===value;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active));});
}
function renderFrame(){
 if(!ready)return;
 const sanitized=normalizeProject(project);
 $("site-frame").srcdoc=makePreviewDocument(sanitized,page,foundryCss);
 setStatus("Preview ready · "+PAGE_DEFS.find(p=>p.slug===page).title);
}
function syncInputs(){
 for(const el of document.querySelectorAll("[data-biz]"))el.value=project.business[el.dataset.biz]??"";
 for(const el of document.querySelectorAll("[data-list]"))el.value=(project.business[el.dataset.list]||[]).join("\n");
 for(const el of document.querySelectorAll("[data-design]")){
  const value=project.design[el.dataset.design];
  if(el.type==="checkbox")el.checked=!!value;else el.value=String(value);
 }
 for(const el of document.querySelectorAll("[data-color]"))el.value=project.design[el.dataset.color];
 $("radius-label").textContent=project.design.radius+"px";
 $("compose-page").value=compose;
 renderComposer();
 renderFrame();
}
function renderComposer(){
 const current=getPage(compose);const container=$("section-list");
 container.replaceChildren();
 current.sections.forEach((entry,index)=>{
  const wrapper=document.createElement("div");wrapper.className="section-item";
  const label=document.createElement("div");label.className="section-name";
  const id=document.createElement("small");id.textContent=entry.componentId;
  const select=document.createElement("select");select.setAttribute("aria-label","Change component for section "+(index+1));
  for(const [componentId,adapter] of Object.entries(ADAPTERS)){
   const option=document.createElement("option");option.value=componentId;option.textContent=adapter.label;
   select.append(option);
  }
  select.value=entry.componentId;
  select.addEventListener("change",()=>{entry.componentId=select.value;renderFrame();renderComposer()});
  label.append(select,id);
  const actions=document.createElement("div");actions.className="section-actions";
  for(const [text,title,action,disabled] of [
    ["↑","Move up",()=>swap(index,index-1),index===0],
    ["↓","Move down",()=>swap(index,index+1),index===current.sections.length-1],
    ["×","Remove section",()=>{current.sections.splice(index,1);renderComposer();renderFrame()},false]
  ]){
   const button=document.createElement("button");button.type="button";button.className="square-btn";button.textContent=text;button.title=title;button.setAttribute("aria-label",title+" "+(index+1));button.disabled=disabled;
   button.addEventListener("click",action);actions.append(button);
  }
  wrapper.append(label,actions);container.append(wrapper);
 });
 function swap(a,b){const hold=current.sections[a];current.sections[a]=current.sections[b];current.sections[b]=hold;renderComposer();renderFrame()}
}
function switchTab(tab){
 document.querySelectorAll(".tabcontent").forEach(x=>x.hidden=x.dataset.panel!==tab);
 setPressed(".tab","tab",tab);
}
for(const button of document.querySelectorAll(".tab"))button.addEventListener("click",()=>switchTab(button.dataset.tab));
for(const el of document.querySelectorAll("[data-biz]")){
 el.addEventListener("input",()=>{project.business[el.dataset.biz]=el.value;renderFrame()});
}
for(const el of document.querySelectorAll("[data-list]")){
 el.addEventListener("input",()=>{project.business[el.dataset.list]=el.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);renderFrame()});
}
for(const el of document.querySelectorAll("[data-design]")){
 el.addEventListener("input",()=>{
  const key=el.dataset.design;
  if(key==="preset"){
   const chosen=el.value;
   project.design={...project.design,preset:chosen,...PRESETS[chosen]};
   syncInputs();return;
  }
  project.design[key]=el.type==="checkbox"?el.checked:el.type==="range"?Number(el.value):el.value;
  $("radius-label").textContent=project.design.radius+"px";renderFrame();
 });
}
for(const el of document.querySelectorAll("[data-color]"))el.addEventListener("input",()=>{
 project.design[el.dataset.color]=el.value.toUpperCase();renderFrame();
});
for(const button of document.querySelectorAll(".preview-page"))button.addEventListener("click",()=>{
 page=button.dataset.page;setPressed(".preview-page","page",page);compose=page;$("compose-page").value=page;renderComposer();renderFrame();
});
for(const button of document.querySelectorAll(".preview-width"))button.addEventListener("click",()=>{
 $("preview-frame").className="preview-frame "+button.dataset.width;
 setPressed(".preview-width","width",button.dataset.width);
});
$("compose-page").addEventListener("change",e=>{compose=e.target.value;page=compose;setPressed(".preview-page","page",page);renderComposer();renderFrame()});
for(const [componentId,adapter] of Object.entries(ADAPTERS)){
 const option=document.createElement("option");option.value=componentId;option.textContent=adapter.label+" · "+componentId;
 $("add-section").append(option);
}
$("add-section-button").addEventListener("click",()=>{
 const current=getPage(compose);
 if(current.sections.length>=15){setStatus("Limit: 15 sections per page");return}
 current.sections.push({id:compose+"-section-"+Date.now(),componentId:$("add-section").value});
 renderComposer();renderFrame();
});
$("reset").addEventListener("click",()=>{
 project=defaultProject();page="index";compose="index";
 setPressed(".preview-page","page",page);syncInputs();switchTab("brief");setStatus("Example restored");
});
function downloadFile(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),10000);
}
$("save-json").addEventListener("click",()=>{
 const normalized=normalizeProject(project);
 downloadFile(new Blob([JSON.stringify(normalized,null,2)+"\n"],{type:"application/json"}),"webdesign-brief.json");
 setStatus("Editable project JSON downloaded");
});
$("import-json").addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>256_000){setStatus("JSON too large (256 KB limit)");return}
 try{
  const parsed=JSON.parse(await file.text());
  if(parsed.schemaVersion!==1||!Array.isArray(parsed.pages))throw Error("Unknown project schema");
  project=normalizeProject(parsed);page="index";compose="index";setPressed(".preview-page","page",page);syncInputs();setStatus("Project imported locally");
 }catch(err){setStatus("Import failed: invalid project JSON")}finally{e.target.value=""}
});
$("download-zip").addEventListener("click",()=>{
 if(!ready){setStatus("Foundry stylesheet still loading");return}
 try{
  const files=buildSite(project,foundryCss),archive=zipFiles(files);
  downloadFile(archive,"webdesign-demo.zip");
  setStatus("Four-page ZIP downloaded");
 }catch(err){setStatus("Export error: "+err.message)}
});
(async function init(){
 try{
  const response=await fetch("./assets/foundry.css",{cache:"no-store"});
  if(!response.ok)throw Error("Foundry CSS could not be loaded");
  foundryCss=await response.text();ready=true;
  syncInputs();setStatus("Preview ready");
 }catch(e){setStatus("Could not load local Foundry stylesheet");console.error(e)}
})();
