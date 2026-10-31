const controller=new AbortController();
const notice=document.querySelector("#notice");
document.querySelector(".fs-alert-close").addEventListener("click",()=>{notice.hidden=true;document.querySelector("#restore").focus();},{signal:controller.signal});
document.querySelector("#restore").addEventListener("click",()=>{notice.hidden=false;notice.querySelector("button").focus();},{signal:controller.signal});
window.addEventListener("pagehide",()=>controller.abort(),{once:true});
