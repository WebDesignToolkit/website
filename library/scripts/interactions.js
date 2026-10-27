"use strict";
/* Demo-only local form handling. Never sends or retains contact details. */
document.addEventListener("submit",event=>{
 const form=event.target;
 if(!(form instanceof HTMLFormElement)||!form.matches("[data-wdt-demo-form]"))return;
 event.preventDefault();
 if(!form.reportValidity())return;
 const status=form.querySelector("[data-wdt-form-status]");
 if(status)status.textContent="Demo validation passed. NO booking made; NO data sent or saved.";
});
