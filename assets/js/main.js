/**
 * main.js — Lawu Vista Frontend JavaScript
 * FAQ Accordion | Gallery Lightbox | Sticky Nav | Scroll Reveal | Lead Form AJAX
 */
(function () {
  'use strict';

  /* ─── NAV SCROLL BEHAVIOUR ─── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
        nav.classList.remove('nav-transparent');
      } else {
        nav.classList.remove('nav-scrolled');
        nav.classList.add('nav-transparent');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── MOBILE NAV TOGGLE ─── */
  const toggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const expanded = mobileMenu.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        el.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
      });
      // open clicked (unless already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ─── GALLERY LIGHTBOX ─── */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  let galleryItems = [];
  let currentIndex = 0;

  function openLightbox(idx) {
    if (!lightbox || !lbImg || !galleryItems.length) return;
    currentIndex = idx;
    lbImg.src = galleryItems[idx].dataset.src || galleryItems[idx].querySelector('img')?.src || '';
    lbImg.alt = galleryItems[idx].dataset.alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function showLightboxItem(idx) {
    if (!galleryItems.length) return;
    currentIndex = (idx + galleryItems.length) % galleryItems.length;
    lbImg.src = galleryItems[currentIndex].dataset.src || galleryItems[currentIndex].querySelector('img')?.src || '';
  }

  if (lightbox) {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => showLightboxItem(currentIndex - 1));
    if (lbNext) lbNext.addEventListener('click', () => showLightboxItem(currentIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightboxItem(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightboxItem(currentIndex + 1);
    });
  }

  /* ─── SCROLL REVEAL ─── */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ─── BACK TO TOP ─── */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── LAZY LOAD IMAGES ─── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src]').forEach((img) => imgObserver.observe(img));
  } else {
    document.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  /* ─── LEAD FORM AJAX ─── */
  const leadForms = document.querySelectorAll('.lead-form-ajax');
  leadForms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12h6M12 9v6"/></svg> Mengirim...';

      try {
        const data = new FormData(form);
        const res = await fetch('/api/lead.php', { method: 'POST', body: data });
        const json = await res.json();
        if (json.success) {
          form.innerHTML = `
            <div class="lead-form-success">
              <div class="success-icon">✅</div>
              <h3>Terima kasih, ${json.data?.name || 'Anda'}!</h3>
              <p>Pesan Anda berhasil terkirim. Tim Lawu Vista akan menghubungi Anda segera via WhatsApp.</p>
            </div>`;
          // Fire GA/Ads conversion if available
          if (typeof gtag === 'function' && window.LV_ADS_ID && window.LV_ADS_LABEL) {
            gtag('event', 'conversion', { send_to: window.LV_ADS_ID + '/' + window.LV_ADS_LABEL });
          }
        } else {
          showFormError(form, json.message || 'Terjadi kesalahan. Coba lagi.');
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      } catch {
        showFormError(form, 'Koneksi gagal. Silakan coba lagi.');
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  });

  function showFormError(form, msg) {
    let el = form.querySelector('.form-error-msg');
    if (!el) {
      el = document.createElement('div');
      el.className = 'alert alert-error form-error-msg';
      form.prepend(el);
    }
    el.textContent = msg;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── WA BUTTON TRACKING ─── */
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((a) => {
    a.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { event_category: 'CTA', event_label: a.closest('[data-service]')?.dataset?.service || 'general' });
      }
    });
  });

  /* ─── TESTIMONIAL VIDEO ─── */
  document.querySelectorAll('.testi-video-thumb').forEach((thumb) => {
    const url = thumb.dataset.video;
    if (!url) return;
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      // Convert youtube watch URL to embed
      const embedUrl = url
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'youtube.com/embed/')
        + '?autoplay=1';
      iframe.src = embedUrl;
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.style.cssText = 'width:100%;height:100%;border:none;';
      thumb.innerHTML = '';
      thumb.appendChild(iframe);
    });
  });

  /* ─── STAR RATING DISPLAY ─── */
  document.querySelectorAll('[data-rating]').forEach((el) => {
    const rating = parseFloat(el.dataset.rating) || 5;
    el.innerHTML = Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating) ? 'fill:#f59e0b;' : 'fill:#d1d5db;';
      return `<svg width="16" height="16" viewBox="0 0 24 24" style="${filled}color:${i < rating ? '#f59e0b' : '#d1d5db'}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/></svg>`;
    }).join('');
  });

  /* CSS for spin animation inline */
  const style = document.createElement('style');
  style.textContent = '.spin{animation:lv-spin 1s linear infinite}@keyframes lv-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);

})();
