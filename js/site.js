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

  function closeMenu() {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
  }

  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  var drop = document.querySelector(".nav-drop");
  if (drop) {
    var toggle = drop.querySelector(".nav-drop-btn");
    var menu = drop.querySelector(".nav-menu");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.hidden = !open;
      drop.classList.toggle("is-open", open);
    }

    function closeDrop(restore) {
      var wasOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(false);
      if (restore && wasOpen) toggle.focus();
    }

    setOpen(false);
    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (event) {
      if (!drop.contains(event.target)) closeDrop(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrop(true);
    });
    drop.addEventListener("focusout", function (event) {
      if (!drop.contains(event.relatedTarget)) closeDrop(false);
    });
  }

  var form = document.getElementById("project-form");
  if (!form) return;

  function showThanks() {
    form.innerHTML = '<p class="statement" tabindex="-1">Got it. We\'ll reply within two business days.</p>';
    var line = form.querySelector(".statement");
    if (line) line.focus();
  }

  if (window.location.hash === "#sent") showThanks();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('[type="submit"]');
    if (data.get("botcheck")) {
      showThanks();
      return;
    }
    if (submitBtn) submitBtn.disabled = true;
    if (status) status.textContent = "";
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: data.get("access_key"),
        subject: data.get("subject"),
        from_name: data.get("from_name"),
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        "Website type": data.get("Website type"),
        "Business or personal": data.get("Business or personal")
      })
    }).then(function (response) {
      return response.json().then(function (result) {
        if (!response.ok || !result.success) throw new Error(result.message || "Send failed");
        showThanks();
      });
    }).catch(function () {
      if (submitBtn) submitBtn.disabled = false;
      if (status) status.textContent = "That didn’t send. Please try again in a moment.";
    });
  });
})();
