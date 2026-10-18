// ============================================================
// CAR RENTAL APPLICATION CONFIGURATION
// ============================================================
// =====================================================
// CHANGE DEFAULT ADMIN PIN HERE
// No local demo PIN is configured.
// (Local demo mode only. When GOOGLE_APPS_SCRIPT_URL is set, the PIN is checked on the server and this value is unused.)
// IMPORTANT: Client-side PIN protection is NOT real
// security. For production use, move authentication
// to the backend / Firebase / Supabase / Apps Script.
// =====================================================
const ADMIN_PIN="";
const VODAFONE_CASH_NUMBER="";
const INSTAPAY_HANDLE="";
const GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbz1o52sctL97R5JQijSHJZJJJJzzNw9VpYDzYSdw3L_zgFFEX1Arfrq_KfJAUirqTip/exec";
const OFFICE_WHATSAPP="";
const OFFICE_PHONE="";
const CURRENCY="EGP";

const K={cars:"carRental_cars",bookings:"carRental_bookings",settings:"carRental_settings",customers:"carRental_customers",session:"carRental_session",pending:"carRental_pendingSync"};
const DEF={officeName:"Helawey Car Rental",logo:"🚗",phone:OFFICE_PHONE,whatsapp:OFFICE_WHATSAPP,address:"أضف العنوان من الإعدادات",mapsUrl:"#",facebookUrl:"#",instagramUrl:"#",websiteUrl:"#",vodafoneCash:VODAFONE_CASH_NUMBER,instapay:INSTAPAY_HANDLE,driverDailyRate:300,defaultDeposit:1000,driverDepositAdjustment:0,driverChangesDeposit:false,currency:CURRENCY,accentColor:"#798798",bookingTerms:"أوافق على شروط وأحكام تأجير السيارة وسياسة استخدام البيانات.",privacyPolicy:"يتم استخدام المستندات المقدمة فقط لأغراض التحقق وإتمام عملية التأجير."};
const DEMO=[
{id:"demo1",name:"Toyota Corolla",image:"https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80",videoUrl:"",description:"سيارة عملية ومريحة.",pricePerDay:1500,deposit:1000,transmission:"أوتوماتيك",availability:"Available",seats:5,fuelType:"بنزين",luggage:2,driverAvailable:true,features:["تكييف","شاشة","كاميرا"],demo:true},
{id:"demo2",name:"Hyundai Elantra",image:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",videoUrl:"",description:"راحة وأناقة للعائلة.",pricePerDay:1700,deposit:1000,transmission:"أوتوماتيك",availability:"Available",seats:5,fuelType:"بنزين",luggage:2,driverAvailable:true,features:["تكييف","شاشة"],demo:true},
{id:"demo3",name:"Kia Cerato",image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",videoUrl:"",description:"أداء متوازن وتصميم عصري.",pricePerDay:1600,deposit:1000,transmission:"أوتوماتيك",availability:"Available",seats:5,fuelType:"بنزين",luggage:2,driverAvailable:false,features:["تكييف","بلوتوث"],demo:true},
{id:"demo4",name:"Nissan Sunny",image:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",videoUrl:"",description:"اقتصادية وموثوقة.",pricePerDay:1300,deposit:800,transmission:"أوتوماتيك",availability:"Available",seats:5,fuelType:"بنزين",luggage:2,driverAvailable:true,features:["تكييف","بلوتوث"],demo:true}];
let S={cars:[],bookings:[],customers:[],settings:{...DEF},pending:[],car:null,tab:"dashboard",cal:new Date(new Date().getFullYear(),new Date().getMonth(),1),last:null,busy:[],loading:false};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const uid=p=>p+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,9);
const configured=()=>GOOGLE_APPS_SCRIPT_URL&&!GOOGLE_APPS_SCRIPT_URL.includes("PASTE_YOUR_URL");
