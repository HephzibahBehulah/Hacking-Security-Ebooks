const API='https://api.github.com/repos/HephzibahBehulah/Hacking-Security-Ebooks/contents/';
const grid=document.querySelector('#library-grid'),search=document.querySelector('#search'),category=document.querySelector('#category'),reset=document.querySelector('#reset'),empty=document.querySelector('#empty'),count=document.querySelector('#book-count'),catCount=document.querySelector('#category-count');
let books=[];
function classify(name){const n=name.toLowerCase();if(/forensic|malware|virus|rootkit|incident/.test(n))return'Forensics & Malware';if(/web|sql injection|xss|php security|bug hunter|owasp/.test(n))return'Web Security';if(/network|wireless|bluetooth|firewall|wireshark|snort|nessus|ssh|tcp|ethernet/.test(n))return'Networks';if(/linux|unix|red hat|kali|bash/.test(n))return'Linux';if(/penetration|pentest|ethical hacking|hacking|hack attacks|metasploit|shellcoder|intrusion/.test(n))return'Offensive Security';if(/crypt|code book/.test(n))return'Cryptography';if(/governance|iso 27001|information security|security fundamentals|computer security/.test(n))return'Security Foundations';if(/python|coding|programming|java|javascript/.test(n))return'Programming';if(/electrical|electric|circuit|electronics|plc|automation|control|industrial|arduino|microcontroller/.test(n))return'Electrical & Electronics';return'Technical Library'}
function pretty(name){return name.replace(/\.pdf$/i,'').replace(/_/g,' ').replace(/\s+/g,' ').trim()}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function formatSize(bytes){return bytes?`${(bytes/1024/1024).toFixed(1)} MB`:'PDF'}
function render(list){grid.innerHTML='';empty.hidden=list.length!==0;list.forEach((book,i)=>{const card=document.createElement('article');card.className='book';card.innerHTML=`<div class="book-top"><span class="book-num">${String(i+1).padStart(2,'0')}</span><span class="book-cat">${escapeHtml(book.category)}</span></div><h3>${escapeHtml(pretty(book.name))}</h3><p>PDF · ${formatSize(book.size)}</p><a href="${book.download_url}" target="_blank" rel="noopener">Open resource ↗</a>`;grid.appendChild(card)})}
function apply(){const q=search.value.toLowerCase().trim(),c=category.value;render(books.filter(b=>(!q||pretty(b.name).toLowerCase().includes(q)||b.category.toLowerCase().includes(q))&&(c==='all'||b.category===c)))}
function populateCategories(){[...new Set(books.map(b=>b.category))].sort().forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;category.appendChild(o)});count.textContent=books.length;catCount.textContent=new Set(books.map(b=>b.category)).size+'+'}
const curated=[
 ['Cybersecurity','OWASP Web Security Testing Guide','Web application testing methodology and practical security techniques.','https://owasp.org/www-project-web-security-testing-guide/'],
 ['Cybersecurity','OWASP Developer Guide','Accessible application-security concepts for developers.','https://owasp.org/projects/developer-guide'],
 ['Germany / Security','BSI IT-Grundschutz','Germany’s federal information-security framework and methodology.','https://www.bsi.bund.de/EN/Topics/ITGrundschutz/itgrundschutz_node.html'],
 ['Electrical / Germany','VDE','German electrical engineering standards, guidance and professional information.','https://www.vde.com/'],
 ['Programming','Python Documentation','Official Python language tutorial, library reference and guides.','https://docs.python.org/3/'],
 ['Data','pandas Documentation','Reference and user guide for practical Python data analysis.','https://pandas.pydata.org/docs/'],
 ['Networking','Cisco Networking Academy','Networking and technology learning resources from Cisco.','https://www.netacad.com/'],
 ['Linux','Linux Documentation','Kernel and Linux documentation starting points.','https://docs.kernel.org/'],
 ['Git / Dev','Git Documentation','Official reference and book for version control.','https://git-scm.com/doc'],
 ['Web','MDN Web Docs','HTML, CSS, JavaScript and Web APIs reference.','https://developer.mozilla.org/'],
 ['Electronics','Arduino Documentation','Official documentation for Arduino hardware and programming.','https://docs.arduino.cc/'],
 ['Automation','Siemens Industry Online Support','Product manuals, technical information and support for Siemens industrial systems.','https://support.industry.siemens.com/'],
 ['Learning','Khan Academy','Free foundational learning across maths, science and computing.','https://www.khanacademy.org/'],
 ['Learning','MIT OpenCourseWare','Open course materials from MIT.','https://ocw.mit.edu/']
];
function renderCurated(){const box=document.querySelector('#resource-grid');if(!box)return;box.innerHTML=curated.map((r,i)=>`<a class="resource" href="${r[3]}" target="_blank" rel="noopener"><span>${String(i+1).padStart(2,'0')} · ${escapeHtml(r[0])}</span><h3>${escapeHtml(r[1])} ↗</h3><p>${escapeHtml(r[2])}</p></a>`).join('')}
async function load(){try{const response=await fetch(API,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw new Error(`GitHub API returned ${response.status}`);const data=await response.json();books=data.filter(x=>x.type==='file'&&/\.pdf$/i.test(x.name)).map(x=>({...x,category:classify(x.name)}));books.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'}));populateCategories();render(books)}catch(err){grid.innerHTML='<div class="empty" style="grid-column:1/-1">The local PDF index could not be loaded. Open the GitHub repository to access the collection.</div>';console.error(err)}}
search.addEventListener('input',apply);category.addEventListener('change',apply);reset.addEventListener('click',()=>{search.value='';category.value='all';apply()});renderCurated();load();
