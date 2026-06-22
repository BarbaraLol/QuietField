// Nav (hamburger menu + active link highlight)
// Chiamabile più volte senza rompersi: se nav-toggle/nav-links non esistono ancora
// (es. mentre il fetch di nav.html è in corso) esce subito senza errori.
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  if (!toggle.dataset.navInit) {
    toggle.dataset.navInit = 'true';
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
  }

  // Evidenzia il link della pagina corrente (il file nav.html è identico su tutte le pagine)
  const current = location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}

function closeMenu() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle) toggle.classList.remove('open');
  if (links) links.classList.remove('open');
}

// Carica il nav condiviso in ogni pagina e poi inizializza i listener
function loadNav() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  fetch('nav.html', { cache: 'no-store' })
    .then(r => r.text())
    .then(html => {
      placeholder.innerHTML = html;
      initNav();
    })
    .catch(() => {
      console.error('Impossibile caricare nav.html (controlla che tu stia usando un server locale, non file://)');
    });
}

// Esegue subito: se la pagina ha già il nav nel markup, lo aggancia;
// se ha solo il placeholder, loadNav() lo popola e poi chiama initNav() lui stesso.
initNav();
loadNav();

// Footer translation
const footerTranslations = {
  it: {
    description: 'Stazioni di monitoraggio intelligente per decisioni agricole basate su dati reali.',
    location: 'Terni, Umbria — Italia',
    copyright: '&copy; 2026 Barbara Loletti · QuietField'
  },
  en: {
    description: 'Smart monitoring stations for agricultural decisions based on real data.',
    location: 'Terni, Umbria — Italy',
    copyright: '&copy; 2026 Barbara Loletti · QuietField'
  },
  fr: {
    description: 'Stations de surveillance intelligente pour des décisions agricoles basées sur des données réelles.',
    location: 'Terni, Ombrie — Italie',
    copyright: '&copy; 2026 Barbara Loletti · QuietField'
  },
  es: {
    description: 'Estaciones de monitoreo inteligente para decisiones agrícolas basadas en datos reales.',
    location: 'Terni, Umbría — Italia',
    copyright: '&copy; 2026 Barbara Loletti · QuietField'
  }
};

// Load footer and translate it
function loadFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  
  const path = window.location.pathname;
  const isSubfolder = path.match(/\/(en|it|fr|es)\//);
  const basePath = isSubfolder ? '../components/' : '';
  
  fetch(`${basePath}footer.html`, { cache: 'no-store' })
    .then(r => r.text())
    .then(html => {
      placeholder.innerHTML = html;
      
      // Rileva lingua dal path
      let lang = 'it';
      if (path.includes('/en/')) lang = 'en';
      else if (path.includes('/fr/')) lang = 'fr';
      else if (path.includes('/es/')) lang = 'es';
      
      // Traduci elementi con data-i18n
      const translations = footerTranslations[lang] || footerTranslations['it'];
      placeholder.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          el.innerHTML = translations[key];
        }
      });
    })
    .catch(() => {
      console.error('Impossibile caricare footer.html');
    });
}

loadFooter();

// Crousel with images and texts sync
function initHowItWorks() {
  const section = document.querySelector('.how-it-works');
  if (!section) return;

  const steps = section.querySelectorAll('.how-step');
  const slides = section.querySelectorAll('.how-slide');
  const counterCurrent = section.querySelector('.how-counter-current');
  const slideTitle = section.querySelector('.how-slide-title');
  const progressBar = section.querySelector('.how-progress-bar');
  const INTERVAL = 5000; // ms — durata di ogni passo prima di passare al successivo
  let current = 0;
  let timer;

  function show(i) {
    current = i;
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    if (counterCurrent) counterCurrent.textContent = String(i + 1).padStart(2, '0');
    if (slideTitle) slideTitle.textContent = steps[i].querySelector('h3').textContent;
    if (progressBar) {
      progressBar.classList.remove('animate');
      void progressBar.offsetWidth; // forza il reflow per far ripartire l'animazione da zero
      progressBar.style.setProperty('--how-interval', INTERVAL + 'ms');
      progressBar.style.animationPlayState = 'running';
      progressBar.classList.add('animate');
    }
  }

  function next() { show((current + 1) % steps.length); }
  function start() { stop(); timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) clearInterval(timer); }

  steps.forEach((s, idx) => {
    s.addEventListener('click', () => { show(idx); start(); });
  });
  section.addEventListener('mouseenter', () => {
    stop();
    if (progressBar) progressBar.style.animationPlayState = 'paused';
  });
  section.addEventListener('mouseleave', () => {
    if (progressBar) progressBar.style.animationPlayState = 'running';
    start();
  });

  show(0);
  start();
}
initHowItWorks();

// Form
function toggleExtra() {
  const extra = document.getElementById('form-extra');
  const icon = document.getElementById('toggle-icon');
  const btn = document.getElementById('form-toggle');
  const isHidden = extra.style.display === 'none';
  extra.style.display = isHidden ? 'flex' : 'none';
  icon.className = isHidden ? 'fa-solid fa-minus' : 'fa-solid fa-plus';
  if (isHidden) btn.style.display = 'none';
}

// Form submission
function handleSubmit() {
  const form = document.getElementById('feedback-form');
  const success = document.getElementById('form-success');

  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.name) data[el.name] = el.value;
  });

  if (!data.nome || !data.ruolo || !data.contatto || !data.messaggio) {
    alert('Per favore compila i campi obbligatori (*).');
    return;
  }

  fetch('https://formspree.io/f/mjgzgkop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => {
    if (r.ok) {
      if (typeof umami !== 'undefined') umami.track('form-inviato');
      form.style.display = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Errore nell\'invio. Riprova o scrivimi direttamente via email.');
    }
  }).catch(() => {
    alert('Errore di connessione. Riprova o scrivimi direttamente via email.');
  });
}

