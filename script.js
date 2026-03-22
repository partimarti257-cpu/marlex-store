const products = [
  {
    id: 1,
    slug: "mf-core-tee",
    name: "MF Core Tee",
    category: "Тениски",
    price: 79,
    oldPrice: 95,
    badge: "New",
    rating: 4.8,
    reviews: 84,
    description: "Oversized тениска с минималистичен MF знак и premium streetwear силует.",
    longDescription: "Тежък памук, clean силует и комфортен fit за ежедневен premium look. Създадена да стои добре както самостоятелно, така и в layered styling."
  },
  {
    id: 2,
    slug: "mf-street-sneakers",
    name: "MF Street Sneakers",
    category: "Обувки",
    price: 189,
    oldPrice: 229,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 124,
    description: "Масивни sneakers с premium monochrome визия и силно градско присъствие.",
    longDescription: "Комбинация от комфорт, стабилност и разпознаваем силует. Подходящ модел за hero продукт на бранда с ясно streetwear позициониране."
  },
  {
    id: 3,
    slug: "mf-signature-hoodie",
    name: "MF Signature Hoodie",
    category: "Худита",
    price: 129,
    oldPrice: 149,
    badge: "Limited",
    rating: 4.7,
    reviews: 53,
    description: "Плътно худи с clean front branding и streetwear fit.",
    longDescription: "Premium плътност, soft interior и минималистичен фронтален знак за бранд усещане без излишен шум."
  },
  {
    id: 4,
    slug: "mf-essential-cap",
    name: "MF Essential Cap",
    category: "Аксесоари",
    price: 49,
    oldPrice: 59,
    badge: "Logo",
    rating: 4.6,
    reviews: 41,
    description: "Шапка с изчистен силует за завършен MF стил.",
    longDescription: "Лек, удобен аксесоар за завършен monochrome outfit с дискретна, но силна бранд идентичност."
  },
  {
    id: 5,
    slug: "mf-motion-hoodie",
    name: "MF Motion Hoodie",
    category: "Худита",
    price: 139,
    oldPrice: 159,
    badge: "Drop 01",
    rating: 4.8,
    reviews: 38,
    description: "Heavyweight худи за premium усещане и standout визия.",
    longDescription: "Изградено за хладни дни, тежка материя и по-структуриран fit за по-луксозно streetwear присъствие."
  },
  {
    id: 6,
    slug: "mf-mono-tee",
    name: "MF Mono Tee",
    category: "Тениски",
    price: 69,
    oldPrice: 89,
    badge: "Core",
    rating: 4.5,
    reviews: 29,
    description: "Базова тениска за ежедневен premium look.",
    longDescription: "Чист front, ясен fit и лесно комбиниране с denim, cargo или layered outerwear."
  }
];

const categories = ["Всички", "Тениски", "Обувки", "Худита", "Аксесоари"];
const clothingSizes = ["S", "M", "L", "XL"];
const shoeSizes = ["40", "41", "42", "43", "44"];
const colors = ["Черно", "Бяло", "Сиво"];

let selectedCategory = "Всички";

function eur(price) {
  return (price / 1.95583).toFixed(2);
}

function formatPrice(price) {
  return `${price} € / лв ${eur(price)}`;
}

let searchQuery = "";
let activeProduct = products[1];
let selectedSize = "42";
let selectedColor = "Черно";
let quantity = 1;
let wishlist = [2];
let cart = [
  { productId: 2, name: "MF Street Sneakers", price: 189, qty: 1, size: "42", color: "Черно" },
  { productId: 1, name: "MF Core Tee", price: 79, qty: 1, size: "L", color: "Бяло" }
];

