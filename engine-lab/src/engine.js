/* WebDesignToolkit Engine v0.2 | local category recipes and customizable design tokens. */
import {CATEGORIES,TEMPLATES,PALETTES,composeRecipe,VISUAL_STYLES,CATEGORY_STORIES} from "./recipes.js";
export const VERSION="0.3.0";
export const PRESETS={
 hardline:{accent:"#D4FB57",bg:"#FBFAF6",ink:"#17191C",surface:"#FFFFFF",radius:0,font:"system",shadow:true},
 studio:{accent:"#7BE0D2",bg:"#EEF3F5",ink:"#142E42",surface:"#FFFFFF",radius:10,font:"system",shadow:true},
 calm:{accent:"#EED0A6",bg:"#F6F1EA",ink:"#3B302D",surface:"#FFFDF8",radius:14,font:"serif",shadow:false}
};
export const PAGE_DEFS=[{slug:"index",title:"Home"},{slug:"about",title:"About"},{slug:"services",title:"Services"},{slug:"contact",title:"Contact"}];
export const ADAPTERS={
 "WDT-HERO-001":{label:"Centered hero",family:"hero"},
 "WDT-HERO-002":{label:"Editorial split hero",family:"hero"},
 "WDT-HERO-003":{label:"Product-led hero",family:"hero"},
 "WDT-SEC-002":{label:"Services grid",family:"services"},
 "WDT-TEST-003":{label:"Trust/process cards",family:"trust"},
 "WDT-BLOCK-003":{label:"Three-step process",family:"process"},
 "WDT-SEC-003":{label:"FAQ accordions",family:"faq"},
 "WDT-SEC-004":{label:"Final call to action",family:"cta"},
 "WDT-PORT-001":{label:"Portfolio examples",family:"portfolio"},
 "WDT-PRICE-003":{label:"Custom quote section",family:"pricing"},
 "WDT-BOOK-001":{label:"Contact preview (no-send)",family:"contact"},
 "WDT-BOOK-002":{label:"Date preference demo (no-send)",family:"contact"},
 "WDT-PROD-001":{label:"Menu / offering cards",family:"products"}
};
const str=(x,n=200)=>String(x??"").trim().slice(0,n);
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const color=(x,f)=>/^#[0-9a-f]{6}$/i.test(String(x))?String(x).toUpperCase():f;
const array=(x,n=8)=>((Array.isArray(x)?x:String(x??"").split(/[,\n]/))).map(v=>str(v,90)).filter(Boolean).slice(0,n);
export function defaultProject(){return {
 schemaVersion:1,
 business:{name:"Northstar Studio",industry:"Creative studio",tagline:"Better websites. Clearer business.",summary:"We create thoughtful, accessible websites that put people first. Every project begins with your goals.",email:"hello@example.com",phone:"",location:"Your city",cta:"Start a project",services:["Website strategy","Design systems","Responsive development","Site improvement"],benefits:["Clear project milestones","Accessible, useful interfaces","Transparent handoff"]},
 design:{preset:"hardline",...PRESETS.hardline,density:"comfortable",palette:"lime",headingFont:"system"},
 recipe:{category:"agency",template:"classic"},
 media:{style:"shapes",image:"",alt:"Business hero image"},
 pages:composeRecipe("agency","classic")};}
