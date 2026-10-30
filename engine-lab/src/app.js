import {defaultProject,normalizeProject,PRESETS,PAGE_DEFS,ADAPTERS,makePreviewDocument,buildSite,zipFiles,VERSION} from "./engine.js";
import {CATEGORIES,TEMPLATES,PALETTES,VISUAL_STYLES,CATEGORY_VISUALS,composeRecipe,categoryExample} from "./recipes.js";
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
function showPalette(){
 const colors=["accent","bg","surface","ink"];
 const preview=$("palette-preview");preview.replaceChildren();
 for(const k of colors){const swatch=document.createElement("span");swatch.style.backgroundColor=project.design[k];preview.append(swatch)}
}
function renderTemplateGallery(){
 const gallery=$("template-gallery");gallery.replaceChildren();
 for(const [key,template] of Object.entries(TEMPLATES)){
  const button=document.createElement("button");
  button.type="button";button.className="template-card";button.dataset.templateChoice=key;
  const chosen=project.recipe.template===key;button.setAttribute("aria-pressed",String(chosen));
  const miniature=document.createElement("span");miniature.className="template-mini template-mini--"+key;miniature.setAttribute("aria-hidden","true");
  const bar=document.createElement("span");bar.className="template-mini-bar";
  const hero=document.createElement("span");hero.className="template-mini-hero";
  const lines=document.createElement("span");lines.className="template-mini-lines";
  const dot=document.createElement("span");dot.className="template-mini-art";
  const grids=document.createElement("span");grids.className="template-mini-grid";
  miniature.append(bar,hero,lines,dot,grids);
  const title=document.createElement("strong");title.textContent=template.label;
  const subtitle=document.createElement("small");subtitle.textContent=template.description;
  const tick=document.createElement("span");tick.className="template-card-select";tick.textContent=chosen?"Selected ✓":"Select layout ↗";
  button.append(miniature,title,subtitle,tick);
  button.addEventListener("click",()=>{
    $("layout-template").value=key;
    $("layout-template").dispatchEvent(new Event("change",{bubbles:true}));
  });
  gallery.append(button);
 }
}
function renderVisualGallery(){
 const gallery=$("visual-gallery");gallery.replaceChildren();
 for(const [name,style] of Object.entries(VISUAL_STYLES)){
  const btn=document.createElement("button");btn.type="button";btn.className="visual-card";
  btn.dataset.visualChoice=name;btn.setAttribute("aria-pressed",String(project.media.style===name));
  const thumb=document.createElement("span");thumb.className="visual-thumb visual-thumb--"+name;thumb.setAttribute("aria-hidden","true");
  const label=document.createElement("strong");label.textContent=style.label;
  btn.append(thumb,label);
  btn.addEventListener("click",()=>{project.media.style=name;renderVisualGallery();renderFrame()});
  gallery.append(btn);
 }
}
function syncRecipeControls(){
 $("category").value=project.recipe.category;
 $("layout-template").value=project.recipe.template;
 $("template-info").textContent=TEMPLATES[project.recipe.template].description;
 renderTemplateGallery();
 $("palette").value=project.design.palette||"custom";
 renderVisualGallery();
 $("hero-alt").value=project.media.alt||"";
 showPalette();
}
function syncInputs(){
 syncRecipeControls();
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
for(const [id,category] of Object.entries(CATEGORIES)){
 const option=document.createElement("option");option.value=id;option.textContent=category.label;$("category").append(option);
}
for(const [id,template] of Object.entries(TEMPLATES)){
 const option=document.createElement("option");option.value=id;option.textContent=template.icon+" "+template.label;$("layout-template").append(option);
}
for(const [id,palette] of Object.entries(PALETTES)){
 const option=document.createElement("option");option.value=id;option.textContent=palette.label;$("palette").append(option);
}
{const option=document.createElement("option");option.value="custom";option.textContent="Custom brand colors";$("palette").append(option)}
$("category").addEventListener("change",e=>{
 const category=e.target.value;
 if(!Object.hasOwn(CATEGORIES,category))return;
 project.recipe={category,template:"classic"};
 project.pages=composeRecipe(category,"classic");
 project.business.industry=CATEGORIES[category].industry;
 if(!project.media.image)project.media.style=CATEGORY_VISUALS[category]||"shapes";
 page="index";compose="index";setPressed(".preview-page","page",page);
 syncInputs();setStatus("Category and layout changed; business details preserved");
});
$("layout-template").addEventListener("change",e=>{
 const template=e.target.value;
 if(!Object.hasOwn(TEMPLATES,template))return;
 project.recipe.template=template;
 project.pages=composeRecipe(project.recipe.category,template);
 page="index";compose="index";setPressed(".preview-page","page",page);
 syncInputs();setStatus("New four-page layout applied; business details preserved");
});
$("hero-alt").addEventListener("input",e=>{project.media.alt=e.target.value;renderFrame()});
$("clear-hero").addEventListener("click",()=>{
 project.media.image="";project.media.style="shapes";$("hero-file").value="";
 renderVisualGallery();renderFrame();setStatus("Client photo removed");
});
$("hero-file").addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  if(!["image/png","image/jpeg","image/webp"].includes(file.type))throw Error("Use JPG, PNG or WebP only");
  if(file.size>900_000)throw Error("Photo is too large; maximum 900 KB");
  const data=await new Promise((resolve,reject)=>{
   const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("Could not read image"));reader.readAsDataURL(file);
  });
  if(typeof data!=="string"||data.length>1_450_000||!/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(data))throw Error("Invalid image data");
  project.media.image=data;project.media.style="photo";
  if(!project.media.alt)project.media.alt="Uploaded business photograph";
  $("hero-alt").value=project.media.alt;renderVisualGallery();renderFrame();
  setStatus("Photo added locally; it will be embedded in the exported ZIP");
 }catch(error){setStatus(error.message)}
 finally{e.target.value=""}
});
$("example-content").addEventListener("click",()=>{
 const name=CATEGORIES[project.recipe.category].label;
 if(!confirm("Replace the current business example text with fictional sample content for "+name+"?"))return;
 project.business={...project.business,...categoryExample(project.recipe.category)};
 syncInputs();setStatus("Fictional sample content added for "+name);
});
$("palette").addEventListener("change",e=>{
 const name=e.target.value;
 project.design.palette=name;
 if(name!=="custom" && Object.hasOwn(PALETTES,name))Object.assign(project.design,PALETTES[name]);
 syncInputs();setStatus("Color palette applied across all pages");
});
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
   project.design={...project.design,preset:chosen,radius:PRESETS[chosen].radius,
     font:PRESETS[chosen].font,headingFont:PRESETS[chosen].font,shadow:PRESETS[chosen].shadow};
   syncInputs();return;
  }
  project.design[key]=el.type==="checkbox"?el.checked:el.type==="range"?Number(el.value):el.value;
  $("radius-label").textContent=project.design.radius+"px";renderFrame();
 });
}
for(const el of document.querySelectorAll("[data-color]"))el.addEventListener("input",()=>{
 project.design[el.dataset.color]=el.value.toUpperCase();
 project.design.palette="custom";$("palette").value="custom";showPalette();renderFrame();
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
 if(file.size>1_600_000){setStatus("JSON too large (1.6 MB limit)");return}
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