const els = {
  categoryBar: document.getElementById("categoryBar"),
  searchInput: document.getElementById("searchInput"),
  productsGrid: document.getElementById("productsGrid"),
  productCount: document.getElementById("productCount"),
  wishlistCount: document.getElementById("wishlistCount"),
  cartItemCount: document.getElementById("cartItemCount"),
  cartCount: document.getElementById("cartCount"),
  cartList: document.getElementById("cartList"),
  subtotal: document.getElementById("subtotal"),
  shipping: document.getElementById("shipping"),
  total: document.getElementById("total"),
  activeName: document.getElementById("activeName"),
  activePrice: document.getElementById("activePrice"),
  activeRating: document.getElementById("activeRating"),
  activeReviews: document.getElementById("activeReviews"),
  activeDescription: document.getElementById("activeDescription"),
  sizeOptions: document.getElementById("sizeOptions"),
  colorOptions: document.getElementById("colorOptions"),
  qtyValue: document.getElementById("qtyValue"),
  qtyMinus: document.getElementById("qtyMinus"),
  qtyPlus: document.getElementById("qtyPlus"),
  addToCartBtn: document.getElementById("addToCartBtn"),
  selectedColorText: document.getElementById("selectedColorText"),
  nameInput: document.getElementById("nameInput"),
  phoneInput: document.getElementById("phoneInput"),
  emailInput: document.getElementById("emailInput"),
  addressInput: document.getElementById("addressInput"),
  cityInput: document.getElementById("cityInput"),
  zipInput: document.getElementById("zipInput"),
  notesInput: document.getElementById("notesInput"),
  orderBtn: document.getElementById("orderBtn"),
  successBox: document.getElementById("successBox")
};

function filteredProducts() {
  return products.filter((product) => {
    const matchesCategory = selectedCategory === "Всички" || product.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

function isShoe(product) {
  return product.category === "Обувки";
}

function updateCounts() {
  els.productCount.textContent = filteredProducts().length;
  els.wishlistCount.textContent = wishlist.length;
  els.cartItemCount.textContent = cart.length;
  els.cartCount.textContent = cart.length;
}

function renderCategories() {
  els.categoryBar.innerHTML = "";
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.className = selectedCategory === category ? "active" : "";
    btn.onclick = () => {
      selectedCategory = category;
      renderAll();
    };
    els.categoryBar.appendChild(btn);
  });
}

function renderProducts() {
  const list = filteredProducts();
  els.productsGrid.innerHTML = "";

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const wished = wishlist.includes(product.id);
    card.innerHTML = `
      <div class="product-media">
        <div class="badge">${product.badge}</div>
        <button class="wishlist-btn">${wished ? "♥" : "♡"}</button>
        <div class="product-visual"><div><span>MF</span><div class="mock-sub">${product.category}</div></div></div>
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${product.category}</span><span>${product.rating.toFixed(1)} (${product.reviews})</span></div>
        <div class="product-title-row">
          <h4>${product.name}</h4>
          <div class="price-box"><strong>${formatPrice(product.price)}</strong><span>${product.oldPrice} лв</span></div>
        </div>
        <p class="product-desc-sm">${product.description}</p>
        <div class="product-actions">
          <button class="btn btn-light">Детайли</button>
          <button class="btn btn-dark">Save</button>
        </div>
      </div>
    `;

    const [wishBtn, detailsBtn, saveBtn] = [
      card.querySelector(".wishlist-btn"),
      card.querySelector(".btn-light"),
      card.querySelector(".btn-dark")
    ];

    wishBtn.onclick = () => toggleWishlist(product.id);
    saveBtn.onclick = () => toggleWishlist(product.id);
    detailsBtn.onclick = () => {
      activeProduct = product;
      selectedSize = isShoe(product) ? "42" : "L";
      selectedColor = "Черно";
      quantity = 1;
      renderActiveProduct();
      window.location.hash = "product";
    };

    els.productsGrid.appendChild(card);
  });

  if (!list.length) {
    els.productsGrid.innerHTML = '<div class="empty-state">Няма намерени продукти.</div>';
  }
}

