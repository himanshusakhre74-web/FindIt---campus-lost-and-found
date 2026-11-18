const CATEGORIES = [
  {id:'keys', label:'Keys', icon:'<path d="M14.5 9.5a4.5 4.5 0 1 0-4.24 6H10l-1 1 1.5 1.5-1.5 1.5 1.5 1.5 2-2v-2.24A4.5 4.5 0 0 0 14.5 9.5z" stroke="#20261F" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'},
  {id:'wallet', label:'Wallet', icon:'<rect x="3" y="6" width="18" height="13" rx="2" stroke="#20261F" stroke-width="1.3" fill="none"/><path d="M3 10h18" stroke="#20261F" stroke-width="1.3"/><circle cx="17" cy="14" r="1.3" fill="#20261F"/>'},
  {id:'bottle', label:'Bottle', icon:'<path d="M10 2h4v3.5l1.5 2V21a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V7.5l1.5-2z" stroke="#20261F" stroke-width="1.3" fill="none" stroke-linejoin="round"/><line x1="9" y1="12" x2="15" y2="12" stroke="#20261F" stroke-width="1.3"/>'},
  {id:'id', label:'ID Card', icon:'<rect x="3" y="5" width="18" height="14" rx="2" stroke="#20261F" stroke-width="1.3" fill="none"/><circle cx="8.5" cy="11" r="1.8" stroke="#20261F" stroke-width="1.2"/><line x1="13" y1="10" x2="18" y2="10" stroke="#20261F" stroke-width="1.2"/><line x1="13" y1="13" x2="18" y2="13" stroke="#20261F" stroke-width="1.2"/><line x1="6" y1="16" x2="11" y2="16" stroke="#20261F" stroke-width="1.2"/>'},
  {id:'electronics', label:'Electronics', icon:'<rect x="6" y="2" width="12" height="20" rx="2" stroke="#20261F" stroke-width="1.3" fill="none"/><line x1="6" y1="17" x2="18" y2="17" stroke="#20261F" stroke-width="1.2"/>'},
  {id:'umbrella', label:'Umbrella', icon:'<path d="M4 12a8 8 0 0 1 16 0z" stroke="#20261F" stroke-width="1.3" fill="none"/><line x1="12" y1="12" x2="12" y2="20" stroke="#20261F" stroke-width="1.3"/><path d="M12 20a1.6 1.6 0 0 1-3.2 0" stroke="#20261F" stroke-width="1.3" fill="none" stroke-linecap="round"/>'},
  {id:'bag', label:'Bag', icon:'<rect x="4" y="8" width="16" height="12" rx="2" stroke="#20261F" stroke-width="1.3" fill="none"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="#20261F" stroke-width="1.3" fill="none"/>'},
  {id:'other', label:'Other', icon:'<circle cx="12" cy="12" r="9" stroke="#20261F" stroke-width="1.3" fill="none"/><path d="M12 16v.01M12 8a2.5 2.5 0 0 1 2.5 2.5c0 1.5-2.5 1.8-2.5 3.5" stroke="#20261F" stroke-width="1.3" fill="none" stroke-linecap="round"/>'}
];

const SEED = [
  {id:'s1', type:'found', title:'Bunch of keys with a red keychain', category:'keys', location:'Outside the mess hall', date:'2026-09-02', desc:'Three keys and a small red plastic tag, no name on it.', contact:'aditi.k@campus.edu', resolved:false},
  {id:'s2', type:'lost', title:'Black leather wallet', category:'wallet', location:'Library, 2nd floor reading room', date:'2026-09-03', desc:'Has my college ID and a bus pass inside.', contact:'9812xxxxxx', resolved:false},
  {id:'s3', type:'found', title:'Steel water bottle, dented cap', category:'bottle', location:'Basketball court', date:'2026-09-01', desc:'Left near the benches after evening practice.', contact:'rahul.s@campus.edu', resolved:false},
  {id:'s4', type:'lost', title:'College ID card', category:'id', location:'Canteen', date:'2026-08-30', desc:'Name: Priya Menon, 3rd year CSE.', contact:'priya.m@campus.edu', resolved:true},
  {id:'s5', type:'found', title:'Wired earphones, white', category:'electronics', location:'Room 204, main block', date:'2026-09-04', desc:'Found on a desk after the last lecture.', contact:'9945xxxxxx', resolved:false},
  {id:'s6', type:'lost', title:'Blue foldable umbrella', category:'umbrella', location:'Bus stop near main gate', date:'2026-09-02', desc:'', contact:'karan.v@campus.edu', resolved:false},
  {id:'s7', type:'found', title:'Grey backpack', category:'bag', location:'Computer lab, block C', date:'2026-08-29', desc:'Has some notebooks and a charger inside.', contact:'front.desk@campus.edu', resolved:true},
  {id:'s8', type:'lost', title:'Scientific calculator', category:'electronics', location:'Exam hall 3', date:'2026-09-05', desc:'Casio fx-991, name scratched on the back.', contact:'9871xxxxxx', resolved:false}
];

let items = [];
let currentTab = 'all';
let formType = 'lost';
let formCategory = 'keys';
const hasStorage = (typeof window !== 'undefined' && !!window.localStorage);

