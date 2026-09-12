function renderProfileCard(profile={}){
  const photo=profile.photo||'';
  const name=profile.name||'MyHub User';
  const info=profile.info||'MyHub V2';
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'M';
  return `<div class="pc-card-wrapper" data-pc-card>
    <div class="pc-card">
      <div class="pc-shine"></div><div class="pc-glare"></div>
      <div class="pc-avatar-content">
        <div class="pc-avatar">${photo?`<img src="${attr(photo)}" alt="Profil">`:`<span>${esc(initials)}</span>`}</div>
        <div class="pc-status">Online</div>
      </div>
      <div class="pc-user-info">
        <div class="pc-user-text"><strong>${esc(name)}</strong><span>${esc(info)}</span></div>
        <button class="pc-contact" onclick="window.location.href='edit-profil.html'">Edit Profil</button>
      </div>
    </div>
  </div>`;
}
function initProfileCards(root=document){root.querySelectorAll('[data-pc-card]').forEach(card=>{
  const wrap=card.querySelector('.pc-card-wrapper'), inner=card.querySelector('.pc-card'); if(!wrap||!inner)return;
  let raf=0;
  const move=e=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const r=inner.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;inner.style.setProperty('--rx',`${-y*8}deg`);inner.style.setProperty('--ry',`${x*10}deg`);inner.style.setProperty('--mx',`${(x+.5)*100}%`);inner.style.setProperty('--my',`${(y+.5)*100}%`)})};
  const reset=()=>{inner.style.setProperty('--rx','0deg');inner.style.setProperty('--ry','0deg');inner.style.setProperty('--mx','50%');inner.style.setProperty('--my','50%')};
  wrap.addEventListener('pointermove',move);wrap.addEventListener('pointerleave',reset);
});}
