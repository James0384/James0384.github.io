(function () {
  var nav = document.querySelector(".nav");
  var btn = document.querySelector(".menu-btn");
  var panel = document.getElementById("nav-panel");
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }
})();
