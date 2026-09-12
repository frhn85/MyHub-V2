const authScreen=document.getElementById("authScreen");
const screens={home:document.getElementById("homeScreen"),games:document.getElementById("gamesScreen"),finance:document.getElementById("financeScreen"),profile:document.getElementById("profileScreen"),settings:document.getElementById("settingsScreen")};
const form=document.getElementById("authForm"), authButton=document.getElementById("authButton"), message=document.getElementById("authMessage");
let mode="login";

document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  tab.classList.add("active"); mode=tab.dataset.mode;
  authButton.textContent=mode==="login"?"Masuk":"Buat akun"; message.textContent="";
}));

function getAccount(){try{return JSON.parse(localStorage.getItem("myhubV2Account")||"null")}catch{return null}}
function setSession(email){localStorage.setItem("myhubV2Session",email)}
function getSession(){return localStorage.getItem("myhubV2Session")}

function show(page){
  Object.values(screens).forEach(s=>s.classList.add("hidden"));
  screens[page].classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  const account=getAccount();
  if(account){
    document.getElementById("profileEmail").textContent=account.email;
    document.getElementById("settingsEmail").textContent=account.email;
    document.getElementById("welcomeTitle").textContent="Welcome.";
  }
  window.scrollTo({top:0,behavior:"smooth"});
}

function boot(){
  const session=getSession();
  if(session && getAccount()){authScreen.classList.add("hidden");show("home")}
  else {authScreen.classList.remove("hidden");Object.values(screens).forEach(s=>s.classList.add("hidden"))}
}
form.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("email").value.trim().toLowerCase();
  const password=document.getElementById("password").value;
  if(mode==="register"){
    if(getAccount()){message.textContent="Akun demo sudah ada di browser ini.";return}
    localStorage.setItem("myhubV2Account",JSON.stringify({email,password}));
    setSession(email); message.textContent="Akun berhasil dibuat.";
    setTimeout(()=>{authScreen.classList.add("hidden");show("home")},350);
  }else{
    const account=getAccount();
    if(account && account.email===email && account.password===password){
      setSession(email); authScreen.classList.add("hidden");show("home");
    }else message.textContent="Email atau password belum cocok.";
  }
});
document.addEventListener("click",e=>{
  const target=e.target.closest("[data-page]");
  if(target){const page=target.dataset.page;if(screens[page])show(page)}
});
document.getElementById("profileButton").addEventListener("click",()=>show("profile"));
document.getElementById("logoutButton").addEventListener("click",()=>{
  localStorage.removeItem("myhubV2Session");authScreen.classList.remove("hidden");show("home");message.textContent="";form.reset();
});
boot();
