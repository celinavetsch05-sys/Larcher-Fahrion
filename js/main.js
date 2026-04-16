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

  // Update nav transparency (transparent only on home at top)
  updateNavStyle();
}

// ── Scroll to contact section ─────────────────────────────────────────────────

function scrollToContact() {
  showPage('home');
  setTimeout(function() {
    var el = document.getElementById('kontakt');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 50);
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
    quote: '\u201cDer Aufenthalt in Oberammergau war einfach ein Tr\u00e4umchen! Die Lage ist super! Wir haben einen wundersch\u00f6nen Blick auf den Kofel gehabt.\u201d',
    author: '\u2014 Airbnb-Gast',
    stars: 5,
    platform: 'Airbnb'
  },
  {
    quote: '\u201cSehr sch\u00f6nes und gut ausgestattetes Apartment mit einem wundersch\u00f6nen Ausblick. Die Unterkunft war sauber, geschmackvoll eingerichtet und es hat an nichts gefehlt. Wir haben uns sehr wohlgef\u00fchlt und kommen gerne wieder!\u201d',
    author: '\u2014 Airbnb-Gast',
    stars: 5,
    platform: 'Airbnb'
  },
  {
    quote: '\u201cWir haben uns mit Hund sehr wohl gef\u00fchlt. Die Unterkunft befindet sich in ruhiger Lage und mit tollem Ausblick!\u201d',
    author: '\u2014 Airbnb-Gast',
    stars: 5,
    platform: 'Airbnb'
  }
];

var currentTestimonial = 0;
var testimonialTimer = null;

function setTestimonial(idx) {
  if (idx < 0 || idx >= testimonials.length) return;
  var content = document.getElementById('testimonial-content');
  if (!content) return;

  content.classList.add('fading');

  setTimeout(function() {
    currentTestimonial = idx;
    var t = testimonials[idx];

    var quoteEl = document.getElementById('t-quote');
    var authorEl = document.getElementById('t-author');
    var starsEl = document.getElementById('t-stars');
    var platformEl = document.getElementById('t-platform');

    if (quoteEl) quoteEl.textContent = t.quote;
    if (authorEl) authorEl.textContent = t.author;
    if (starsEl) starsEl.textContent = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);
    if (platformEl) platformEl.textContent = t.platform;

    document.querySelectorAll('.t-dot').forEach(function(dot, i) {
      dot.classList.toggle('on', i === idx);
    });

    content.classList.remove('fading');
  }, 200);
}

function nextTestimonial() {
  setTestimonial((currentTestimonial + 1) % testimonials.length);
  resetAutoPlay();
}

function prevTestimonial() {
  setTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
  resetAutoPlay();
}

function resetAutoPlay() {
  if (testimonialTimer) clearInterval(testimonialTimer);
  testimonialTimer = setInterval(function() {
    setTestimonial((currentTestimonial + 1) % testimonials.length);
  }, 5000);
}

// Touch swipe support
(function() {
  var strip = document.getElementById('testimonial-strip');
  if (!strip) return;
  var startX = 0;
  strip.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  strip.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? nextTestimonial() : prevTestimonial();
    }
  }, { passive: true });

  // Pause auto-play on hover
  strip.addEventListener('mouseenter', function() {
    if (testimonialTimer) clearInterval(testimonialTimer);
  });
  strip.addEventListener('mouseleave', function() {
    resetAutoPlay();
  });
})();

// Start auto-play after page load
resetAutoPlay();


// ── Photo gallery lightbox ────────────────────────────────────────────────────

var galleryPhotos = {
  louis: [
    { src: 'images/louis-main.jpg', alt: 'Appartement Louis — Zimmer' },
    { src: 'images/louis-g2.avif', alt: 'Appartement Louis' },
    { src: 'images/louis-g3.avif', alt: 'Appartement Louis' },
    { src: 'images/louis-g4.jpg',  alt: 'Appartement Louis — Bergblick' },
    { src: 'images/louis-g5.avif', alt: 'Appartement Louis' },
    { src: 'images/louis-x1.jpg',  alt: 'Appartement Louis — Aussicht' },
    { src: 'images/louis-x2.jpg',  alt: 'Appartement Louis' },
    { src: 'images/louis-x3.avif', alt: 'Appartement Louis' },
    { src: 'images/louis-x4.avif', alt: 'Appartement Louis' }
  ],
  bergliebe: [
    { src: 'images/bergliebe-1.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-7.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-8.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-2.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-18.jpg', alt: 'Bergliebe' },
    { src: 'images/bergliebe-3.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-4.jpg',  alt: 'Bergliebe' },
    { src: 'images/bergliebe-10.jpg', alt: 'Bergliebe' },
    { src: 'images/bergliebe-16.jpg', alt: 'Bergliebe' },
    { src: 'images/bergliebe-19.jpg', alt: 'Bergliebe' },
    { src: 'images/bergliebe-20.jpg', alt: 'Bergliebe' }
  ]
};

