function setStep(n){$$("[data-s]").forEach(x=>x.classList.toggle("hidden",+x.dataset.s!==n));$$(".step").forEach((x,i)=>x.className="step p-2 rounded text-center "+(i+1===n?"on":i+1<n?"done":"bg-slate-100"));const form=$("#bookForm");if(form)form.scrollTop=0;if(n===4&&typeof renderPay==="function")renderPay()}
function openBook(c){S.car=c;$("#booking").classList.remove("hidden");$("#chosen").innerHTML=`<img src="${esc(c.image)}" class="w-28 h-20 object-cover rounded-xl" loading="lazy" width="112" height="80"><div><b>${esc(c.name)}</b><p class="text-sm text-slate-500">${esc(c.transmission)} • ${money(c.pricePerDay)}/يوم</p></div>`;$("#pd").min=today();$("#rd").min=today();{let da=c.driverAvailable!==false;$('input[name=driver][value=true]').closest("label").style.display=da?"":"none";if(!da)$('input[name=driver][value=false]').checked=true}setStep(1)}
function valid2(q){let a=new Date(iso($("#pd").value,$("#pt").value)),b=new Date(iso($("#rd").value,$("#rt").value));if(q&&(!$("#pd").value||!$("#rd").value))return false;if(!$("#pd").value||!$("#rd").value||isNaN(a)||isNaN(b)||b<=a||a<new Date()){toast("يرجى اختيار تاريخ ووقت صحيحين.","e");return false}if(conflict(S.car.id,a,b)){toast("السيارة غير متاحة في الفترة المحددة، يرجى اختيار فترة أخرى.","e");return false}let d=$('input[name=driver]:checked').value==="true",t=totals(S.car,a,b,d);$("#sum2").innerHTML=`مدة الإيجار: <b>${t.days} أيام</b> — السيارة: <b>${money(t.carTotal)}</b> — السائق: <b>${money(t.driverTotal)}</b> — الإجمالي: <b class="text-[var(--a)]">${money(t.grand)}</b>`;return true}
function valid3(){if($("#name").value.trim().length<3||!phoneOK($("#custPhone").value)||!/^\d{14}$/.test($("#nid").value)||$("#addr").value.trim().length<5){toast("يرجى مراجعة الاسم والهاتف والرقم القومي والعنوان.","e");return false}let d=$('input[name=driver]:checked').value==="true";if(!$("#idf").files[0]||!$("#idb").files[0]||(!d&&!$("#lic").files[0])){toast(d?"يرجى رفع صور الرقم القومي.":"يرجى رفع الرقم القومي ورخصة القيادة.","e");return false}for(let id of ["idf","idb","lic"]){let f=$("#"+id).files[0];if(f&&(f.size>(f.type==="application/pdf"?4:25)*1024*1024||!["image/jpeg","image/png","image/webp","application/pdf"].includes(f.type))){toast("الملف يجب أن يكون صورة JPG/PNG/WEBP (حتى 25MB) أو PDF (حتى 4MB).","e");return false}}return true}
async function b64(f){if(!f)return null;if(f.type.startsWith("image/")){try{const bm=await createImageBitmap(f),k=Math.min(1,1600/Math.max(bm.width,bm.height)),c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);c.getContext("2d").drawImage(bm,0,0,c.width,c.height);return{name:f.name.replace(/\.\w+$/,"")+".jpg",type:"image/jpeg",data:c.toDataURL("image/jpeg",0.72).split(",")[1]}}catch(e){console.warn("compress failed",e)}}return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res({name:f.name,type:f.type,data:r.result.split(",")[1]});r.onerror=rej;r.readAsDataURL(f)})}
function renderPay(){
  const methods=[
    ["vodafone","Vodafone Cash",S.settings.vodafoneCash||VODAFONE_CASH_NUMBER,"رقم فودافون كاش الخاص بالشركة"],
    ["instapay","InstaPay",S.settings.instapay||INSTAPAY_HANDLE,"حساب إنستا باي الخاص بالشركة"]
  ].filter(x=>String(x[2]||"").trim());

  if(!methods.length){$("#payMethods").innerHTML='<div class="bg-amber-50 p-4 rounded-xl text-amber-900" role="status">طرق الدفع غير متاحة حاليًا، تواصل معنا عبر واتساب</div>';$("#payFields").innerHTML="";$("#submit").disabled=true;return}
  $("#submit").disabled=false;

  const card=(x)=>`<label class="payment-card cursor-pointer block">
    <input class="sr-only payment-radio" type="radio" name="pm" value="${x[0]}">
    <span class="block border-2 border-slate-200 rounded-2xl p-5 transition hover:border-[var(--a)]">
      <div class="flex items-center justify-between gap-4">
        <div><b class="text-xl">${x[1]}</b><small class="block text-slate-500 mt-1">اضغط لاختيار طريقة الدفع</small></div>
        <span class="text-2xl">◉</span>
      </div>
      <div class="payment-details mt-5 pt-5 border-t border-amber-200" style="display:none">
        <div class="text-sm text-slate-600 mb-2">${x[3]}</div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div class="flex-1 rounded-xl bg-white border border-slate-200 px-5 py-4">
            <div class="text-xs text-slate-500 mb-1">حوّل إلى هذا الرقم/الحساب</div>
            <div class="text-3xl font-black tracking-wide select-all">${esc(x[2])}</div>
          </div>
          <button type="button" class="copy-pay-number px-5 py-4 rounded-xl border-2 border-[var(--a)] font-bold" data-copy="${esc(x[2])}">نسخ</button>
        </div>
        <div class="mt-4 text-sm font-bold">أتمم التحويل ثم ارفع صورة إيصال التحويل بالأسفل.</div>
      </div>
    </span>
  </label>`;

  $("#payMethods").innerHTML=methods.map(card).join("");

  const choose=(method)=>{
    document.querySelectorAll('.payment-radio').forEach(r=>{
      const on=r.value===method;
      r.checked=on;
      const box=r.closest('.payment-card');
      if(box){
        const span=box.querySelector(':scope > span');
        const details=box.querySelector('.payment-details');
        if(span){span.classList.toggle('border-[var(--a)]',on);span.classList.toggle('bg-amber-50',on);}
        if(details) details.style.display=on?'block':'none';
      }
    });
    renderPayFields();
  };

  document.querySelectorAll('.payment-card').forEach(cardEl=>{
    cardEl.addEventListener('click',e=>{
      if(e.target.closest('.copy-pay-number')) return;
      const radio=cardEl.querySelector('.payment-radio');
      choose(radio.value);
    });
  });

  document.querySelectorAll('.payment-radio').forEach(r=>r.addEventListener('change',()=>choose(r.value)));

  document.querySelectorAll('.copy-pay-number').forEach(btn=>{
    btn.addEventListener('click',async e=>{
      e.preventDefault(); e.stopPropagation();
      try{await navigator.clipboard.writeText(btn.dataset.copy);toast('تم نسخ الرقم.','s')}
      catch{toast('انسخ هذا: '+btn.dataset.copy,'s')}
    });
  });

  $("#payFields").innerHTML='<div class="bg-slate-50 p-4 rounded-xl text-slate-600">اختر فودافون كاش أو إنستا باي للمتابعة.</div>';
}

