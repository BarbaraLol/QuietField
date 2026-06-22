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
  fetch('nav.html')
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