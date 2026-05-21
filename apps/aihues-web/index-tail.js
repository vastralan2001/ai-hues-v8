]

let searchTimer=null;
function aiSearch(){
  clearTimeout(searchTimer);
  const input=document.getElementById('agentInput').value.trim();
  const dd=document.getElementById('aiDropdown');
  const inner=document.getElementById('searchInner');
  const icon=document.getElementById('searchIcon');
  if(!input){dd.classList.remove('show');inner.classList.remove('thinking');icon.classList.remove('thinking');icon.textContent='🤖';return}
  inner.classList.add('thinking');icon.classList.add('thinking');icon.textContent='⚡';
  dd.innerHTML='<div class="ai-thinking"><span>AI thinking</span><div class="dots"><span></span><span></span><span></span></div></div>';
  dd.classList.add('show');
  searchTimer=setTimeout(()=>showResults(input),400);
}
function showResults(query){
  const inner=document.getElementById('searchInner');
  const icon=document.getElementById('searchIcon');
  inner.classList.remove('thinking');icon.classList.remove('thinking');icon.textContent='🤖';
  const q=query.toLowerCase();
  const isZh=/[\u4e00-\u9fff]/.test(q);
  let results=TOOL_DB.map(t=>{
    let score=0;
    const name=isZh&&t.zhName?t.zhName.toLowerCase():t.name.toLowerCase();
    const desc=isZh&&t.zhDesc?t.zhDesc.toLowerCase():t.desc.toLowerCase();
    const kw=t.keywords.toLowerCase();
    if(name===q)score+=100;
    else if(name.startsWith(q))score+=80;
    else if(name.includes(q))score+=60;
    else if(desc.includes(q))score+=40;
    else if(kw.includes(q))score+=30;
    const words=q.split(/\s+/).filter(w=>w.length>1);
    let wordScore=0;
    for(const w of words){if(name.includes(w))wordScore+=25;if(desc.includes(w))wordScore+=15;if(kw.includes(w))wordScore+=10}
    score+=Math.min(wordScore,50);
    return{...t,score,displayName:isZh&&t.zhName?t.zhName:t.name,displayDesc:isZh&&t.zhDesc?t.zhDesc:t.desc};
  }).filter(t=>t.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
  const dd=document.getElementById('aiDropdown');
  if(results.length===0){
    dd.innerHTML='<div class="ai-thinking"><span>No matching tools. <a href="wishlist.html">Submit a request?</a></span></div>';
    return;
  }
  dd.innerHTML=results.map(r=>'<div class="ai-result-item" onclick="goTool(\''+r.url+'\')">'+
    '<div class="ai-result-icon">'+r.icon+'</div>'+
    '<div class="ai-result-info"><div class="ai-result-name">'+r.displayName+'</div><div class="ai-result-desc">'+r.displayDesc+'</div></div>'+
    '<span class="ai-result-tag">'+r.cat+'</span></div>').join('');
}
function aiGo(){
  const input=document.getElementById('agentInput').value.trim();
  if(!input)return;
  const dd=document.getElementById('aiDropdown');
  if(dd.classList.contains('show')){
    const first=dd.querySelector('.ai-result-item');
    if(first){first.click();return}
  }
  aiSearch();setTimeout(()=>{const f=document.querySelector('.ai-result-item');if(f)f.click()},500);
}
function goTool(url){window.location.href=url}
document.addEventListener('click',function(e){if(!e.target.closest('.agent-box'))document.getElementById('aiDropdown').classList.remove('show')});

// ===== THEME TOGGLE =====
function initTheme(){
  const saved=localStorage.getItem('aihues_theme');
  const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme=saved||(prefersDark?'dark':'light');
  document.documentElement.setAttribute('data-theme',theme);
  updateThemeBtn(theme);
}
function toggleTheme(){
  const current=document.documentElement.getAttribute('data-theme')||'light';
  const next=current==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('aihues_theme',next);
  updateThemeBtn(next);
}
function updateThemeBtn(theme){
  const btn=document.getElementById('themeBtn');
  if(btn)btn.textContent=theme==='dark'?'☀️':'🌙';
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{
  if(!localStorage.getItem('aihues_theme')){
    document.documentElement.setAttribute('data-theme',e.matches?'dark':'light');
    updateThemeBtn(e.matches?'dark':'light');
  }
});
initTheme();

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown',function(e){
  if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){
    e.preventDefault();document.getElementById('agentInput').focus();
  }
  if(e.key==='Escape'){
    document.getElementById('aiDropdown').classList.remove('show');
    document.getElementById('agentInput').blur();
  }
});

// ===== CREDIT =====
function loadCredit(){
  const c=localStorage.getItem('aihues_credit');
  if(c)document.getElementById('creditDisplay').textContent=c;
}
loadCredit();
</script>
</body>
</html>