export function normalizeProject(raw={}){
 const fallback=defaultProject();const source=raw&&typeof raw==="object"?raw:{};
 const b0=source.business&&typeof source.business==="object"?source.business:{};
 const b={};
 for(const [k,max] of Object.entries({name:80,industry:80,tagline:130,summary:500,email:150,phone:60,location:90,cta:75}))b[k]=str(b0[k]??fallback.business[k],max);
 b.services=array(b0.services??fallback.business.services,8);b.benefits=array(b0.benefits??fallback.business.benefits,6);
 if(!b.name)b.name="Your business";if(!b.services.length)b.services=["Your service"];
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))b.email="";
 b.phone=b.phone.replace(/[^\d+(). -]/g,"");
 const d0=source.design&&typeof source.design==="object"?source.design:{};
 const r0=source.recipe&&typeof source.recipe==="object"?source.recipe:{};
 const m0=source.media&&typeof source.media==="object"?source.media:{};
 const style=Object.hasOwn(VISUAL_STYLES,m0.style)?m0.style:"shapes";
 const candidate=typeof m0.image==="string"?m0.image:"";
 const image=candidate.length<=1_450_000 && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(candidate)?candidate:"";
 const media={style,image,alt:str(m0.alt??"Uploaded business image",130)};
 const recipe={
   category:Object.hasOwn(CATEGORIES,r0.category)?r0.category:"agency",
   template:Object.hasOwn(TEMPLATES,r0.template)?r0.template:"classic"
 };
 const preset=Object.hasOwn(PRESETS,d0.preset)?d0.preset:"hardline",dBase=PRESETS[preset];
 const d={preset,accent:color(d0.accent,dBase.accent),bg:color(d0.bg,dBase.bg),ink:color(d0.ink,dBase.ink),surface:color(d0.surface,dBase.surface),radius:Math.max(0,Math.min(24,Math.round(Number(d0.radius??dBase.radius)||0))),font:["system","serif","mono"].includes(d0.font)?d0.font:dBase.font,shadow:typeof d0.shadow==="boolean"?d0.shadow:dBase.shadow,density:["compact","comfortable","spacious"].includes(d0.density)?d0.density:"comfortable",
 palette:Object.hasOwn(PALETTES,d0.palette)?d0.palette:"custom",
 headingFont:["system","serif","mono","humanist","display"].includes(d0.headingFont)?d0.headingFont:(["serif","mono"].includes(d0.font)?d0.font:"system")};
 const rawPages=Array.isArray(source.pages)?source.pages:[];
 const pages=PAGE_DEFS.map(def=>{
   const given=rawPages.find(p=>p?.slug===def.slug),original=fallback.pages.find(p=>p.slug===def.slug);
   const arr=Array.isArray(given?.sections)?given.sections:original.sections;
   const used=new Set();
   const sections=arr.slice(0,15).filter(x=>x&&Object.hasOwn(ADAPTERS,x.componentId)).map((x,i)=>{
      let id=str(x.id,70).replace(/[^a-zA-Z0-9_-]/g,"-")||def.slug+"-"+i;
      while(used.has(id))id+="-"+i;used.add(id);
      return {id,componentId:x.componentId};
   });
   // A blank page is allowed to be edited; avoid assuming hidden defaults.
   return {slug:def.slug,title:def.title,sections};
 });
 return {schemaVersion:1,recipe,media,business:b,design:d,pages};
}
const purl=slug=>slug==="index"?"index.html":slug+".html";
const mail=b=>b.email?"mailto:"+encodeURIComponent(b.email)+"?subject="+encodeURIComponent("Website enquiry - "+b.name):"contact.html";
const btn=(b,caption)=>`<a class="wd-button wd-button--primary" href="${esc(mail(b))}">${esc(caption||b.cta)} ↗</a>`;
const section=(content,cls="")=>`<section class="wd-section ${cls}"><div class="wd-container">${content}</div></section>`;
const details=(q,a)=>`<details class="wd-disclosure"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`;
const heading=(eyebrow,title,desc)=>`<div class="wd-stack"><p class="wd-eyebrow">${esc(eyebrow)}</p><h2 class="wd-heading">${esc(title)}</h2><p class="wd-lead">${esc(desc)}</p></div>`;
const heroTitle=(b,slug)=>slug==="index"?b.tagline:slug==="about"?"Meet "+b.name:slug==="services"?"What we offer":"Start a conversation";
const heroDescription=(b,slug)=>slug==="index"?b.summary:slug==="about"?"A sample introduction for "+b.name+". "+b.summary:slug==="services"?"Explore our capabilities and choose the right starting point.":"Share your goals. This example site has no live booking service.";
function heroVisual(project){
 const media=project?.media||{style:"shapes",image:"",alt:"Business visual"};
 if(media.style==="photo"&&media.image)return `<div class="engine-visual engine-visual--photo"><img src="${esc(media.image)}" alt="${esc(media.alt)}" decoding="async"></div>`;
 const style=["shapes","editorial","blueprint"].includes(media.style)?media.style:"editorial";
 const label=style==="blueprint"?"Abstract architectural grid":style==="editorial"?"Abstract editorial collage":"Abstract geometric illustration";
 return `<div class="engine-visual engine-visual--${style}" role="img" aria-label="${label}"><span class="engine-visual-circle"></span><span class="engine-visual-frame"></span><span class="engine-visual-type">FORM / FUNCTION</span></div>`;
}
function adapter(id,b,slug,isFirstHero=true,project){
 const title=heroTitle(b,slug),subtitle=heroDescription(b,slug),tag=b.industry+" / "+b.location;
 const tagName=isFirstHero?"h1":"h2";
 const story=CATEGORY_STORIES[project?.recipe?.category]||CATEGORY_STORIES.agency;
 switch(id){
 case "WDT-HERO-001":return section(`<div class="engine-center"><p class="wd-eyebrow">${esc(tag)}</p><${tagName} class="wd-heading">${esc(title)}</${tagName}><p class="wd-lead">${esc(subtitle)}</p><div class="wd-actions">${btn(b)}</div></div>`,"engine-hero");
 case "WDT-HERO-002":return section(`<div class="wd-hero"><div class="wd-stack"><p class="wd-eyebrow">${esc(tag)}</p><${tagName} class="wd-heading">${esc(title)}</${tagName}><p class="wd-lead">${esc(subtitle)}</p><div class="wd-actions">${btn(b)}<a href="services.html" class="wd-button">Explore services</a></div></div>${heroVisual(project)}</div>`,"engine-hero");
 case "WDT-HERO-003":return section(`<div class="wd-hero"><div class="wd-stack"><p class="wd-eyebrow">${esc(tag)}</p><${tagName} class="wd-heading">${esc(title)}</${tagName}><p class="wd-lead">${esc(subtitle)}</p>${btn(b,"Discuss your project")}</div>${heroVisual(project)}</div>`,"engine-hero wd-section--accent");
 case "WDT-SEC-002":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">Our capabilities</p><h2>${esc(story.services)}</h2></div></div><div class="wd-grid">${b.services.map((s,i)=>`<article class="wd-card wd-stack"><span class="wd-icon" aria-hidden="true">${["✦","◇","◎","↗"][i%4]}</span><h3>${esc(s)}</h3><p>Talk with us about ${esc(s.toLowerCase())} and how it fits your project.</p><a href="${esc(mail(b))}">Discuss service ↗</a></article>`).join("")}</div>`);
 case "WDT-TEST-003":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">How we work</p><h2>A clearer process</h2></div></div><div class="wd-grid">${b.benefits.map((s,i)=>`<article class="wd-card"><span class="wd-badge">0${i+1}</span><h3>${esc(s)}</h3><p>Illustrative process description — customize before client use.</p></article>`).join("")}</div>`,"engine-soft");
 case "WDT-BLOCK-003":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">The process</p><h2>From idea to delivery</h2></div></div><div class="wd-grid wd-steps">${story.process.map(s=>`<article class="wd-card wd-step"><h3>${s}</h3><p>Agree on scope, deliverables, review and next steps.</p></article>`).join("")}</div>`);
 case "WDT-SEC-003":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">FAQ</p><h2>Good things to know</h2></div></div>${details("Can the design be changed?","Yes. Colors, typography, composition and section order are editable in the design engine.")}${details("How do we start?","Begin with a clear brief and project goals. Details on this example website are illustrative.")}`);
 case "WDT-SEC-004":return section(`<div class="wd-stack engine-cta"><p class="wd-eyebrow">Your next project</p><h2>Build something useful.</h2><p>Start with a focused brief and a shared goal.</p>${btn(b,"Get in touch")}</div>`,"wd-section--accent");
 case "WDT-PORT-001":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">Example projects only</p><h2>${esc(story.portfolio)}</h2></div></div><div class="wd-grid">${b.services.slice(0,3).map((s,i)=>`<article class="wd-card"><div class="engine-project">PROJECT 0${i+1}</div><h3>${s}</h3><p>Illustrative case study placeholder, not real client work.</p></article>`).join("")}</div>`);
 case "WDT-PRICE-003":return section(`<div class="engine-two">${heading("Custom proposals","A quote that fits your needs","We discuss scope before prices. No example amount is a binding offer.")}<div class="wd-stack">${details("What affects the proposal?","Requirements, content, integrations, accessibility and timing.")}${btn(b,"Request a quote")}</div></div>`);
 case "WDT-PROD-001":return section(`<div class="wd-section-head"><div><p class="wd-eyebrow">${esc(slug==="index"?"Explore our offering":"Our selection")}</p><h2>${esc(b.industry==="Restaurant"?"Menu highlights":"Featured offerings")}</h2></div></div><div class="wd-grid">${b.services.map((name,i)=>`<article class="wd-card wd-stack"><div class="engine-project" aria-label="Abstract sample offering" role="img">0${i+1}</div><h3>${esc(name)}</h3><p>Sample item. No verified price, inventory, booking or availability.</p></article>`).join("")}</div>`);
 case "WDT-BOOK-002":return section(`<div class="engine-two">${heading("Preferred date enquiry","An easy way to get in touch","This is a sample date preference layout, not a reservation. No appointment is requested, stored or confirmed.")}<div class="wd-card wd-stack"><div class="wd-field"><label for="date-preference">Preferred date</label><input id="date-preference" class="wd-input" type="date" disabled></div><button class="wd-button" disabled type="button">Not connected — demo only</button><p class="wd-preview-label">Appointments require an approved scheduling service.</p>${b.email?`<a href="${esc(mail(b))}">Contact by email ↗</a>`:""}</div></div>`);
 case "WDT-BOOK-001":return section(`<div class="engine-two">${heading("Contact preview","Let's talk about your goals","The example form is disabled and does not send, collect or store any information.")}<div class="wd-card wd-stack"><p><strong>Contact email:</strong> ${b.email?`<a href="${esc(mail(b))}">${esc(b.email)}</a>`:"Not provided"}</p><p><strong>Phone:</strong> ${esc(b.phone||"Not provided")}</p><p><strong>Location:</strong> ${esc(b.location)}</p><div class="wd-field"><label for="contact-example">Message</label><textarea id="contact-example" class="wd-input" rows="3" disabled placeholder="Demo only"></textarea></div><button type="button" class="wd-button" disabled>Form disabled in demo</button><p class="wd-preview-label">No booking or message is sent.</p></div></div>`);
 default:return "";
 }
}
const header=(b,active)=>{
 const links=PAGE_DEFS.map(p=>`<a href="${purl(p.slug)}" ${p.slug===active?'aria-current="page"':""}>${p.title}</a>`).join("");
 return `<header class="engine-header"><div class="wd-container engine-header-row"><a class="engine-brand" href="index.html">${esc(b.name)}</a><nav class="engine-nav" aria-label="Main navigation">${links}</nav><details class="engine-mobile"><summary>Menu</summary><nav aria-label="Mobile navigation">${links}</nav></details></div></header>`;
};
const footer=b=>`<footer class="engine-footer"><div class="wd-container engine-footer-row"><span>${esc(b.name)} · Illustrative website demo</span><nav aria-label="Footer">${PAGE_DEFS.map(p=>`<a href="${purl(p.slug)}">${p.title}</a>`).join("")}</nav></div></footer>`;
export function renderPage(raw,slug="index"){
 const p=normalizeProject(raw);const page=p.pages.find(x=>x.slug===slug)||p.pages[0];
 let seenHero=false;
 const html=page.sections.map(s=>{
  const isHero=ADAPTERS[s.componentId]?.family==="hero";
  const rendered=adapter(s.componentId,p.business,page.slug,!seenHero,p);
  if(isHero)seenHero=true;
  return rendered;
 }).join("\n");
 // If first section is not a hero, preserve document heading hierarchy with page H1.
 const fallback=seenHero?"":`<div class="wd-container"><h1 class="engine-page-title">${esc(page.title)}</h1></div>`;
 return `<!doctype html><html lang="en" data-wd-theme="${p.design.preset}" data-wd-layout="${p.recipe.template}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(p.business.summary.slice(0,155))}"><title>${page.title} | ${esc(p.business.name)}</title><link rel="stylesheet" href="assets/foundry.css"><link rel="stylesheet" href="assets/site.css"></head><body id="top">${header(p.business,page.slug)}<main id="main-content">${fallback}${html}</main>${footer(p.business)}</body></html>`;
}
const fonts={humanist:' "Trebuchet MS",Verdana,sans-serif',display:'Impact,"Arial Narrow",sans-serif',system:'system-ui,-apple-system,"Segoe UI",sans-serif',serif:'Georgia,"Times New Roman",serif',mono:'ui-monospace,Consolas,monospace'};
const VISUAL_CSS="\n.engine-visual{position:relative;isolation:isolate;min-height:clamp(230px,34vw,450px);overflow:hidden;\n background:var(--wd-accent);border:var(--wd-line);box-shadow:var(--wd-shadow)}\n.engine-visual>*{position:absolute;display:block}\n.engine-visual-circle{left:36%;top:5%;width:57%;aspect-ratio:1;background:var(--wd-surface);\n border:3px solid var(--wd-ink);border-radius:50%;box-shadow:10px 10px 0 color-mix(in srgb,var(--wd-ink) 20%,transparent)}\n.engine-visual-frame{left:9%;bottom:8%;width:63%;height:46%;transform:rotate(-10deg);\n border:3px solid var(--wd-ink);background:var(--wd-ink)}\n.engine-visual-type{left:14%;bottom:15%;z-index:2;font-size:clamp(1.3rem,3vw,3rem);font-weight:900;\n letter-spacing:-.08em;color:var(--wd-surface)}\n.engine-visual--editorial{background:linear-gradient(137deg,var(--wd-accent) 0 56%,var(--wd-bg) 56%)}\n.engine-visual--editorial .engine-visual-circle{border-radius:0;transform:rotate(15deg);width:43%;left:43%;top:16%}\n.engine-visual--editorial .engine-visual-frame{transform:rotate(7deg);height:38%;bottom:12%}\n.engine-visual--blueprint{background-color:var(--wd-ink);\n background-image:linear-gradient(color-mix(in srgb,var(--wd-accent) 28%,transparent) 1px,transparent 1px),\n linear-gradient(90deg,color-mix(in srgb,var(--wd-accent) 28%,transparent) 1px,transparent 1px);background-size:25px 25px}\n.engine-visual--blueprint .engine-visual-circle{border-radius:10px;background:transparent;border-color:var(--wd-accent)}\n.engine-visual--blueprint .engine-visual-frame{background:transparent;border-color:var(--wd-accent)}\n.engine-visual--blueprint .engine-visual-type{color:var(--wd-accent)}\n.engine-visual--photo img{position:relative;width:100%;height:100%;min-height:260px;object-fit:cover}\nhtml[data-wd-layout=\"showcase\"] .engine-hero .wd-heading{font-size:clamp(3rem,7vw,6.5rem);letter-spacing:-.075em}\nhtml[data-wd-layout=\"showcase\"] .engine-visual{min-height:clamp(280px,39vw,530px)}\nhtml[data-wd-layout=\"conversion\"] .engine-hero{background:color-mix(in srgb,var(--wd-accent) 35%,var(--wd-bg))}\nhtml[data-wd-layout=\"conversion\"] .engine-cta{border-left:7px solid var(--wd-ink);padding-left:clamp(1rem,3vw,2.5rem)}\nhtml[data-wd-layout=\"classic\"] .engine-hero .wd-heading{max-width:14ch}\n@media(max-width:720px){.engine-visual{min-height:240px}}\n";
export function themeCSS(raw){
 const d=normalizeProject(raw).design;const density={compact:".8",comfortable:"1",spacious:"1.2"}[d.density];
 return `/* Generated site colors and layout */
html[data-wd-theme]{--wd-accent:${d.accent};--wd-bg:${d.bg};--wd-ink:${d.ink};--wd-surface:${d.surface};--wd-radius:${d.radius}px;--wd-shadow:${d.shadow?"4px 4px 0 var(--wd-ink)":"0 0 0 transparent"};--wd-font:${fonts[d.font]};--wd-heading-font:${fonts[d.headingFont]};--wd-density:${density}}
html{background:var(--wd-bg);color:var(--wd-ink)}:is(h1,h2,h3,.wd-heading){font-family:var(--wd-heading-font);font-weight:800}body{margin:0;font-family:var(--wd-font)}.engine-header{background:var(--wd-surface);border-bottom:var(--wd-line);position:relative;z-index:4}.engine-header-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:1rem}.engine-brand{font-size:1.15rem;font-weight:900;letter-spacing:-.04em;text-decoration:none}.engine-nav{display:flex;gap:1.1rem;flex-wrap:wrap}.engine-nav a,.engine-mobile a{font-size:.86rem;font-weight:750;text-decoration:none}.engine-nav a[aria-current=page]{text-decoration:underline;text-underline-offset:4px}.engine-mobile{display:none;position:relative}.engine-mobile summary{cursor:pointer;padding:.6rem .85rem;border:var(--wd-line);min-height:44px;font-weight:750}.engine-mobile nav{position:absolute;right:0;top:calc(100% + 4px);min-width:175px;padding:1rem;background:var(--wd-surface);border:var(--wd-line);box-shadow:var(--wd-shadow);display:grid;gap:.8rem}.engine-footer{border-top:var(--wd-line);background:var(--wd-surface)}.engine-footer-row{padding-block:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.8rem;font-size:.8rem}.engine-footer nav{display:flex;flex-wrap:wrap;gap:.9rem}.engine-hero{padding-block:calc(clamp(2.5rem,7vw,6rem)*var(--wd-density))}.engine-center{display:grid;justify-items:center;gap:1rem;text-align:center;max-width:790px;margin:auto}.engine-center .wd-actions{justify-content:center}.engine-soft{background:color-mix(in srgb,var(--wd-accent) 16%,var(--wd-bg))}.engine-cta{justify-items:start}.engine-cta h2{font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.05em;line-height:1.1;margin:0}.engine-feature{padding:1.4rem;border:var(--wd-line);background:var(--wd-surface);box-shadow:var(--wd-shadow);display:grid;gap:.9rem}.engine-feature span{border:1px solid var(--wd-muted);padding:.6rem}.engine-project{min-height:140px;background:var(--wd-accent);border:1px solid var(--wd-ink);display:grid;place-items:center;font-weight:900;letter-spacing:-.04em}.engine-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:center;gap:clamp(1.5rem,5vw,4rem)}.engine-page-title{font-size:clamp(2rem,4vw,3rem)}.wd-disclosure{border:var(--wd-line);background:var(--wd-surface);margin-block:.65rem}.wd-disclosure summary{min-height:44px;padding:1rem;cursor:pointer;font-weight:800}.wd-disclosure p{padding:0 1rem 1rem;margin:0}.wd-section{padding-block:calc(clamp(2.5rem,7vw,6rem)*var(--wd-density))}.wd-section--accent .wd-lead{color:var(--wd-ink)}.wd-card{overflow-wrap:anywhere}
@media(max-width:720px){.engine-nav{display:none}.engine-mobile{display:block}.engine-two{grid-template-columns:1fr}.wd-hero{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}html{scroll-behavior:auto}}`+VISUAL_CSS;
}
export function buildSite(raw,foundryCSS){
 if(typeof foundryCSS!=="string"||!foundryCSS.includes(".wd-button"))throw Error("Foundry CSS unavailable");
 const p=normalizeProject(raw);const out={};
 for(const page of PAGE_DEFS)out[purl(page.slug)]=renderPage(p,page.slug);
 out["assets/foundry.css"]=foundryCSS;
 out["assets/site.css"]=themeCSS(p);
 out["project.json"]=JSON.stringify(p,null,2)+"\n";
 out["README.md"]=`# ${p.business.name} — Web Design Engine demo
Generated with WebDesignToolkit Engine ${VERSION}. Open index.html locally, or upload all exported files to an authorized static host.
All four pages are static. The optional contact form is intentionally disabled, so no messages or appointments are sent. Project text, proof, features and artwork are illustrative. Verify and customize everything before publishing as a real business.
Change project.json inside the engine and export again to revise the design. This MVP supports an explicit subset of Foundry IDs, not all 44 draft entries.
`;
 return out;
}
export function makePreviewDocument(raw,slug,foundryCSS){
 return renderPage(raw,slug).replace('<link rel="stylesheet" href="assets/foundry.css"><link rel="stylesheet" href="assets/site.css">',`<style>${foundryCSS}</style><style>${themeCSS(raw)}</style>`);
}
function crc32(bytes){
 let c=0xFFFFFFFF;
 for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c&1)?(c>>>1)^0xEDB88320:(c>>>1)}
 return (c^0xFFFFFFFF)>>>0;
}
const u16=(a,o,v)=>{a[o]=v&255;a[o+1]=(v>>>8)&255};
const u32=(a,o,v)=>{u16(a,o,v&65535);u16(a,o+2,v>>>16)};
export function zipFiles(files){
 const te=new TextEncoder(),pieces=[],directory=[];let pos=0;
 for(const [name,data] of Object.entries(files).sort(([a],[b])=>a.localeCompare(b))){
  if(!/^[a-zA-Z0-9._/-]+$/.test(name)||name.includes("..")||name.startsWith("/"))throw Error("Unsafe ZIP file");
  const path=te.encode(name),body=te.encode(String(data)),crc=crc32(body);
  if(body.length>30_000_000)throw Error("Export too large");
  const head=new Uint8Array(30+path.length);
  u32(head,0,0x04034b50);u16(head,4,20);u16(head,6,0x800);u32(head,14,crc);u32(head,18,body.length);u32(head,22,body.length);u16(head,26,path.length);head.set(path,30);
  pieces.push(head,body);
  const cd=new Uint8Array(46+path.length);
  u32(cd,0,0x02014b50);u16(cd,4,20);u16(cd,6,20);u16(cd,8,0x800);u32(cd,16,crc);u32(cd,20,body.length);u32(cd,24,body.length);u16(cd,28,path.length);u32(cd,42,pos);cd.set(path,46);
  directory.push(cd);pos+=head.length+body.length;
 }
 const end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,directory.length);u16(end,10,directory.length);u32(end,12,directory.reduce((n,x)=>n+x.length,0));u32(end,16,pos);
 return new Blob([...pieces,...directory,end],{type:"application/zip"});
}
