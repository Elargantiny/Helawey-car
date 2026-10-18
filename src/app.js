function bindAdminControls(){
  const adminBtn=$("#adminBtn"), adminBtn2=$("#adminBtn2"), menuBtn=$("#menuBtn");
  if(adminBtn) adminBtn.addEventListener("click", window.adminOpen);
  if(adminBtn2) adminBtn2.addEventListener("click", window.adminOpen);
  if(menuBtn) menuBtn.addEventListener("click",()=>$("#menu").classList.toggle("hidden"));
  const loginBtn=$("#loginBtn");
  if(loginBtn) loginBtn.addEventListener("click",async()=>{
    const pin=$("#pin")?.value||"";loginBtn.disabled=true;
    try{
      if(configured()){
        const r=await api("adminLogin",{pin});
        if(!r.success){toast(r.error==="LOCKED"?"محاولات كثيرة، حاول بعد ١٠ دقائق.":r.error==="SET_PIN"?"يجب تغيير رمز PIN داخل Code.gs أولاً.":"رمز PIN غير صحيح.","e");return}
        sessionStorage.setItem("carRental_token",r.token);sessionStorage.setItem(K.session,"1");
        try{await sync()}catch{sessionStorage.removeItem("carRental_token");sessionStorage.removeItem(K.session);toast("تم تسجيل الدخول لكن تعذر تحميل بيانات الإدارة. تحقق من اتصال الخادم ثم أعد المحاولة.","e");return}
        window.adminOpen();
      }else if(ADMIN_PIN&&pin===ADMIN_PIN){sessionStorage.setItem(K.session,"1");window.adminOpen();}
      else toast("رمز PIN غير صحيح.","e");
    }catch{toast("تعذر الاتصال بالخادم.","e")}finally{loginBtn.disabled=false}
  });
  const pin=$("#pin");
  if(pin) pin.addEventListener("keydown",e=>{if(e.key==="Enter") $("#loginBtn")?.click()});
  const showPin=$("#showPin");
  if(showPin) showPin.addEventListener("click",()=>{pin.type=pin.type==="password"?"text":"password";showPin.textContent=pin.type==="password"?"إظهار":"إخفاء"});
  const logout=$("#logout");
  if(logout) logout.addEventListener("click",()=>{sessionStorage.removeItem(K.session);sessionStorage.removeItem("carRental_token");$("#panel").classList.add("hidden");$("#login").classList.remove("hidden")});
  const refresh=$("#refresh");
  if(refresh) refresh.addEventListener("click",async()=>{try{await sync();renderAdmin();toast("تم التحديث.","s")}catch{toast("تعذر الاتصال بالخادم.","e")}});
  const mc=$("#mc"); if(mc) mc.addEventListener("click",closeM);
}

document.addEventListener("click",e=>{const car=e.target.closest("#carsGrid .car-card");if(car&&!e.target.closest("a,button")){document.querySelectorAll("#carsGrid .car-card.is-selected").forEach(el=>{if(el!==car)el.classList.remove("is-selected")});car.classList.toggle("is-selected")}let x=e.target.closest("[data-book]");if(x){let c=S.cars.find(c=>c.id===x.dataset.book);if(c)openBook(c)}let t=e.target.closest("[data-tab]");if(t){S.tab=t.dataset.tab;renderAdmin()}let p=e.target.closest("[data-prev]");if(p)setStep(+p.dataset.prev);let c=e.target.closest("[data-close]");if(c)$("#"+c.dataset.close).classList.add("hidden")});
$("#s2").onclick=()=>setStep(2);$("#s3").onclick=()=>{if(valid2())setStep(3)};$("#s4").onclick=()=>{if(valid3()){setStep(4);renderPay()}};$("#bookForm").onsubmit=submitBook;$("#submit").onclick=()=>submitBook({preventDefault(){}});["pd","pt","rd","rt"].forEach(id=>$("#"+id).onchange=()=>valid2(true));$$('input[name=driver]').forEach(x=>x.onchange=()=>valid2(true));$("#termsBtn").onclick=()=>openM("الشروط والخصوصية",`<p class=leading-8>${esc(S.settings.bookingTerms)}</p><hr class=my-4><p class=leading-8>${esc(S.settings.privacyPolicy)}</p>`);$("#successClose").onclick=()=>$("#success").classList.add("hidden");$("#successPrint").onclick=()=>S.last&&printB(S.last);
document.addEventListener("keydown",e=>{if(e.key==="Escape")["success","admin","modal"].forEach(id=>$("#"+id).classList.add("hidden"))});
let idle;function lock(){clearTimeout(idle);if(sessionStorage.getItem(K.session))idle=setTimeout(()=>{sessionStorage.removeItem(K.session);sessionStorage.removeItem("carRental_token");$("#panel").classList.add("hidden");$("#login").classList.remove("hidden");toast("تم قفل لوحة الإدارة بسبب عدم النشاط.","w")},15*60*1000)}["click","keydown","touchstart"].forEach(x=>document.addEventListener(x,lock,{passive:true}));
bindAdminControls();
if(new URLSearchParams(location.search).get("admin")==="1")window.adminOpen();
(async()=>{S.loading=true;try{load();apply();renderCars();if(configured())await sync()}catch(e){if(configured()){S.apiUnavailable=true;S.cars=[];S.bookings=[];S.busy=[];apply();toast("تعذر الاتصال بالخادم. تم إيقاف الحجز حتى يعود الاتصال.","e")}else console.error(e)}finally{S.loading=false;renderCars();lock()}})();

