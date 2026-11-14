/* ===== Hot Stuff — interactions ===== */

// ---------- Products ----------
const PRODUCTS = [
  { id: 1, name: "Bonnie Bear",    scent: "Lavender",   price: 24.99, emoji: "🧸" },
  { id: 2, name: "Ollie Owl",      scent: "Chamomile",  price: 22.99, emoji: "🦉" },
  { id: 3, name: "Bella Bunny",    scent: "Vanilla",    price: 23.99, emoji: "🐰" },
  { id: 4, name: "Kiki Cat",       scent: "Eucalyptus", price: 22.99, emoji: "🐱" },
  { id: 5, name: "Dot the Dog",    scent: "Rose",       price: 24.99, emoji: "🐶" },
];

// ---------- Render shop ----------
const productsEl = document.getElementById("products");
PRODUCTS.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "product";
  card.style.animationDelay = `${i * 0.08}s`;
  card.innerHTML = `
    <div class="product-img" style="background: var(--warm)">${p.emoji}</div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <p class="product-scent">${p.scent} scent</p>
      <p class="product-price">£${p.price.toFixed(2)}</p>
      <button class="add-btn" data-id="${p.id}">Add to bag</button>
    </div>`;
  productsEl.appendChild(card);
});

// ---------- Cart ----------
let cart = [];
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
}

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty++;
  else {
    const p = PRODUCTS.find((p) => p.id === id);
    cart.push({ ...p, qty: 1 });
  }
  renderCart();
  showToast(`${pName(id)} added to your bag`);
}

function pName(id) {
  return PRODUCTS.find((p) => p.id === id).name;
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = count;
  cartCount.classList.toggle("show", count > 0);

  if (!cart.length) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your bag is empty — it deserves a warm friend.</p>`;
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        (i) => `
      <div class="cart-item">
        <span class="cart-item-emoji">${i.emoji}</span>
        <div>
          <p class="cart-item-name">${i.name}</p>
          <p class="cart-item-price">£${(i.price * i.qty).toFixed(2)}</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-act="dec" data-id="${i.id}">−</button>
          <span>${i.qty}</span>
          <button class="qty-btn" data-act="inc" data-id="${i.id}">+</button>
        </div>
      </div>`
      )
      .join("");
  }
  cartTotalEl.textContent = `£${cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}`;
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const item = cart.find((i) => i.id === id);
  if (btn.dataset.act === "inc") item.qty++;
  else {
    item.qty--;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("click", (e) => {
  const add = e.target.closest(".add-btn");
  if (add) addToCart(Number(add.dataset.id));
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return showToast("Your bag is empty");
  showToast("Checkout coming soon — stay warm!");
  closeCart();
});

renderCart();

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Nav: scrolled state ----------
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links .nav-link");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    mobileMenu.classList.remove("open");
  })
);

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Contact form ----------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Thanks! We'll get back to you soon.");
  e.target.reset();
});
