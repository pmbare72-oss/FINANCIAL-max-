const KEY="financialMaxDataV1";
const levels=["Awakening","Foundation","Controller","Builder","Strategist","Wealth Builder","Financial Elite","Financial Max"];
const cats={income:["Salary","Business","Barber work","Freelance","Gift","Other"],expense:["Food","Transport","Rent","Bills","Shopping","Health","Entertainment","Other"]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{transactions:[],accounts:[],goals:[],theme:"dark"};
let currentFilter="all";

const $=id=>document.getElementById(id);
const money=n=>"KSh "+Math.round(Number(n)||0).toLocaleString("en-KE");
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const today=()=>new Date().toISOString().slice(0,10);
function monthTx(){const m=new Date().toISOString().slice(0,7);return data.transactions.filter(t=>t.date.startsWith(m))}
function totals(){let inc=0,exp=0;data.transactions.forEach(t=>t.type==="income"?inc+=+t.amount:exp+=+t.amount);return{inc,exp,balance:inc-exp}}
function xp(){let x=data.transactions.length*20+data.goals.filter(g=>g.current>=g.target).length*100+data.accounts.length*30;return x}
function levelInfo(){let x=xp(),l=Math.min(levels.length-1,Math.floor(x/250)),base=l*250;return{x,l,pct:Math.min(100,((x-base)/250)*100)}}
function showToast(s){const t=$("toast");t.textContent=s;t.style.display="block";clearTimeout(window._toast);window._toast=setTimeout(()=>t.style.display="none",2200)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function render(){
 const all=totals(), mt=monthTx(), mi=mt.filter(t=>t.type==="income").reduce((a,t)=>a+ +t.amount,0), me=mt.filter(t=>t.type==="expense").reduce((a,t)=>a+ +t.amount,0);
 const saved=data.goals.reduce((a,g)=>a+Math.min(+g.current,+g.target),0), invested=data.accounts.filter(a=>a.type==="Investment").reduce((a,x)=>a+ +x.balance,0);
 $("balance").textContent=money(all.balance);$("monthIncome").textContent=money(mi);$("monthExpense").textContent=money(me);$("monthSaved").textContent=money(saved);
 const li=levelInfo();$("levelName").textContent=levels[li.l];$("levelLine").textContent=`Level ${li.l+1} · ${li.x} XP`;$("levelNum").textContent=li.l+1;$("xpFill").style.width=li.pct+"%";
 const rate=mi?Math.max(0,Math.round((mi-me)/mi*100)):0;const bh=mi?Math.max(0,Math.min(100,Math.round((1-me/mi)*100))):0;
 $("savingRate").textContent=rate+"%";$("savingMeter").style.width=Math.min(100,rate)+"%";$("budgetHealth").textContent=bh+"%";$("budgetMeter").style.width=bh+"%";$("healthScore").textContent=Math.round((Math.min(100,Math.max(0,rate))+bh)/2)+"/100";
 $("accountTotal").textContent=money(data.accounts.filter(a=>a.type!=="Investment").reduce((a,x)=>a+ +x.balance,0));$("savingsTotal").textContent=money(saved);$("investTotal").textContent=money(invested);
 renderTx();renderAccounts();renderGoals();renderRecent();renderAchievements();renderInsight();
}

function txHTML(t){
 return `<div class="tx"><div class="txleft"><div class="dot">${t.type==="income"?"↗":"↘"}</div><div><h4>${esc(t.desc)}</h4><small>${esc(t.category)} · ${t.date}</small></div></div><div class="amount ${t.type==="income"?"plus":"minus"}">${t.type==="income"?"+":"−"}${money(t.amount)}</div></div>`;
}
function renderTx(){let arr=[...data.transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);if(currentFilter!=="all")arr=arr.filter(t=>t.type===currentFilter);$("transactionList").innerHTML=arr.length?arr.map(txHTML).join(""):`<div class="empty">No transactions yet.<br>Add your first income or expense.</div>`}
function renderRecent(){let arr=[...data.transactions].sort((a,b)=>b.id-a.id).slice(0,5);$("recentList").innerHTML=arr.length?arr.map(txHTML).join(""):`<div class="empty">Your financial journey starts here 🚀</div>`}
function renderAccounts(){let a=data.accounts;$("accountList").innerHTML=a.length?a.map(x=>`<div class="account"><div><h4>${esc(x.name)}</h4><small>${esc(x.type)}</small></div><b>${money(x.balance)}</b></div>`).join(""):`<div class="empty">No accounts yet. Add M-Pesa, bank, cash, savings or investments.</div>`}
function renderGoals(){let g=data.goals;$("goalList").innerHTML=g.length?g.map(x=>{let p=Math.min(100,Math.round(x.current/x.target*100));return `<div class="goal"><div style="width:100%"><h4>🎯 ${esc(x.name)}</h4><small>${money(x.current)} / ${money(x.target)} · ${p}%</small><div class="meter" style="margin:8px 0 0"><i style="width:${p}%"></i></div></div></div>`}).join(""):`<div class="empty">No goals yet. Create a target for rent, emergency savings, equipment or anything important.</div>`}
function renderAchievements(){let x=xp(), n=data.transactions.length, g=data.goals.filter(g=>g.current>=g.target).length;let a=[
["🌱","First Step","Record your first transaction",n>=1],
["📒","Money Tracker","Record 10 transactions",n>=10],
["🎯","Goal Hunter","Complete a goal",g>=1],
["🔥","Consistency","Reach 500 XP",x>=500],
["🐉","Financial Max","Reach Level 8",x>=1750]
];$("achievementList").innerHTML=a.map(q=>`<div class="achievement ${q[3]?"":"locked"}"><div class="badge">${q[0]}</div><div><b>${q[1]}</b><div class="muted small">${q[2]}</div></div><strong>${q[3]?"✓":"🔒"}</strong></div>`).join("")}
function renderInsight(){const mt=monthTx(),inc=mt.filter(t=>t.type==="income").reduce((a,t)=>a+ +t.amount,0),exp=mt.filter(t=>t.type==="expense").reduce((a,t)=>a+ +t.amount,0);let title="Your system is ready.";let text="Add transactions and Financial Max will turn your recorded numbers into useful financial feedback.";if(inc){let cats={};mt.filter(t=>t.type==="expense").forEach(t=>cats[t.category]=(cats[t.category]||0)+ +t.amount);let top=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];title=exp>inc?"Expenses currently exceed income":"Cash flow is positive";text=top?`This month you recorded ${money(inc)} income and ${money(exp)} expenses. Your largest recorded expense category is ${top[0]} at ${money(top[1])}.`:`This month you recorded ${money(inc)} of income and ${money(exp)} of expenses.`}$("insightTitle").textContent=title;$("insightText").textContent=text}

function openEntry(type){$("entryType").value=type;$("modalTitle").textContent=type==="income"?"Add Income":"Add Expense";$("entryCategory").innerHTML=cats[type].map(x=>`<option>${x}</option>`).join("");$("entryDate").value=today();$("entryAmount").value="";$("entryDesc").value="";$("modal").classList.add("show");setTimeout(()=>$("entryAmount").focus(),100)}
function addTransaction(e){e.preventDefault();let t={id:Date.now(),type:$("entryType").value,amount:+$("entryAmount").value,desc:$("entryDesc").value.trim(),category:$("entryCategory").value,date:$("entryDate").value};data.transactions.push(t);save();$("modal").classList.remove("show");render();showToast("Transaction saved · +20 XP")}
function addAccount(){let name=prompt("Account name (e.g. M-Pesa, Bank, Cash):");if(!name)return;let type=prompt("Type: Cash, M-Pesa, Bank, Savings or Investment","M-Pesa")||"Other";let balance=+prompt("Current balance (KSh)","0")||0;data.accounts.push({name,type,balance});save();render();showToast("Account added")}
function addGoal(){let name=prompt("Goal name (e.g. Emergency Fund):");if(!name)return;let target=+prompt("Target amount (KSh)","10000")||0;if(!target)return;let current=+prompt("Already saved (KSh)","0")||0;data.goals.push({name,target,current});save();render();showToast("Goal created · +20 XP")}
function calculate(){let p=+$("calcP").value||0,c=+$("calcC").value||0,r=(+$("calcR").value||0)/100/12,y=+$("calcY").value||0;let n=y*12, fv=r? p*Math.pow(1+r,n)+c*((Math.pow(1+r,n)-1)/r):p+c*n;$("calcResult").textContent=money(fv)}
function loadDemo(){data={transactions:[{id:1,type:"income",amount:8000,desc:"Monthly income",category:"Business",date:today()},{id:2,type:"expense",amount:1200,desc:"Food & groceries",category:"Food",date:today()},{id:3,type:"expense",amount:500,desc:"Transport",category:"Transport",date:today()},{id:4,type:"income",amount:1500,desc:"Side job",category:"Freelance",date:today()}],accounts:[{name:"M-Pesa",type:"M-Pesa",balance:3500},{name:"Savings",type:"Savings",balance:2000}],goals:[{name:"Emergency Fund",target:10000,current:2500}],theme:data.theme||"dark"};save();render();showToast("Demo data loaded")}
function exportData(){let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="financial-max-backup.json";a.click();URL.revokeObjectURL(a.href)}
function importData(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!x.transactions||!x.accounts||!x.goals)throw Error();data=x;save();render();showToast("Backup restored")}catch{showToast("That backup file is not valid")}};r.readAsText(f)}
function nav(tab){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===tab));document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.tab===tab));window.scrollTo({top:0,behavior:"smooth"})}

document.addEventListener("click",e=>{
 let t=e.target.closest("[data-tab]");if(t)nav(t.dataset.tab);
 let a=e.target.closest("[data-add]");if(a)openEntry(a.dataset.add);
 if(e.target.closest("#closeModal"))$("modal").classList.remove("show");
 if(e.target.id==="addAccount")addAccount();
 if(e.target.id==="addGoal")addGoal();
 if(e.target.id==="calculate")calculate();
 if(e.target.id==="themeBtn"){data.theme=data.theme==="light"?"dark":"light";document.body.classList.toggle("light",data.theme==="light");save()}
 if(e.target.dataset.filter){document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));e.target.classList.add("active");currentFilter=e.target.dataset.filter;renderTx()}
 if(e.target.id==="exportBtn")exportData();
 if(e.target.id==="demoBtn")loadDemo();
 if(e.target.id==="resetBtn"&&confirm("Reset all Financial Max data on this device? This cannot be undone unless you have a backup.")){localStorage.removeItem(KEY);location.reload()}
});
$("entryForm").addEventListener("submit",addTransaction);
$("importInput").addEventListener("change",importData);
document.body.classList.toggle("light",data.theme==="light");
render();

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
