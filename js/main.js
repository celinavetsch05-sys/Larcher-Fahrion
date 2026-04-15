// ── Page navigation ──────────────────────────────────────────────────────────

function showPage(name) {
  closeMobileMenu();

  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  // Remove active state from all nav links
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
  });

  // Show the requested page
  var page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Set active nav link
  var navLink = document.getElementById('nl-' + name);
  if (navLink) {
    navLink.classList.add('active');
  }

  // Trigger fade-up animations for elements in the newly visible page
  if (page) {
    page.querySelectorAll('.fade-up').forEach(function(el) {
      el.classList.add('in');
    });
  }
}

// ── Apartment card filter ─────────────────────────────────────────────────────

function filterCards(btn, capacity) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.classList.remove('on');
  });
  btn.classList.add('on');

  // Show/hide cards based on capacity
  document.querySelectorAll('.apt-card').forEach(function(card) {
    if (capacity === 'all') {
      card.style.display = '';
    } else {
      var cap = card.getAttribute('data-cap');
      card.style.display = (cap === String(capacity)) ? '' : 'none';
    }
  });
}

// ── Testimonials ──────────────────────────────────────────────────────────────

var testimonials = [
  {
    quote: '\u201cWir kommen jedes Jahr wieder. Es f\u00fchlt sich wirklich wie ein zweites Zuhause an \u2014 danke Verena und Matthias!\u201d',
    author: '\u2014 Familie M\u00fcller, M\u00fcnchen'
  },
  {
    quote: '\u201cDie Wohnung Bergblick hat uns begeistert. Morgens Bergpanorama, abends Ruhe \u2014 so soll Urlaub sein.\u201d',
    author: '\u2014 Sarah & Thomas, Hamburg'
  },
  {
    quote: '\u201cPerfekte Gastgeber, wundersch\u00f6ne Lage. Oberammergau ist ein Geheimtipp, den wir immer wieder empfehlen.\u201d',
    author: '\u2014 Familie Weber, Berlin'
  }
];

var currentTestimonial = 0;

function setTestimonial(idx) {
  if (idx < 0 || idx >= testimonials.length) return;
  currentTestimonial = idx;

  var quoteEl = document.getElementById('t-quote');
  var authorEl = document.getElementById('t-author');
  if (quoteEl) quoteEl.textContent = testimonials[idx].quote;
  if (authorEl) authorEl.textContent = testimonials[idx].author;

  // Update dots
  document.querySelectorAll('.t-dot').forEach(function(dot, i) {
    dot.classList.toggle('on', i === idx);
  });
}

// ── Price calculator ──────────────────────────────────────────────────────────

var PRICE_PER_NIGHT = 95;

function updatePriceCalc() {
  var arriveEl = document.getElementById('arrive');
  var departEl = document.getElementById('depart');
  var calcEl   = document.getElementById('price-calc');
  if (!arriveEl || !departEl || !calcEl) return;

  var arrive = arriveEl.value;
  var depart = departEl.value;

  if (!arrive || !depart) {
    calcEl.innerHTML = 'W\u00e4hle An- &amp; Abreise f\u00fcr eine Preis\u00fcbersicht.';
    return;
  }

  var ms = new Date(depart) - new Date(arrive);
  var nights = Math.round(ms / 86400000);

  if (nights <= 0) {
    calcEl.innerHTML = 'Das Abreisedatum muss nach dem Anreisedatum liegen.';
    return;
  }

  var total = nights * PRICE_PER_NIGHT;
  calcEl.innerHTML =
    '<strong>' + nights + ' N\u00e4chte</strong> &times; ' + PRICE_PER_NIGHT + '\u00a0\u20ac/Nacht' +
    ' = <strong>' + total + '\u00a0\u20ac</strong>';
}

// ── Contact form submission ───────────────────────────────────────────────────

function handleSubmit() {
  alert('Vielen Dank! Wir melden uns so schnell wie m\u00f6glich bei dir.');
}

// ── Scroll / intersection animations ─────────────────────────────────────────

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all fade-up elements immediately
    document.querySelectorAll('.fade-up').forEach(function(el) {
      el.classList.add('in');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(function(el) {
    observer.observe(el);
  });
}

// ── Mobile menu ───────────────────────────────────────────────────────────────

function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

function closeMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('open');
}

// ── Initialise on DOM ready ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  // Show home page by default
  showPage('home');

  // Wire up price-calc inputs
  var arriveEl = document.getElementById('arrive');
  var departEl = document.getElementById('depart');
  if (arriveEl) arriveEl.addEventListener('change', updatePriceCalc);
  if (departEl) departEl.addEventListener('change', updatePriceCalc);

  // Start scroll animations
  initScrollAnimations();
});