function renderActiveProduct() {
  els.activeName.textContent = activeProduct.name;
  els.activePrice.textContent = formatPrice(activeProduct.price);
  els.activeRating.textContent = activeProduct.rating.toFixed(1);
  els.activeReviews.textContent = activeProduct.reviews;
  els.activeDescription.textContent = activeProduct.longDescription;
  els.qtyValue.textContent = quantity;
  els.selectedColorText.textContent = selectedColor;

  const sizes = isShoe(activeProduct) ? shoeSizes : clothingSizes;
  els.sizeOptions.innerHTML = "";
  sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.textContent = size;
    btn.className = selectedSize === size ? "active" : "";
    btn.onclick = () => {
      selectedSize = size;
      renderActiveProduct();
    };
    els.sizeOptions.appendChild(btn);
  });

  els.colorOptions.innerHTML = "";
  colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.className = selectedColor === color ? "active" : "";
    btn.onclick = () => {
      selectedColor = color;
      renderActiveProduct();
    };
    els.colorOptions.appendChild(btn);
  });
}

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) wishlist = wishlist.filter((id) => id !== productId);
  else wishlist.push(productId);
  renderAll();
}

function addToCart() {
  const existing = cart.find((item) => item.productId === activeProduct.id && item.size === selectedSize && item.color === selectedColor);
  if (existing) existing.qty += quantity;
  else cart.push({
    productId: activeProduct.id,
    name: activeProduct.name,
    price: activeProduct.price,
    qty: quantity,
    size: selectedSize,
    color: selectedColor
  });
  renderCart();
  updateCounts();
}

function renderCart() {
  els.cartList.innerHTML = "";
  if (!cart.length) {
    els.cartList.innerHTML = '<div class="empty-state">Количката е празна.</div>';
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-top">
        <div>
          <div><strong>${item.name}</strong></div>
          <div class="cart-sub">Размер: ${item.size} · Цвят: ${item.color}</div>
        </div>
        <div><strong>${formatPrice(item.price * item.qty)}</strong></div>
      </div>
      <div class="cart-controls">
        <button>-</button>
        <span>${item.qty}</span>
        <button>+</button>
      </div>
    `;
    const [minusBtn, plusBtn] = div.querySelectorAll("button");
    minusBtn.onclick = () => updateCartQty(item.productId, item.size, item.color, -1);
    plusBtn.onclick = () => updateCartQty(item.productId, item.size, item.color, 1);
    els.cartList.appendChild(div);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length ? 10 : 0;
  const total = subtotal + shipping;
  els.subtotal.textContent = `${subtotal} лв`;
  els.shipping.textContent = `${shipping} лв`;
  els.total.textContent = `${total} лв`;
}

function updateCartQty(productId, size, color, delta) {
  cart = cart
    .map((item) => item.productId === productId && item.size === size && item.color === color
      ? { ...item, qty: Math.max(0, item.qty + delta) }
      : item)
    .filter((item) => item.qty > 0);
  renderCart();
  updateCounts();
}

function placeOrder() {
  const name = els.nameInput.value.trim();
  const phone = els.phoneInput.value.trim();
  const address = els.addressInput.value.trim();
  const city = els.cityInput.value.trim();
  if (!name || !phone || !address || !city) {
    alert("Попълни име, телефон, адрес и град.");
    return;
  }
  if (!cart.length) {
    alert("Количката е празна.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + 10;
  const orderId = `COD-${Date.now()}`;
  els.successBox.classList.remove("hidden");
  els.successBox.innerHTML = `
    <strong>Поръчката е приета</strong>
    <p style="margin-top:8px;color:rgba(255,255,255,.62)">Номер: ${orderId}<br>Метод: Наложен платеж<br>Общо: ${formatPrice(total)}<br>Ще се свържем с вас за потвърждение.</p>
  `;

  cart = [];
  renderCart();
  updateCounts();
  els.nameInput.value = "";
  els.phoneInput.value = "";
  els.emailInput.value = "";
  els.addressInput.value = "";
  els.cityInput.value = "";
  els.zipInput.value = "";
  els.notesInput.value = "";
}

function renderAll() {
  renderCategories();
  renderProducts();
  renderActiveProduct();
  renderCart();
  updateCounts();
}

els.searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
  updateCounts();
});
els.qtyMinus.onclick = () => { quantity = Math.max(1, quantity - 1); renderActiveProduct(); };
els.qtyPlus.onclick = () => { quantity += 1; renderActiveProduct(); };
els.addToCartBtn.onclick = addToCart;
els.orderBtn.onclick = placeOrder;

renderAll();