function iconSvg(catId, size=17){
  const cat = CATEGORIES.find(c=>c.id===catId) || CATEGORIES[CATEGORIES.length-1];
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${cat.icon}</svg>`;
}

async function loadItems(){
  if(hasStorage){
    try{
      const saved = localStorage.getItem('finditems');
      if(saved){ items = JSON.parse(saved); return; }
    }catch(e){ console.warn('Could not read saved items; loading demo data.', e); }
  }
  items = SEED.slice();
  await persist();
}

async function persist(){
  if(hasStorage){
    try{ localStorage.setItem('finditems', JSON.stringify(items)); }
    catch(e){ console.error('Save failed. Browser storage may be full or unavailable.', e); }
  }
}

function timeAgo(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr);
  const days = Math.floor((Date.now()-d.getTime())/86400000);
  if(days<=0) return 'today';
  if(days===1) return '1 day ago';
  return days+' days ago';
}

function renderStats(){
  document.getElementById('statTotal').textContent = items.length;
  document.getElementById('statActive').textContent = items.filter(i=>!i.resolved).length;
  document.getElementById('statResolved').textContent = items.filter(i=>i.resolved).length;
}

function matchesTab(item){
  if(currentTab==='all') return true;
  if(currentTab==='resolved') return item.resolved;
  return item.type===currentTab && !item.resolved;
}

function renderGrid(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  const filtered = items.filter(i=>{
    if(!matchesTab(i)) return false;
    if(!q) return true;
    return (i.title+' '+i.location+' '+i.category).toLowerCase().includes(q);
  }).sort((a,b)=> (a.date<b.date?1:-1));

  if(filtered.length===0){
    grid.innerHTML = `<div class="empty">
      <h3>Nothing here yet</h3>
      <p>Try a different search, or be the first to post.</p>
      <button class="btn btn-primary" onclick="openModal()">Post an item</button>
    </div>`;
    return;
  }

  filtered.forEach((item, idx)=>{
    const card = document.createElement('div');
    card.className = 'card';
    const tilt = (idx % 2 === 0 ? -1 : 1) * (0.6 + (idx%3)*0.3);
    card.style.setProperty('--tilt', tilt+'deg');
    card.style.animationDelay = Math.min(idx*45, 400)+'ms';

    const statusBadge = item.resolved
      ? `<span class="badge resolved">Resolved</span>`
      : `<span class="badge ${item.type}">${item.type==='lost'?'Lost':'Found'}</span>`;

    card.innerHTML = `
      <div class="card-top">
        <div class="cat-icon">${iconSvg(item.category)}</div>
        ${statusBadge}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta"><b>${escapeHtml(item.location)}</b> · ${timeAgo(item.date)}</div>
      <div class="desc">${escapeHtml(item.desc||'')}</div>
      <div class="card-actions">
        <button class="btn btn-ghost" onclick="contactPoster('${item.id}')">Contact</button>
        ${!item.resolved ? `<button class="btn btn-primary" onclick="resolveItem('${item.id}')">Mark resolved</button>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function contactPoster(id){
  const item = items.find(i=>i.id===id);
  if(item) showToast(`Contact: ${item.contact}`);
}

function resolveItem(id){
  const item = items.find(i=>i.id===id);
  if(item){
    item.resolved = true;
    persist();
    renderGrid();
    renderStats();
    showToast('Marked as resolved — glad it worked out!');
  }
}

function setTab(tab){
  currentTab = tab;
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  positionIndicator();
  renderGrid();
}

function positionIndicator(){
  const active = document.querySelector('.tabs button.active');
  const indicator = document.getElementById('tabIndicator');
  if(!active) return;
  indicator.style.width = active.offsetWidth+'px';
  indicator.style.transform = `translateX(${active.offsetLeft-3}px)`;
}

/* Modal */
function buildIconPicker(){
  const wrap = document.getElementById('iconPicker');
  wrap.innerHTML = '';
  CATEGORIES.forEach(cat=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.title = cat.label;
    b.className = cat.id===formCategory ? 'active' : '';
    b.innerHTML = iconSvg(cat.id);
    b.onclick = ()=>{ formCategory = cat.id; buildIconPicker(); };
    wrap.appendChild(b);
  });
}

function setFormType(t){
  formType = t;
  document.querySelectorAll('.type-toggle button').forEach(b=>b.classList.toggle('active', b.dataset.t===t));
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.className = 'btn '+(t==='lost' ? 'btn-rust' : 'btn-moss');
  submitBtn.textContent = t==='lost' ? 'Post to the board' : "Post — I'll hold onto it";
}

function openModal(type){
  document.getElementById('itemForm').reset();
  formCategory = 'keys';
  buildIconPicker();
  setFormType(type==='found' ? 'found' : 'lost');
  document.getElementById('modalTitle').textContent = 'Post an item';
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}

document.getElementById('modalOverlay').addEventListener('click', (e)=>{
  if(e.target.id==='modalOverlay') closeModal();
});

document.getElementById('itemForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const newItem = {
    id: 'i'+Date.now(),
    type: formType,
    title: document.getElementById('fTitle').value.trim(),
    category: formCategory,
    location: document.getElementById('fLocation').value.trim(),
    date: document.getElementById('fDate').value || new Date().toISOString().slice(0,10),
    desc: document.getElementById('fDesc').value.trim(),
    contact: document.getElementById('fContact').value.trim(),
    resolved: false
  };
  items.unshift(newItem);
  await persist();
  closeModal();
  currentTab = 'all';
  setTab('all');
  renderStats();
  showToast('Posted to the board!');
});

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

document.getElementById('searchInput').addEventListener('input', renderGrid);

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModal();
});

(async function init(){
  await loadItems();
  renderStats();
  renderGrid();
  positionIndicator();
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(positionIndicator);
  }
  window.addEventListener('resize', positionIndicator);
})();