function openLightbox(apt, startIdx) {
  var photos = galleryPhotos[apt];
  var grid = document.getElementById('lightbox-grid');
  var title = document.getElementById('lightbox-title');
  var aptName = apt === 'louis' ? 'Appartement Louis' : 'Bergliebe';

  if (title) title.textContent = aptName + ' \u00b7 ' + photos.length + ' Fotos';

  grid.innerHTML = photos.map(function(p, i) {
    return '<img src="' + p.src + '" alt="' + p.alt + '" loading="lazy" style="cursor:pointer">';
  }).join('');

  // clicking a grid image opens it full-screen
  grid.querySelectorAll('img').forEach(function(img, i) {
    img.addEventListener('click', function() {
      lbImages = grid.querySelectorAll('img');
      lbImages = Array.from(lbImages);
      lbIndex = i;
      lbShow();
    });
  });

  var overlay = document.getElementById('gallery-lightbox');
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeLightbox() {
  var overlay = document.getElementById('gallery-lightbox');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// ── Nav transparency ──────────────────────────────────────────────────────────

function updateNavStyle() {
  var nav = document.getElementById('main-nav');
  if (!nav) return;
  var homePage = document.getElementById('page-home');
  var onHome = homePage && homePage.classList.contains('active');
  if (onHome && window.scrollY < 80) {
    nav.classList.add('nav-top');
  } else {
    nav.classList.remove('nav-top');
  }
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

// ── Contact form tabs ─────────────────────────────────────────────────────────

function switchFormTab(type, btn) {
  if (!btn) return;
  document.querySelectorAll('.form-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  document.querySelectorAll('.form-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  btn.classList.add('active');
  var panel = document.getElementById('panel-' + type);
  if (panel) panel.classList.add('active');
}

// ── Contact form submission ───────────────────────────────────────────────────

function submitContactForm(type, formEl) {
  var btn = formEl.querySelector('button[type="submit"]');
  var feedback = document.getElementById('feedback-' + type);
  if (!btn || !feedback) return;

  var data = { type: type };
  formEl.querySelectorAll('input,select,textarea').forEach(function(el) {
    if (el.name) data[el.name] = el.value;
  });

  var originalText = btn.textContent;
  btn.textContent = 'Wird gesendet \u2026';
  btn.disabled = true;
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(res) { return res.json(); })
  .then(function(json) {
    if (json.ok) {
      feedback.textContent = 'Vielen Dank! Wir melden uns in K\u00fcrze bei Ihnen.';
      feedback.className = 'form-feedback success';
      formEl.reset();
    } else {
      throw new Error(json.error || 'Unbekannter Fehler');
    }
    btn.textContent = originalText;
    btn.disabled = false;
  })
  .catch(function(err) {
    console.error('Form submit error:', err);
    feedback.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es sp\u00e4ter erneut oder schreiben Sie uns direkt per E-Mail.';
    feedback.className = 'form-feedback error';
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

var lbImages = [];
var lbIndex  = 0;

function lbOpen(img) {
  var activePage = document.querySelector('.page.active');
  if (!activePage) return;
  lbImages = Array.from(activePage.querySelectorAll('.gallery-grid img, .detail-hero-imgs img, .pg-main img, .pg-cell img'));
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

  // Scroll shadow + transparency on nav
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    updateNavStyle();
  });

  // Set initial nav state
  updateNavStyle();

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
    if (e.target.matches('.gallery-grid img, .detail-hero-imgs img, .pg-main img, .pg-cell img')) {
      lbOpen(e.target);
    }
  });
});
