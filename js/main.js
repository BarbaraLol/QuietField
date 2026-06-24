/* ============================================================
   QuietField — new_design shared JS
   ============================================================ */

// ---- Nav loader & active-link highlight ----

function closeMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.add('hidden');
}

function loadNav() {
    const placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;
    fetch('nav.html', { cache: 'no-store' })
        .then(r => r.text())
        .then(html => {
            placeholder.innerHTML = html;
            initNavActive();
            initMobileMenu();
        })
        .catch(() => console.error('Impossibile caricare nav.html'));
}

function initNavActive() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-link]').forEach(a => {
        const isActive = a.getAttribute('href') === current;
        a.classList.toggle('text-primary',         isActive);
        a.classList.toggle('font-bold',            isActive);
        a.classList.toggle('border-b-2',           isActive);
        a.classList.toggle('border-primary',       isActive);
        a.classList.toggle('pb-1',                 isActive);
        a.classList.toggle('text-on-surface-variant', !isActive);
    });
}

function initMobileMenu() {
    const btn  = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// ---- Footer loader ----

const footerTranslations = {
    it: { description: 'Stazioni di monitoraggio intelligente per decisioni agricole basate su dati reali.', copyright: '© 2026 QuietField — Progettato a Terni, Italia.', 'nav-website-heading': 'Website', 'nav-project': 'Il Progetto', 'nav-about': 'Chi Siamo', 'nav-contact': 'Contatti', 'link-project': 'progetto.html', 'link-about': 'chi_siamo.html', 'link-contact': 'contatti.html' },
    en: { description: 'Smart monitoring stations for agricultural decisions based on real data.',           copyright: '© 2026 QuietField — Designed in Terni, Italy.',  'nav-website-heading': 'Website', 'nav-project': 'The Project', 'nav-about': 'About Us', 'nav-contact': 'Contact', 'link-project': 'project.html', 'link-about': 'about.html', 'link-contact': 'contacts.html' },
    fr: { description: 'Stations de surveillance intelligente pour des décisions agricoles basées sur des données réelles.', copyright: '© 2026 QuietField — Conçu à Terni, Italie.', 'nav-website-heading': 'Site Web', 'nav-project': 'Le Projet', 'nav-about': 'Qui Sommes-Nous', 'nav-contact': 'Contact', 'link-project': 'projet.html', 'link-about': 'qui-sommes-nous.html', 'link-contact': 'contact.html' },
    es: { description: 'Estaciones de monitoreo inteligente para decisiones agrícolas basadas en datos reales.', copyright: '© 2026 QuietField — Diseñado en Terni, Italia.', 'nav-website-heading': 'Sitio Web', 'nav-project': 'El Proyecto', 'nav-about': 'Quiénes Somos', 'nav-contact': 'Contacto', 'link-project': 'proyecto.html', 'link-about': 'quienes-somos.html', 'link-contact': 'contacto.html' }
};

function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;
    const path = window.location.pathname;
    const isSubfolder = path.match(/\/(en|it|fr|es)\//);
    const base = isSubfolder ? '../components/' : 'components/';
    fetch(`${base}footer.html`, { cache: 'no-store' })
        .then(r => r.text())
        .then(html => {
            placeholder.innerHTML = html;
            // Translate
            let lang = 'it';
            if (path.includes('/en/')) lang = 'en';
            else if (path.includes('/fr/')) lang = 'fr';
            else if (path.includes('/es/')) lang = 'es';
            const t = footerTranslations[lang] || footerTranslations.it;
            placeholder.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key]) el.textContent = t[key];
            });
            // Set language-specific hrefs on footer nav links
            placeholder.querySelectorAll('[data-link-key]').forEach(a => {
                const href = t['link-' + a.getAttribute('data-link-key')];
                if (href) a.setAttribute('href', href);
            });
            // Highlight current page in footer nav
            const current = location.pathname.split('/').pop() || 'index.html';
            placeholder.querySelectorAll('[data-footer-link]').forEach(a => {
                if (a.getAttribute('href') === current) {
                    a.classList.add('text-digital-lime', 'font-bold');
                    a.classList.remove('text-primary-fixed-dim/70');
                }
            });
        })
        .catch(() => console.error('Impossibile caricare footer.html'));
}

// ---- Scroll reveal ----

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });
}

// ---- Chi siamo: skill pills parallax on mousemove ----

function initSkillPillsParallax() {
    document.addEventListener('mousemove', (e) => {
        const pills = document.querySelectorAll('.skill-pill');
        if (!pills.length) return;
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        pills.forEach((pill, idx) => {
            const speed = (idx + 1) * 1.2;
            pill.style.transform = `translate(${(x - 0.5) * speed}px, ${(y - 0.5) * speed}px)`;
        });
    });
}

// ---- Contatti: input label colour on focus/blur ----

function initFormLabelEffects() {
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('focus', () => {
            const label = el.closest('.relative, .group')?.querySelector('label');
            if (label) { label.classList.add('text-data-cyan'); label.classList.remove('text-outline'); }
        });
        el.addEventListener('blur', () => {
            const label = el.closest('.relative, .group')?.querySelector('label');
            if (label) { label.classList.remove('text-data-cyan'); label.classList.add('text-outline'); }
        });
    });
}

// ---- Progetto: glass card mouse-tracking glow ----

function initGlassCardGlow() {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

// ---- Contatti: Formspree form submission ----

function handleSubmit() {
    const form = document.getElementById('feedback-form');
    const success = document.getElementById('form-success');
    const data = {};
    form.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.name) data[el.name] = el.value;
    });
    if (!data.nome || !data.contatto) {
        alert('Per favore compila almeno nome e email di contatto.');
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
            alert('Errore nell\'invio. Riprova o scrivici direttamente via email.');
        }
    }).catch(() => {
        alert('Errore di connessione. Riprova o scrivici direttamente via email.');
    });
}

// ---- Boot ----

document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    loadFooter();
    initScrollReveal();
    initSkillPillsParallax();
    initFormLabelEffects();
    initGlassCardGlow();
});