function renderPayFields(){
  const m=document.querySelector('input[name="pm"]:checked')?.value||"";
  const methods=[["vodafone",S.settings.vodafoneCash||VODAFONE_CASH_NUMBER],["instapay",S.settings.instapay||INSTAPAY_HANDLE]].filter(x=>String(x[1]||"").trim());
  if(!methods.length){$("#payMethods").innerHTML='<div class="bg-amber-50 p-4 rounded-xl text-amber-900" role="status">طرق الدفع غير متاحة حاليًا، تواصل معنا عبر واتساب</div>';$("#payFields").innerHTML="";$("#submit").disabled=true;return}
  $("#submit").disabled=false;
  const labels={vodafone:"Vodafone Cash",instapay:"InstaPay"};
  if(!m){
    $("#payFields").innerHTML='<div class="bg-slate-50 p-4 rounded-xl text-slate-600">اختر فودافون كاش أو إنستا باي للمتابعة.</div>';
    return;
  }
  const account=methods.find(x=>x[0]===m)?.[1]||"";
  if(!account){$("#payFields").innerHTML='<div class="bg-amber-50 p-4 rounded-xl text-amber-900" role="status">طرق الدفع غير متاحة حاليًا، تواصل معنا عبر واتساب</div>';$("#submit").disabled=true;return}
  $("#payFields").innerHTML=`<div class="rounded-2xl border-2 ${m==="vodafone"?'border-amber-300 bg-amber-50':'border-slate-200 bg-white'} p-5 mt-4">
    <div class="text-xl font-black">${labels[m]}</div>
    <div class="text-sm text-slate-600 mt-1">حوّل العربون إلى شركة التأجير.</div>
    <div class="mt-4 rounded-xl bg-white border border-slate-200 p-4">
      <div class="text-sm text-slate-500">${m==="vodafone"?'رقم فودافون كاش الخاص بالشركة':'حساب إنستا باي الخاص بالشركة'}</div>
      <div class="text-3xl font-black tracking-wide select-all">${esc(account)}</div>
    </div>
    <label class="block mt-5"><span class="font-bold">رقم الهاتف المرسل منه التحويل</span>
      <input id="senderPhone" type="tel" inputmode="tel" autocomplete="tel" required class="mt-2 w-full border rounded-xl p-3 bg-white" placeholder="01xxxxxxxxx">
    </label>
    <label class="block mt-5"><span class="font-bold">صورة إيصال التحويل</span>
      <input id="receipt" type="file" accept="image/*,.pdf" required class="mt-2 w-full border-2 border-dashed rounded-2xl p-4 bg-white">
      <small class="block mt-2 text-slate-500">ارفع الصورة بعد إتمام التحويل.</small>
    </label>
  </div>`;

  try{
    let a=new Date(iso($("#pd").value,$("#pt").value)),b=new Date(iso($("#rd").value,$("#rt").value)),d=$("input[name=driver]:checked").value==="true",t=totals(S.car,a,b,d);
    $("#final").innerHTML=`<div class="card p-4"><b>ملخص الحجز</b><div class="grid sm:grid-cols-2 gap-2 mt-3 text-sm"><span>السيارة: ${money(t.carTotal)}</span><span>السائق: ${money(t.driverTotal)}</span><span>العربون المطلوب: <b>${money(t.deposit)}</b></span><span>الدفع: <b>${labels[m]}</b></span><b>الإجمالي: ${money(t.grand)}</b></div></div>`;
  }catch(e){ console.warn('Payment summary unavailable',e); }
}

