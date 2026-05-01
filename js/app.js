/* =========================================================
   EVENTS DASHBOARD CONTROLLER
   ========================================================= */
document.getElementById('liveDate').textContent =
  new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});

const EVENTS = [
  { m:5,  d:11, end:14, name:'AUVSI XPONENTIAL 2026',               loc:'Detroit, MI',              cat:'adas',   url:'https://www.xponential.org' },
  { m:5,  d:19, end:19, name:'GlobalPlatform Cyber Vehicle Forum',   loc:'Michigan, USA',            cat:'cyber',  url:'https://globalplatform.org/event/cybersecurity-vehicle-forum/' },
  { m:5,  d:19, end:21, name:'escar USA 2026',                       loc:'Novi, MI',                 cat:'cyber',  url:'https://www.escar.info/escar-usa.html' },
  { m:6,  d:2,  end:4,  name:'AutoTech 2026',                        loc:'Novi, MI',                 cat:'auto',   url:'https://autotechevents.com/home/passes-prices/' },
  { m:6,  d:9,  end:9,  name:'Auto Tech Showcase 2026',              loc:'Washington, DC',           cat:'auto',   url:'https://www.automotiveinnovation.org' },
  { m:6,  d:16, end:18, name:'ICS/SCADA Cybersecurity Symposium',    loc:'Chicago, IL',              cat:'cyber',  url:'https://www.sans.org/cyber-security-training-events/' },
  { m:6,  d:21, end:25, name:'IEEE Intelligent Vehicles Sym.',        loc:'Detroit, MI',              cat:'adas',   url:'https://ieee-iv.org' },
  { m:6,  d:23, end:24, name:'Automotive Chassis Systems USA',        loc:'Ypsilanti, MI',            cat:'safety', url:'https://www.automotive-iq.com/events-automotive-chassis-systems-usa' },
  { m:6,  d:23, end:25, name:'Sensors Converge 2026 (Sensor+Test)',  loc:'Santa Clara, CA',          cat:'adas',   url:'https://www.sensorsconverge.com' },
  { m:6,  d:29, end:30, name:'SDV USA — Software Defined Vehicle',   loc:'San Francisco, CA',        cat:'sdv',    url:'https://www.sdv-usa.com' },
  { m:7,  d:27, end:30, name:'SAE Automated Transportation Sym.',     loc:'San Diego, CA',            cat:'adas',   url:'https://www.sae.org/attend/' },
  { m:8,  d:6,  end:9,  name:'DEF CON 34 — Car Hacking Village',    loc:'Las Vegas, NV',            cat:'cyber',  url:'https://defcon.org' },
  { m:9,  d:28, end:29, name:'Q3 AvTech Summit 2026',                loc:'Detroit, MI',              cat:'mixed',  url:'https://www.aviation-isac.org' },
  { m:10, d:6,  end:9,  name:'Auto-ISAC Summit 2026',                loc:'Novi, MI',                 cat:'cyber',  url:'https://automotiveisac.com/2026-annual-summit' },
  { m:10, d:19, end:22, name:'ACM Advanced Technology Labs',          loc:'Ypsilanti, MI',            cat:'mixed',  url:'https://www.acmwillowrun.org' },
  { m:10, d:27, end:29, name:'Vehicle Tech Week North America',      loc:'Novi, MI',                 cat:'adas',   url:'https://www.autonomousvehicletechnologyexpo-usa.com' },
  { m:11, d:3,  end:6,  name:'SEMA Show 2026',                       loc:'Las Vegas, NV',            cat:'auto',   url:'https://www.semashow.com' },
];

const CAT_COLORS = { cyber:'#DC2626', auto:'#2832D8', safety:'#16A34A', adas:'#D97706', sdv:'#0891B2', mixed:'#7C3AED' };
const MNAMES = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
const MSHORT = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Filter */
function filterCat(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.event-card').forEach(c => {
    c.style.display = (cat === 'all' || (c.dataset.cats||'').includes(cat)) ? '' : 'none';
  });
  updateCounts();
}

function updateCounts() {
  document.querySelectorAll('.month-divider').forEach(div => {
    let n = div.nextElementSibling, count = 0;
    while (n && !n.classList.contains('month-divider')) {
      if (n.classList.contains('event-card') && n.style.display !== 'none') count++;
      n = n.nextElementSibling;
    }
    const sp = div.querySelector('.month-count');
    if (sp) sp.textContent = count + (count === 1 ? ' event' : ' events');
  });
}

