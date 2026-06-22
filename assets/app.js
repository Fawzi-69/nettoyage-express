/* ===== Nettoyage Express — interactions ===== */
(function () {
  "use strict";

  /* progressive enhancement flag: content is visible unless JS runs */
  document.documentElement.classList.add("js");

  /* sticky nav state + reading progress bar */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* duplicate marquee track for a seamless infinite loop */
  var avisTrack = document.getElementById("avisTrack");
  if (avisTrack) {
    avisTrack.innerHTML += avisTrack.innerHTML;
  }

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (prefersReduced) {
    /* accessibility: show everything, no motion */
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    /* GSAP: hero photo depth parallax — purely decorative, never hides content */
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      var hpImg = document.querySelector(".hero-photo img");
      if (hpImg) {
        gsap.to(hpImg, {
          yPercent: 10, scale: 1.07, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      }
      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    }

    /* section reveals (incl. hero, staggered via data-d) */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0, rootMargin: "0px 0px 80px 0px" });
      reveals.forEach(function (el) { io.observe(el); });

      /* safety: ensure anything already on screen is shown once loaded */
      window.addEventListener("load", function () {
        reveals.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
        });
      });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* animated counters */
  var counted = false;
  var animateCounts = function () {
    if (counted) return;
    counted = true;
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  var statsEl = document.querySelector(".stats");
  if (statsEl && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCounts(); sio.disconnect(); } });
    }, { threshold: 0.5 });
    sio.observe(statsEl);
  } else {
    animateCounts();
  }

  /* subtle parallax on hero photo (only when GSAP isn't driving it) */
  var heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && !window.gsap && window.matchMedia("(min-width:921px)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < 700) heroPhoto.style.transform = "rotate(1.4deg) translateY(" + (y * 0.04) + "px)";
    }, { passive: true });
  }

  /* quote form (demo handler) */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = document.getElementById("formOk");
      ok.classList.add("show");
      form.reset();
      setTimeout(function () { ok.classList.remove("show"); }, 6000);
    });
  }
})();
