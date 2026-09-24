const API='https://api.github.com/repos/HephzibahBehulah/Hacking-Security-Ebooks/contents/';
const grid=document.querySelector('#library-grid');
const search=document.querySelector('#search');
const category=document.querySelector('#category');
const reset=document.querySelector('#reset');
const empty=document.querySelector('#empty');
const count=document.querySelector('#book-count');
const catCount=document.querySelector('#category-count');

let books=[];

function classify(name){
  const n=name.toLowerCase();
  if(/forensic|malware|virus|rootkit/.test(n)) return 'Forensics & Malware';
  if(/web|sql injection|xss|php security|bug hunter/.test(n)) return 'Web Security';
  if(/network|wireless|bluetooth|firewall|wireshark|snort|nessus|ssh/.test(n)) return 'Networks';
  if(/linux|unix|red hat|kali/.test(n)) return 'Linux';
  if(/penetration|pentest|ethical hacking|hacking|hack attacks|metasploit|shellcoder|intrusion/.test(n)) return 'Offensive Security';
  if(/crypt|code book/.test(n)) return 'Cryptography';
  if(/governance|iso 27001|information security|security fundamentals|computer security/.test(n)) return 'Security Foundations';
  if(/python|coding|programming|java/.test(n)) return 'Programming';
  return 'Security Library';
}

function pretty(name){
  return name.replace(/\.pdf$/i,'').replace(/\.PDF$/,'').replace(/_/g,'’').replace(/\s+/g,' ').trim();
}

function render(list){
  grid.innerHTML='';
  empty.hidden=list.length!==0;
  list.forEach((book,i)=>{
    const card=document.createElement('article');
    card.className='book';
    card.innerHTML=`<div class="book-top"><span class="book-num">${String(i+1).padStart(2,'0')}</span><span class="book-cat">${book.category}</span></div><h3>${escapeHtml(pretty(book.name))}</h3><p>PDF · ${formatSize(book.size)}</p><a href="${book.download_url}" target="_blank" rel="noopener">Open resource ↗</a>`;
    grid.appendChild(card);
  });
}

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function formatSize(bytes){return `${(bytes/1024/1024).toFixed(1)} MB`;}

function apply(){
  const q=search.value.toLowerCase().trim();
  const c=category.value;
  const filtered=books.filter(b=>(!q||pretty(b.name).toLowerCase().includes(q)||b.category.toLowerCase().includes(q))&&(c==='all'||b.category===c));
  render(filtered);
}

function populateCategories(){
  const cats=[...new Set(books.map(b=>b.category))].sort();
  cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;category.appendChild(o)});
  count.textContent=books.length;
  catCount.textContent=cats.length;
}

async function load(){
  try{
    const response=await fetch(API,{headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const data=await response.json();
    books=data.filter(x=>x.type==='file'&&/\.pdf$/i.test(x.name)).map(x=>({...x,category:classify(x.name)}));
    books.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'}));
    populateCategories();
    render(books);
  }catch(err){
    grid.innerHTML='<div class="empty" style="grid-column:1/-1">The library could not be loaded right now. Open the GitHub repository to access the collection.</div>';
    console.error(err);
  }
}

search.addEventListener('input',apply);
category.addEventListener('change',apply);
reset.addEventListener('click',()=>{search.value='';category.value='all';apply()});
load();
