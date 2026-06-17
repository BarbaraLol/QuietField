// Hamburger menu
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
toggle.classList.toggle('open');
links.classList.toggle('open');
});
function closeMenu() {
toggle.classList.remove('open');
links.classList.remove('open');
}

//Form
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