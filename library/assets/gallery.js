"use strict";
const $=id=>document.getElementById(id);
let items=[],selected="WDT-SEC-001",category="all",theme="hardline";
function active(selector,key,value){document.querySelectorAll(selector).forEach(b=>b.setAttribute("aria-pressed",String(b.dataset[key]===value)))}
function show(id){const item=items.find(i=>i.id===id);if(!item)return;selected=id;
if(item.type==="theme"){theme=item.name.toLowerCase();$("preview").dataset.wdTheme=theme;active("[data-theme]","theme",theme)}
$("itemId").textContent=item.id;$("itemName").textContent=item.name;
$("itemMeta").textContent=item.type+" / "+item.group+" · Draft demo, not production certified";
$("previewContent").innerHTML=item.html; // Only trusted, version-controlled local manifest, not user input.
$("source").textContent=item.html;
$("notice").textContent="Copy the HTML and include styles/library.css. Replace sample content and links.";
document.querySelectorAll(".item").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===id)))}
function list(){const q=$("search").value.toLowerCase().trim();const matching=items.filter(i=>(category==="all"||i.type===category)&&[i.id,i.name,i.type,i.group].join(" ").toLowerCase().includes(q));
const frag=document.createDocumentFragment();for(const i of matching){const b=document.createElement("button");b.className="item";b.type="button";b.dataset.id=i.id;b.setAttribute("aria-pressed",String(i.id===selected));const name=document.createElement("strong");name.textContent=i.name;const meta=document.createElement("span");meta.textContent=i.id+" · "+i.type;b.append(name,meta);b.addEventListener("click",()=>show(i.id));frag.append(b)}$("itemList").replaceChildren(frag);$("count").textContent=matching.length+" / "+items.length+" entries";$("empty").hidden=matching.length!==0;if(matching.length&&!matching.some(x=>x.id===selected))show(matching[0].id)}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.filter;active("[data-filter]","filter",category);list()}));
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>{theme=b.dataset.theme;$("preview").dataset.wdTheme=theme;active("[data-theme]","theme",theme)}));
document.querySelectorAll("[data-width]").forEach(b=>b.addEventListener("click",()=>{$("preview").className="canvas "+b.dataset.width;active("[data-width]","width",b.dataset.width)}));
$("search").addEventListener("input",list);
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("source").textContent);$("notice").textContent="Copied HTML. Include the library stylesheet and replace sample content."}catch{$("notice").textContent="Clipboard unavailable. Select and copy the code manually."}});
fetch("./data/registry.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(data=>{if(!Array.isArray(data.items))throw Error("Invalid registry");items=data.items;list();show(selected)}).catch(err=>{$("count").textContent="Registry unavailable";$("itemList").textContent="See GitHub design-system source.";console.error(err)});