async function submitBook(e){e?.preventDefault?.();let btn=$("#submit");try{if(!S.car){toast("يرجى اختيار سيارة أولاً.","e");return}if(!valid2()){setStep(2);return}if(!valid3()){setStep(3);return}if(!$("#terms").checked){toast("يرجى الموافقة على الشروط وسياسة الخصوصية.","e");return}let pm=$('input[name=pm]:checked')?.value||"";
if(!["vodafone","instapay"].includes(pm)){toast("يرجى اختيار فودافون كاش أو إنستا باي.","e");return}
let senderPhone=norm($("#senderPhone")?.value||"");if(!phoneOK(senderPhone)){toast("يرجى إدخال رقم الهاتف الذي أُرسل منه التحويل.","e");return}if(!$("#receipt")?.files[0]){toast("يرجى رفع صورة إيصال التحويل.","e");return}btn.disabled=true;btn.textContent="جارٍ إرسال الحجز...";let a=new Date(iso($("#pd").value,$("#pt").value)),z=new Date(iso($("#rd").value,$("#rt").value)),driver=$('input[name=driver]:checked').value==="true",t=totals(S.car,a,z,driver);let b={id:uid("book"),requestId:uid("req"),bookingId:bookingNo(),createdAt:new Date().toISOString(),status:"Pending Deposit",customer:{name:$("#name").value.trim(),phone:norm($("#custPhone").value),whatsapp:norm($("#custWa").value)||norm($("#custPhone").value),nationalId:$("#nid").value,address:$("#addr").value,email:$("#email").value},carId:S.car.id,carName:S.car.name,pickupDate:$("#pd").value,pickupTime:$("#pt").value,returnDate:$("#rd").value,returnTime:$("#rt").value,pickupDateTime:a.toISOString(),returnDateTime:z.toISOString(),rentalDays:t.days,driver,carDailyRate:S.car.pricePerDay,driverDailyRate:driver?S.settings.driverDailyRate:0,carTotal:t.carTotal,driverTotal:t.driverTotal,additionalFees:0,discount:0,grandTotal:t.grand,requiredDeposit:t.deposit,amountPaid:0,remaining:t.grand,paymentMethod:pm,senderPhone,documents:{idFront:await b64($("#idf").files[0]),idBack:await b64($("#idb").files[0]),drivingLicense:await b64($("#lic").files[0]),paymentReceipt:await b64($("#receipt")?.files[0])},adminNotes:""};if(conflict(b.carId,a,z))throw Error("CONFLICT");if(configured()){let r=await api("createBooking",{booking:b});if(!r.success)throw Error(r.error||"SERVER");b.bookingId=r.bookingId;b.documents={}}else{S.bookings.push(b);if(save())toast("تم حفظ الحجز محليًا.","s");else{for(const k in b.documents)if(b.documents[k])b.documents[k]={name:b.documents[k].name,omitted:true};save();toast("تم حفظ الحجز بدون صور المستندات (مساحة المتصفح ممتلئة).","w")}}S.last=b;$("#booking").classList.add("hidden");$("#successId").textContent=b.bookingId;$("#successWa").href=waLink(b.customer.whatsapp,waMsg(b));$("#success").classList.remove("hidden")}catch(x){console.error(x);if(x.message==="CONFLICT"||x.message==="CAR")toast("السيارة لم تعد متاحة في هذه الفترة.","e");else toast("تعذر إرسال الحجز: "+({RATE:"طلبات كثيرة، حاول لاحقًا.",INVALID:"بيانات غير صحيحة.",CAR:"السيارة غير متاحة.",SERVER:"خطأ في الخادم."}[x.message]||"تحقق من الاتصال وحاول مرة أخرى."),"e")}finally{btn.disabled=false;btn.textContent="إرسال طلب الحجز"}}
function waLink(p,t){return`https://wa.me/${norm(p).replace("+","")}?text=${encodeURIComponent(t)}`}
function waMsg(b){return`مرحباً ${b.customer.name}،\nتم استلام طلب حجزك.\n\nرقم الحجز: ${b.bookingId}\nالسيارة: ${b.carName}\nمن: ${b.pickupDate} ${b.pickupTime}\nإلى: ${b.returnDate} ${b.returnTime}\nالمدة: ${b.rentalDays} أيام\nالسائق: ${b.driver?"بسائق":"بدون سائق"}\nالإجمالي: ${money(b.grandTotal)}\nالعربون: ${money(b.requiredDeposit)}\nالمتبقي: ${money(b.remaining)}`}
