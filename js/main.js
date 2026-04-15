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

// ── Lightbox ──────────────────────────────────────────────────────────────────

var lbImages = [];
var lbIndex  = 0;

function lbOpen(img) {
  // Collect all gallery images from the current active page
  var activePage = document.querySelector('.page.active');
  if (!activePage) return;
  lbImages = Array.from(activePage.querySelectorAll('.gallery-grid img, .detail-hero-imgs img'));
  lbIndex  = lbImages.indexOf(img);
  if (lbIndex < 0) { lbImages = [img]; lbIndex = 0; }
  lbShow();
}

function lbShow() {
  var overlay = document.getElementById('lightbox');
  var imgEl   = document.getElementById('lightbox-img');
  var counter = document.getElementById('lightbox-counter');
  if (!overlay || !imgEl) return;
  imgEl.src = lbImages[lbIndex].src;
  imgEl.alt = lbImages[lbIndex].alt || '';
  counter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function lbHide() {
  var overlay = document.getElementById('lightbox');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function lbClose(e) {
  // Close only when clicking the overlay itself (not the image or buttons)
  if (e.target === document.getElementById('lightbox')) lbHide();
}

function lbStep(dir, e) {
  if (e) e.stopPropagation();
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  lbShow();
}

// ── Initialise on DOM ready ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  // Show home page by default
  showPage('home');

  // Start scroll animations
  initScrollAnimations();

  // Scroll shadow on nav
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    var overlay = document.getElementById('lightbox');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (e.key === 'Escape')     lbHide();
    if (e.key === 'ArrowRight') lbStep(1, null);
    if (e.key === 'ArrowLeft')  lbStep(-1, null);
  });

  // Wire up gallery images to lightbox
  document.addEventListener('click', function(e) {
    if (e.target.matches('.gallery-grid img, .detail-hero-imgs img')) {
      lbOpen(e.target);
    }
  });
});
