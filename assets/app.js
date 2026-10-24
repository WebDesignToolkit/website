"use strict";
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const results = document.querySelector("#results");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
let resources = [];

function make(tag, text, cls) {
  const element = document.createElement(tag);
  if (cls) element.className = cls;
  if (text !== undefined) element.textContent = String(text);
  return element;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const selected = category.value;
  const filtered = resources.filter(function (item) {
    const haystack = [item.name,item.description,item.repository,item.category].concat(item.tags).join(" ").toLowerCase();
    return (!selected || item.category === selected) && (!query || haystack.includes(query));
  });
  results.replaceChildren();
  const fragment = document.createDocumentFragment();
  filtered.forEach(function (item) {
    const card = make("a",undefined,"card");
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", item.name + " — open upstream GitHub repository");
    const meta = make("div",undefined,"meta");
    meta.append(make("span",item.category.replace(/-/g," "),"tag"),make("span",item.status || "candidate"));
    const name = make("span",item.name,"card-title");
    const description = make("p",item.description || "See upstream repository for description.");
    const foot = make("div",undefined,"card-footer");
    foot.append(make("span",item.license_spdx && item.license_spdx !== "NOASSERTION" ? "GitHub license: "+item.license_spdx : "License: needs review"),make("span","Upstream ↗"));
    card.append(meta,name,description,foot);
    fragment.append(card);
  });
  results.append(fragment);
  count.textContent = filtered.length + " of " + resources.length + " resources";
  empty.hidden = filtered.length !== 0;
}
async function init(){
 try {
  const response = await fetch("./data/resources.json",{cache:"no-store"});
  if (!response.ok) throw new Error("HTTP " + response.status);
  const parsed = await response.json();
  if (!Array.isArray(parsed)) throw new Error("Invalid catalog");
  resources = parsed;
  const cats = Array.from(new Set(resources.map(function(i){return i.category;}))).sort();
  cats.forEach(function(cat){const option=make("option",cat.replace(/-/g," "));option.value=cat;category.append(option);});
  render();
 } catch(err){
  count.textContent = "Catalog unavailable";
  results.append(make("p","The local resource snapshot could not be loaded. Open the canonical catalog on GitHub."));
  console.error(err);
 }
}
search.addEventListener("input",render);
category.addEventListener("change",render);
init();
