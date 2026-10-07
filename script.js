/* Moussa Diagne — Portfolio Hero interactions (vanilla JS) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var page = document.querySelector(".md-page");
    if (!page || page.dataset.mdInit) return;
    page.dataset.mdInit = "1";

    // 1. Apparition du Hero
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { page.classList.add("is-ready"); });
    });

    // 2. Parallax léger des halos à la souris
    var halos = page.querySelectorAll("[data-depth]");
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      page.addEventListener("pointermove", function (e) {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        halos.forEach(function (el) {
          var d = parseFloat(el.getAttribute("data-depth")) || 20;
          el.style.transform = "translate3d(" + x * d + "px," + y * d + "px,0)";
        });
      });
    }

    // 3. Bouton magnétique
    var magnets = page.querySelectorAll("[data-magnetic]");
    if (!reduceMotion) {
      magnets.forEach(function (btn) {
        btn.addEventListener("pointermove", function (e) {
          var r = btn.getBoundingClientRect();
          var mx = e.clientX - (r.left + r.width / 2);
          var my = e.clientY - (r.top + r.height / 2);
          btn.style.transform = "translate(" + mx * 0.18 + "px," + my * 0.28 + "px)";
        });
        btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
      });
    }

    // 4. Particules discrètes
    var canvas = page.querySelector(".md-particles");
    if (canvas && !reduceMotion) particles(canvas);
  }

  function particles(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, dots = [];

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, (w * h) / 22000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.12, vy: -Math.random() * 0.18 - 0.03,
          a: Math.random() * 0.5 + 0.15, t: Math.random() * Math.PI * 2
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i];
        p.x += p.vx; p.y += p.vy; p.t += 0.02;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,207,159," + (p.a * (0.6 + Math.sin(p.t) * 0.4)) + ")";
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    tick();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("load", init);
})();