(function setupLanguageSwitch(){
 const toggle=document.getElementById("langToggle");if(!toggle)return;const heroVideo=document.querySelector(".hero-video");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){heroVideo?.pause();heroVideo?.removeAttribute("autoplay")}let language=localStorage.getItem("helawey_language")==="en"?"en":"ar";const originals=new WeakMap();const dictionary=Object.entries(UI_TRANSLATIONS).sort((a,b)=>b[0].length-a[0].length);
 function translateNode(node){if(node.nodeType!==Node.TEXT_NODE)return;let original=originals.get(node);if(original===undefined){original=node.nodeValue;originals.set(node,original)}let value=original;if(language==="en"){const trimmed=original.trim();if(Object.prototype.hasOwnProperty.call(UI_TRANSLATIONS,trimmed)){const leading=original.match(/^\s*/)?.[0]||"",trailing=original.match(/\s*$/)?.[0]||"";value=leading+UI_TRANSLATIONS[trimmed]+trailing}else for(const [ar,en] of dictionary)if(ar.length>=8)value=value.replaceAll(ar,en);value=value.replace(/([0-9٠-٩]+)\s+مقاعد/g,"$1 seats").replace(/([0-9٠-٩]+)\s+أيام?/g,"$1 days")}if(node.nodeValue!==value)node.nodeValue=value;}
 function translateAttributes(root=document.body){for(const el of [root,...root.querySelectorAll("input,textarea,button,[aria-label],[title]")]){if(!el||!el.getAttribute)continue;for(const attr of ["placeholder","aria-label","title"]){const value=el.getAttribute(attr);if(!value)continue;const key="data-original-"+attr;if(!el.hasAttribute(key))el.setAttribute(key,value);let text=el.getAttribute(key);if(language==="en")for(const [ar,en] of dictionary)text=text.replaceAll(ar,en);el.setAttribute(attr,text)}}}
 function applyLanguage(){document.documentElement.lang=language;document.documentElement.dir=language==="en"?"ltr":"rtl";toggle.textContent=language==="en"?"العربية":"English";toggle.setAttribute("aria-label",language==="en"?"Switch to Arabic":"التبديل إلى الإنجليزية");const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode);translateAttributes();}
 toggle.addEventListener("click",()=>{language=language==="ar"?"en":"ar";localStorage.setItem("helawey_language",language);applyLanguage()});const observer=new MutationObserver(records=>{for(const record of records){if(record.type==="characterData")translateNode(record.target);for(const child of record.addedNodes){if(child.nodeType===Node.TEXT_NODE)translateNode(child);else if(child.nodeType===Node.ELEMENT_NODE){const walker=document.createTreeWalker(child,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode);translateAttributes(child)}}}});observer.observe(document.body,{subtree:true,childList:true,characterData:true});applyLanguage();
})();
