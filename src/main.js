import "./styles.css";

/* Sawa — landing page interactions */

/* ---------- theme toggle ---------- */
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  try {
    localStorage.setItem("sawa-theme", theme);
  } catch (e) {
    /* storage unavailable */
  }
}

themeToggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});

/* ---------- header scroll state ---------- */
const header = document.getElementById("site-header");
let ticking = false;

function updateHeader() {
  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true }
);

updateHeader();

/* ---------- mobile menu ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

function closeMenu() {
  menuToggle?.classList.remove("open");
  mobileMenu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileMenu?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openMenu() {
  menuToggle?.classList.add("open");
  mobileMenu?.classList.add("open");
  menuToggle?.setAttribute("aria-expanded", "true");
  mobileMenu?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.contains("open");
  if (isOpen) closeMenu();
  else openMenu();
});

mobileMenu?.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ---------- reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- product preview tabs ---------- */
const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });

    panels.forEach((p) => {
      p.classList.toggle("active", p.dataset.panel === target);
    });
  });
});

/* ---------- FAQ accordion ---------- */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-q");
  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- pricing toggle ---------- */
const billingBtns = document.querySelectorAll(".billing-btn");
const amounts = document.querySelectorAll(".price-amount[data-monthly]");

billingBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const period = btn.dataset.period;

    billingBtns.forEach((b) => b.classList.toggle("active", b === btn));

    amounts.forEach((amount) => {
      const next = amount.dataset[period];
      amount.style.opacity = "0";
      amount.style.transform = "translateY(4px)";
      setTimeout(() => {
        amount.textContent = next;
        amount.style.opacity = "1";
        amount.style.transform = "none";
      }, 160);
    });
  });
});
