const money=n=>new Intl.NumberFormat("ar-EG").format(Number(n)||0)+" "+(S.settings.currency||CURRENCY);
const norm=v=>{let s=String(v||"").replace(/[^\d+]/g,"");if(s.startsWith("00"))s="+"+s.slice(2);if(/^01\d{9}$/.test(s))s="+20"+s.slice(1);if(/^20\d{10}$/.test(s))s="+"+s;return s};
const phoneOK=v=>{
  let raw=String(v||"").replace(/[\s()-]/g,"");
  let n=norm(raw);
  return /^(?:\+20)?1[0125]\d{8}$/.test(n.replace(/^\+20/,"")) ||
         /^\+?[1-9]\d{7,14}$/.test(n);
};
const iso=(d,t)=>d+"T"+t+":00", today=()=>{let d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const days=(a,b)=>Math.max(1,Math.ceil((b-a)/86400000));
const fmt=d=>{let x=new Date(d);return isNaN(x)?"—":new Intl.DateTimeFormat("ar-EG",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(x)};
const overlap=(a,b,c,d)=>a<d&&c<b;
function totals(car,a,b,driver,disc=0,fees=0){let n=days(a,b),ct=+car.pricePerDay*n,dt=driver?+S.settings.driverDailyRate*n:0,dep=+car.deposit||+S.settings.defaultDeposit||0;if(driver&&S.settings.driverChangesDeposit)dep+=+S.settings.driverDepositAdjustment||0;return{days:n,carTotal:ct,driverTotal:dt,deposit:dep,grand:Math.max(0,ct+dt+fees-disc)}}
function conflict(carId,a,b,ignore){const A=new Date(a),B=new Date(b);return S.bookings.some(x=>x.carId===carId&&["Pending Deposit","Confirmed"].includes(x.status)&&x.bookingId!==ignore&&overlap(A,B,new Date(x.pickupDateTime),new Date(x.returnDateTime)))||S.busy.some(x=>x.carId===carId&&overlap(A,B,new Date(x.pickupDateTime),new Date(x.returnDateTime)))}
