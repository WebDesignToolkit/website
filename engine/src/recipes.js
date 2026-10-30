/* Agency recipe library v0.2. Category selection affects layout and optional example content, not client claims. */
export const CATEGORIES={
 agency:{label:"Web & creative agency",industry:"Creative agency",examples:{
 name:"Example Creative Co.",tagline:"Design that moves business forward.",summary:"A sample creative agency website focused on digital strategy, user experience and thoughtful development.",services:["Brand identity","Website design","Web development","Conversion optimization"],benefits:["Collaborative planning","Responsive layouts","Clear delivery process"]}},
 dental:{label:"Dental clinic",industry:"Dental clinic",examples:{
 name:"Example Dental Studio",tagline:"A more confident smile starts here.",summary:"A fictional dental clinic website demonstrating services and enquiry layouts. Replace all services, treatment claims, and details with verified clinic information.",services:["Preventive dentistry","Dental consultations","Teeth cleaning","Restorative care"],benefits:["Clear appointment information","Treatment questions answered","Thoughtful patient communication"]}},
 restaurant:{label:"Restaurant & café",industry:"Restaurant",examples:{
 name:"Example Table & Co.",tagline:"A place to meet, eat and unwind.",summary:"A fictional restaurant website with sample menu categories, directions, and enquiry layouts. No prices, reservations or opening hours are verified.",services:["Breakfast","Lunch","Coffee & beverages","Private events"],benefits:["Easy-to-read menus","Location and directions","Clear enquiry options"]}},
 realestate:{label:"Real estate",industry:"Real estate agency",examples:{
 name:"Example Property Group",tagline:"Find the space for your next chapter.",summary:"A fictional real-estate agency website showing sample property service categories and consultation enquiries. No properties, prices or availability are real.",services:["Residential sales","Rental search","Property consultations","Market guidance"],benefits:["Clear listing information","Transparent enquiry process","Local-market context"]}},
 education:{label:"Education & training",industry:"Education and training",examples:{
 name:"Example Learning Hub",tagline:"A clear path to the next skill.",summary:"A sample education website with course discovery, program highlights and enquiry sections. No claims about credentials, admissions or outcomes.",services:["Professional courses","Online workshops","Mentoring","Career guidance"],benefits:["Accessible course information","Clear learning pathways","Supportive communication"]}},
 services:{label:"Local service business",industry:"Local services",examples:{
 name:"Example Home Services",tagline:"Helpful service, when you need it.",summary:"A fictional local-services website with descriptions, enquiry options and service-area information. No guarantees, certifications or response times are claimed.",services:["Repairs","Maintenance","New installations","Service consultation"],benefits:["Clear service descriptions","Straightforward enquiries","Helpful project updates"]}}
};
export const TEMPLATES={
 classic:{label:"Classic Business",description:"A familiar service-led layout, with clear navigation, offerings, process and enquiry.",icon:"▦"},
 showcase:{label:"Visual Showcase",description:"An editorial layout with featured work, visual storytelling and supporting sections.",icon:"◈"},
 conversion:{label:"Lead-focused",description:"A direct introduction, service highlights, proof-free trust and repeated calls to action.",icon:"↗"}
};
export const VISUAL_STYLES={
 shapes:{label:"Bold Shapes",description:"Playful geometric artwork"},
 editorial:{label:"Editorial Frame",description:"Layered art direction"},
 blueprint:{label:"Structured Grid",description:"Architectural line work"},
 photo:{label:"Client Photo",description:"Your uploaded image"}
};
export const CATEGORY_VISUALS={agency:"shapes",dental:"editorial",restaurant:"editorial",realestate:"blueprint",education:"blueprint",services:"shapes"};
export const CATEGORY_STORIES={
 agency:{services:"Creative capabilities",process:["Discover","Design","Build"],portfolio:"Selected ideas"},
 dental:{services:"Care and consultations",process:["Explore options","Discuss your needs","Make an enquiry"],portfolio:"Clinic information"},
 restaurant:{services:"Menus and experiences",process:["Explore the menu","Plan a visit","Contact the team"],portfolio:"Dining experiences"},
 realestate:{services:"Property services",process:["Share your needs","Review options","Arrange a conversation"],portfolio:"Property examples"},
 education:{services:"Learning programs",process:["Explore programs","Choose a path","Ask questions"],portfolio:"Learning opportunities"},
 services:{services:"How we can help",process:["Describe the issue","Discuss a plan","Request a quote"],portfolio:"Service highlights"}
};
export const PALETTES={
 lime:{label:"Electric Lime",accent:"#D4FB57",bg:"#FBFAF6",surface:"#FFFFFF",ink:"#17191C"},
 ocean:{label:"Ocean Blue",accent:"#8CCAF5",bg:"#F1F7FB",surface:"#FFFFFF",ink:"#17314A"},
 terracotta:{label:"Warm Terracotta",accent:"#F2B4A0",bg:"#FCF7F2",surface:"#FFFFFF",ink:"#3E2922"},
 forest:{label:"Forest Green",accent:"#A9D7AE",bg:"#F4F8F1",surface:"#FFFFFF",ink:"#193C2C"},
 lavender:{label:"Modern Lavender",accent:"#C8BBF7",bg:"#F7F5FC",surface:"#FFFFFF",ink:"#2D2545"},
 saffron:{label:"Saffron & Ivory",accent:"#F7BF64",bg:"#FFF9EB",surface:"#FFFFFF",ink:"#422D1C"}
};
const def=id=>({componentId:id});
const common={
 about:["WDT-HERO-001","WDT-BLOCK-003","WDT-TEST-003","WDT-SEC-004"],
 contact:["WDT-HERO-001","WDT-BOOK-001","WDT-SEC-003"]
};
const recipeLayouts={
 classic:{
  index:["WDT-HERO-002","WDT-SEC-002","WDT-TEST-003","WDT-SEC-004"],
  services:["WDT-HERO-003","WDT-SEC-002","WDT-PRICE-003","WDT-SEC-003"]
 },
 showcase:{
  index:["WDT-HERO-002","WDT-PORT-001","WDT-SEC-002","WDT-BLOCK-003","WDT-SEC-004"],
  services:["WDT-HERO-001","WDT-SEC-002","WDT-PORT-001","WDT-SEC-003","WDT-SEC-004"]
 },
 conversion:{
  index:["WDT-HERO-003","WDT-SEC-002","WDT-PRICE-003","WDT-TEST-003","WDT-SEC-004"],
  services:["WDT-HERO-003","WDT-SEC-002","WDT-TEST-003","WDT-PRICE-003","WDT-SEC-004"]
 }
};
function variantForCategory(category,template){
 const layout=recipeLayouts[template]||recipeLayouts.classic;
 const pages=structuredClone({...common,...layout});
 // These are differences in composition, not invented content/data.
 if(category==="restaurant"){
   const i=pages.index.indexOf("WDT-SEC-002");
   if(i>=0)pages.index[i]="WDT-PROD-001";
   const s=pages.services.indexOf("WDT-SEC-002");
   if(s>=0)pages.services[s]="WDT-PROD-001";
 }
 if(category==="realestate"){
   if(!pages.index.includes("WDT-PORT-001"))pages.index.splice(2,0,"WDT-PORT-001");
 }
 if(category==="dental"){
   pages.contact=["WDT-HERO-001","WDT-BOOK-002","WDT-SEC-003"];
 }
 if(category==="education"){
   if(!pages.index.includes("WDT-BLOCK-003"))pages.index.splice(2,0,"WDT-BLOCK-003");
 }
 if(category==="agency" && template==="classic"){
   pages.index.splice(2,0,"WDT-PORT-001");
 }
 return pages;
}
export function composeRecipe(category="agency",template="classic"){
 const c=Object.hasOwn(CATEGORIES,category)?category:"agency";
 const t=Object.hasOwn(TEMPLATES,template)?template:"classic";
 const config=variantForCategory(c,t);
 return ["index","about","services","contact"].map(slug=>({
  slug,title:slug==="index"?"Home":slug.charAt(0).toUpperCase()+slug.slice(1),
  sections:config[slug].slice(0,15).map((componentId,i)=>({id:slug+"-"+t+"-"+i,componentId}))
 }));
}
export function categoryExample(category){
 const c=Object.hasOwn(CATEGORIES,category)?category:"agency";
 return structuredClone(CATEGORIES[c].examples);
}