function doSearch(q) {
  q = q.toLowerCase().trim();
  document.querySelectorAll('.event-card').forEach(c => {
    c.style.display = (!q || c.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
  updateCounts();
}

function jumpTo(id) {
  const el = document.getElementById(id);
  if (el) { switchView('list'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

/* View switching */
function switchView(view) {
  const views = { list: 'listView', calendar: 'calendarView', cost: 'costView' };
  Object.values(views).forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });
  const target = document.getElementById(views[view]);
  if (target) target.style.display = '';
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  const map = { list: 'btnList', calendar: 'btnCal', cost: 'btnCost' };
  const btn = document.getElementById(map[view]);
  if (btn) btn.classList.add('active');
  if (view === 'calendar') buildCalendar();
}

/* Calendar builder */
let calBuilt = false;
function buildCalendar() {
  if (calBuilt) return;
  calBuilt = true;
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  const today = new Date();
  [5, 6, 7, 8, 9, 10].forEach(m => {
    const year = 2026;
    const firstDay = new Date(year, m - 1, 1).getDay();
    const daysInMon = new Date(year, m, 0).getDate();
    const evs = EVENTS.filter(e => e.m === m);

    const card = document.createElement('div');
    card.className = 'cal-month-card';
    card.innerHTML = `<div class="cal-month-head"><span class="cal-month-name">${MNAMES[m]} 2026</span><span class="cal-month-badge">${evs.length} event${evs.length!==1?'s':''}</span></div>`;

    const wdRow = document.createElement('div');
    wdRow.className = 'cal-weekdays';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const c = document.createElement('div'); c.className = 'cal-wday'; c.textContent = d; wdRow.appendChild(c);
    });
    card.appendChild(wdRow);

    const dGrid = document.createElement('div');
    dGrid.className = 'cal-days-grid';
    for (let i = 0; i < firstDay; i++) {
      const e = document.createElement('div'); e.className = 'cal-cell empty'; dGrid.appendChild(e);
    }
    for (let day = 1; day <= daysInMon; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const isToday = (m === today.getMonth()+1 && day === today.getDate() && year === today.getFullYear());
      if (isToday) cell.classList.add('today');
      const numEl = document.createElement('div');
      numEl.className = 'cal-cell-num'; numEl.textContent = day;
      cell.appendChild(numEl);
      const dayEvs = evs.filter(e => day >= e.d && day <= Math.min(e.end, daysInMon));
      if (dayEvs.length) {
        cell.classList.add('has-event');
        const dots = document.createElement('div'); dots.className = 'cal-dots';
        dayEvs.forEach(ev => {
          const dot = document.createElement('div');
          dot.className = 'cal-dot';
          dot.style.background = CAT_COLORS[ev.cat] || '#2832D8';
          const tt = document.createElement('div'); tt.className = 'cal-tt'; tt.textContent = ev.name;
          dot.appendChild(tt);
          dot.addEventListener('click', () => window.open(ev.url, '_blank'));
          dots.appendChild(dot);
        });
        cell.appendChild(dots);
      }
      dGrid.appendChild(cell);
    }
    const total = firstDay + daysInMon;
    for (let i = 0; i < (7 - total % 7) % 7; i++) {
      const e = document.createElement('div'); e.className = 'cal-cell empty'; dGrid.appendChild(e);
    }
    card.appendChild(dGrid);

    const list = document.createElement('div'); list.className = 'cal-events-list';
    evs.forEach(ev => {
      const endDay = Math.min(ev.end, daysInMon);
      const dateStr = ev.d === endDay ? `${MSHORT[ev.m]} ${ev.d}` : `${MSHORT[ev.m]} ${ev.d}–${endDay}`;
      const row = document.createElement('a');
      row.className = 'cal-event-row'; row.href = ev.url; row.target = '_blank'; row.rel = 'noopener';
      row.innerHTML = `<span class="cr-dot" style="background:${CAT_COLORS[ev.cat]||'#2832D8'}"></span><span class="cr-date">${dateStr}</span><span class="cr-name">${ev.name}</span><span class="cr-loc">${ev.loc.split(',')[1]||ev.loc}</span><span class="cr-link"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>`;
      list.appendChild(row);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });
}

/* Save & CSV */
function doSave(name, date, loc) {
  const saved = JSON.parse(localStorage.getItem('ibxEv')||'[]');
  if (!saved.find(e => e.name === name)) { saved.push({name,date,loc}); localStorage.setItem('ibxEv',JSON.stringify(saved)); }
  alert(`✓ Saved: ${name}\n${date} · ${loc}`);
}
function exportCSV() {
  const catMap = { cyber:'Cybersecurity', auto:'Automotive', safety:'Functional Safety', adas:'ADAS', sdv:'SDV', mixed:'Cross-Domain' };
  const hdr = ['Event','Start Date','End','Location','Category','Website'];
  const rows = EVENTS.map(e => [`"${e.name}"`,`"${MSHORT[e.m]} ${e.d} 2026"`,`"${MSHORT[e.m]} ${e.end} 2026"`,`"${e.loc}"`,`"${catMap[e.cat]||e.cat}"`,`"${e.url}"`].join(','));
  const csv = [hdr.join(','),...rows].join('\n');
  const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([csv],{type:'text/csv'})),download:'ibexvision_events_2026.csv'});
  a.click();
}

/* Staggered card animation */
document.querySelectorAll('.event-card').forEach((c,i) => { c.style.animationDelay=(i*45)+'ms'; });
