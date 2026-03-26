
const products = [
  {
    {
  id: 1,
  name: "Marlex Limitless Tee",
  price: 15,
  image: "images/tee-front.png",
  images: [
    "images/tee-front.png",
    "images/tee-back.png"
  ],
  category: "tshirt",
  colors: ["Black"],
  sizes: ["S", "M", "L", "XL"],
  description: "LIMITLESS тениска с bold X дизайн и MARLEX.MX branding. Premium памук, удобна кройка и streetwear визия."
}
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
    longDescription: "Комбинация от комфорт, стабилност и разпознаваем силует. Подходящ модел за hero продукт на бранда с ясно streetwear позициониране.",
    colors: ["Черно", "Бяло"],
    stock: 7
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
    longDescription: "Premium плътност, soft interior и минималистичен фронтален знак за бранд усещане без излишен шум.",
    colors: ["Черно", "Сиво"],
    stock: 9
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
    longDescription: "Лек, удобен аксесоар за завършен monochrome outfit с дискретна, но силна бранд идентичност.",
    colors: ["Черно", "Бяло"],
    stock: 18
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
    longDescription: "Изградено за хладни дни, тежка материя и по-структуриран fit за по-луксозно streetwear присъствие.",
    colors: ["Черно", "Сиво", "Бяло"],
    stock: 5
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
    longDescription: "Чист front, ясен fit и лесно комбиниране с denim, cargo или layered outerwear.",
    colors: ["Черно", "Бяло"],
    stock: 14
  }
];

const categories = ["Всички", "Тениски", "Обувки", "Худита", "Аксесоари"];
const clothingSizes = ["S", "M", "L", "XL"];
const shoeSizes = ["40", "41", "42", "43", "44"];
const filterColors = ["Всички", "Черно", "Бяло", "Сиво"];
const storageKeys = {
  cart: "marlex_cart",
  wishlist: "marlex_wishlist",
  form: "marlex_checkout_form",
  newsletter: "marlex_newsletter"
};

let selectedCategory = "Всички";
let selectedFilterSize = "Всички";
let selectedFilterColor = "Всички";
let selectedMaxPrice = 189;
let searchQuery = "";
let activeProduct = products[0];
let selectedSize = "42";
let selectedColor = "Черно";
let quantity = 1;
let wishlist = loadStorage(storageKeys.wishlist, [2]);
let cart = loadStorage(storageKeys.cart, [
  { productId: 2, name: "MF Street Sneakers", price: 189, qty: 1, size: "42", color: "Черно" },
  { productId: 1, name: "MF Core Tee", price: 79, qty: 1, size: "L", color: "Бяло" }
]);

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toEur(price) {
  return price / 1.95583;
}

function formatPrice(price) {
  return `€${toEur(price).toFixed(2)} / ${price} лв`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

const els = {
  mainNav: document.getElementById("mainNav"),
  menuToggle: document.getElementById("menuToggle"),
  wishlistOpenButton: document.getElementById("wishlistOpenButton"),
  categoryBar: document.getElementById("categoryBar"),
  sizeFilterBar: document.getElementById("sizeFilterBar"),
  colorFilterBar: document.getElementById("colorFilterBar"),
  searchInput: document.getElementById("searchInput"),
  priceRange: document.getElementById("priceRange"),
  priceRangeValue: document.getElementById("priceRangeValue"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  productsGrid: document.getElementById("productsGrid"),
  productCount: document.getElementById("productCount"),
  wishlistCount: document.getElementById("wishlistCount"),
  wishlistCountHeader: document.getElementById("wishlistCountHeader"),
  cartItemCount: document.getElementById("cartItemCount"),
  cartCount: document.getElementById("cartCount"),
  cartCountButton: document.getElementById("cartCountButton"),
  cartList: document.getElementById("cartList"),
  subtotal: document.getElementById("subtotal"),
  shipping: document.getElementById("shipping"),
  total: document.getElementById("total"),
  activeName: document.getElementById("activeName"),
  activePrice: document.getElementById("activePrice"),
  activeRating: document.getElementById("activeRating"),
  activeReviews: document.getElementById("activeReviews"),
  activeDescription: document.getElementById("activeDescription"),
  activeCategory: document.getElementById("activeCategory"),
  activeCategoryText: document.getElementById("activeCategoryText"),
  activeBadge: document.getElementById("activeBadge"),
  activeStock: document.getElementById("activeStock"),
  sizeOptions: document.getElementById("sizeOptions"),
  colorOptions: document.getElementById("colorOptions"),
  qtyValue: document.getElementById("qtyValue"),
  qtyMinus: document.getElementById("qtyMinus"),
  qtyPlus: document.getElementById("qtyPlus"),
  addToCartBtn: document.getElementById("addToCartBtn"),
  selectedColorText: document.getElementById("selectedColorText"),
  selectionSummary: document.getElementById("selectionSummary"),
  nameInput: document.getElementById("nameInput"),
  phoneInput: document.getElementById("phoneInput"),
  emailInput: document.getElementById("emailInput"),
  addressInput: document.getElementById("addressInput"),
  cityInput: document.getElementById("cityInput"),
  zipInput: document.getElementById("zipInput"),
  notesInput: document.getElementById("notesInput"),
  orderBtn: document.getElementById("orderBtn"),
  copyOrderBtn: document.getElementById("copyOrderBtn"),
  successBox: document.getElementById("successBox"),
  newsletterInput: document.getElementById("newsletterInput"),
  newsletterBtn: document.getElementById("newsletterBtn"),
  newsletterMessage: document.getElementById("newsletterMessage"),
  toast: document.getElementById("toast")
};

function productMatchesSizeFilter(product) {
  if (selectedFilterSize === "Всички") return true;
  return isShoe(product)
    ? shoeSizes.includes(selectedFilterSize)
    : clothingSizes.includes(selectedFilterSize);
}

function productMatchesColorFilter(product) {
  if (selectedFilterColor === "Всички") return true;
  return product.colors.includes(selectedFilterColor);
}

function filteredProducts() {
  return products.filter((product) => {
    const matchesCategory = selectedCategory === "Всички" || product.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    const matchesPrice = product.price <= selectedMaxPrice;
    return matchesCategory && matchesSearch && matchesPrice && productMatchesSizeFilter(product) && productMatchesColorFilter(product);
  });
}

function isShoe(product) {
  return product.category === "Обувки";
}

function updateCounts() {
  const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  els.productCount.textContent = filteredProducts().length;
  els.wishlistCount.textContent = wishlist.length;
  els.wishlistCountHeader.textContent = wishlist.length;
  els.cartItemCount.textContent = cartQty;
  els.cartCount.textContent = cartQty;
}

function renderCategories() {
  els.categoryBar.innerHTML = "";
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category;
    btn.className = `chip ${selectedCategory === category ? "active" : ""}`;
    btn.onclick = () => {
      selectedCategory = category;
      renderAll();
    };
    els.categoryBar.appendChild(btn);
  });
}

function renderFilterBars() {
  const sizeFilters = ["Всички", ...clothingSizes, ...shoeSizes];
  els.sizeFilterBar.innerHTML = "";
  sizeFilters.forEach((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = size;
    btn.className = `chip ${selectedFilterSize === size ? "active" : ""}`;
    btn.onclick = () => {
      selectedFilterSize = size;
      renderAll();
    };
    els.sizeFilterBar.appendChild(btn);
  });

  els.colorFilterBar.innerHTML = "";
  filterColors.forEach((color) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = color;
    btn.className = `chip ${selectedFilterColor === color ? "active" : ""}`;
    btn.onclick = () => {
      selectedFilterColor = color;
      renderAll();
    };
    els.colorFilterBar.appendChild(btn);
  });

  els.priceRange.value = String(selectedMaxPrice);
  els.priceRangeValue.textContent = `${selectedMaxPrice} лв`;
}

function renderProducts() {
  const list = filteredProducts();
  els.productsGrid.innerHTML = "";

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const wished = wishlist.includes(product.id);

    card.innerHTML = `
      <div class="product-card-top product-media">
        <div class="product-label badge">${product.badge}</div>
        <button class="icon-btn wishlist-btn" type="button">${wished ? "♥" : "♡"}</button>
        <div class="product-visual">
          <div>
            <img src="logo.png" class="product-card-logo" alt="${product.name}">
            <div class="sub mock-sub">${product.category}</div>
          </div>
        </div>
      </div>
      <div class="product-card-body product-body">
        <div class="product-meta meta-inline">
          <span>${product.category}</span>
          <span>${product.rating.toFixed(1)} (${product.reviews})</span>
        </div>
        <div class="product-title-row title-price-row">
          <h4>${product.name}</h4>
          <div class="price-box price-align-right">
            <strong class="price">${formatPrice(product.price)}</strong>
            <div class="old-price">${formatPrice(product.oldPrice)}</div>
          </div>
        </div>
        <p class="product-desc-sm">${product.description}</p>
        <div class="product-actions">
          <button class="btn btn-light" type="button">Детайли</button>
          <button class="btn btn-dark" type="button">${wished ? "Saved" : "Save"}</button>
        </div>
      </div>
    `;

    const wishBtn = card.querySelector(".wishlist-btn");
    const detailsBtn = card.querySelector(".btn-light");
    const saveBtn = card.querySelector(".btn-dark");

    wishBtn.onclick = () => toggleWishlist(product.id);
    saveBtn.onclick = () => toggleWishlist(product.id);
    detailsBtn.onclick = () => setActiveProduct(product.id, true);

    els.productsGrid.appendChild(card);
  });

  if (!list.length) {
    els.productsGrid.innerHTML = '<div class="notice">Няма намерени продукти по зададените филтри.</div>';
  }
}

function setActiveProduct(productId, scrollToProduct = false) {
  const found = getProductById(productId);
  if (!found) return;
  activeProduct = found;
  selectedSize = isShoe(found) ? "42" : "L";
  selectedColor = found.colors[0];
  quantity = 1;
  renderActiveProduct();
  if (scrollToProduct) window.location.hash = "product";
}

function renderActiveProduct() {
  els.activeName.textContent = activeProduct.name;
  els.activePrice.textContent = formatPrice(activeProduct.price);
  els.activeRating.textContent = activeProduct.rating.toFixed(1);
  els.activeReviews.textContent = activeProduct.reviews;
  els.activeDescription.textContent = activeProduct.longDescription;
  els.activeCategory.textContent = activeProduct.category;
  els.activeCategoryText.textContent = activeProduct.category;
  els.activeBadge.textContent = activeProduct.badge;
  els.activeStock.textContent = activeProduct.stock > 0 ? `В наличност: ${activeProduct.stock} бр.` : "Изчерпан";
  els.qtyValue.textContent = quantity;
  els.selectedColorText.textContent = selectedColor;
  els.selectionSummary.innerHTML = `Premium materials, padded comfort interior и силен MF завършек. Избран размер: <strong>${selectedSize}</strong>. Избран цвят: <strong>${selectedColor}</strong>.`;

  const sizes = isShoe(activeProduct) ? shoeSizes : clothingSizes;
  els.sizeOptions.innerHTML = "";
  sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = size;
    btn.className = `option-btn chip ${selectedSize === size ? "active" : ""}`;
    btn.onclick = () => {
      selectedSize = size;
      renderActiveProduct();
    };
    els.sizeOptions.appendChild(btn);
  });

  els.colorOptions.innerHTML = "";
  activeProduct.colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = color;
    btn.className = `option-btn chip ${selectedColor === color ? "active" : ""}`;
    btn.onclick = () => {
      selectedColor = color;
      renderActiveProduct();
    };
    els.colorOptions.appendChild(btn);
  });
}

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    showToast("Премахнато от любими");
  } else {
    wishlist.push(productId);
    showToast("Добавено в любими");
  }
  saveStorage(storageKeys.wishlist, wishlist);
  renderAll();
}

function addToCart() {
  const existing = cart.find((item) => item.productId === activeProduct.id && item.size === selectedSize && item.color === selectedColor);
  if (existing) existing.qty += quantity;
  else cart.push({ productId: activeProduct.id, name: activeProduct.name, price: activeProduct.price, qty: quantity, size: selectedSize, color: selectedColor });
  saveStorage(storageKeys.cart, cart);
  renderCart();
  updateCounts();
  showToast("Продуктът е добавен в количката");
}

function renderCart() {
  els.cartList.innerHTML = "";
  if (!cart.length) {
    els.cartList.innerHTML = '<div class="notice">Количката е празна.</div>';
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "order-item cart-item";
    div.innerHTML = `
      <div class="cart-top cart-top-row">
        <div>
          <div><strong>${item.name}</strong></div>
          <div class="cart-sub small">Размер: ${item.size} · Цвят: ${item.color}</div>
        </div>
        <div><strong>${formatPrice(item.price * item.qty)}</strong></div>
      </div>
      <div class="cart-controls cart-controls-row">
        <button class="icon-btn" type="button">-</button>
        <span>${item.qty}</span>
        <button class="icon-btn" type="button">+</button>
        <button class="icon-btn remove-btn" type="button">×</button>
      </div>
    `;
    const buttons = div.querySelectorAll("button");
    buttons[0].onclick = () => updateCartQty(item.productId, item.size, item.color, -1);
    buttons[1].onclick = () => updateCartQty(item.productId, item.size, item.color, 1);
    buttons[2].onclick = () => removeCartItem(item.productId, item.size, item.color);
    els.cartList.appendChild(div);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 199 ? 0 : cart.length ? 10 : 0;
  const total = subtotal + shipping;
  els.subtotal.textContent = formatPrice(subtotal);
  els.shipping.textContent = shipping === 0 && cart.length ? "Безплатна" : formatPrice(shipping);
  els.total.textContent = formatPrice(total);
}

function updateCartQty(productId, size, color, delta) {
  cart = cart
    .map((item) => item.productId === productId && item.size === size && item.color === color ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
    .filter((item) => item.qty > 0);
  saveStorage(storageKeys.cart, cart);
  renderCart();
  updateCounts();
}

function removeCartItem(productId, size, color) {
  cart = cart.filter((item) => !(item.productId === productId && item.size === size && item.color === color));
  saveStorage(storageKeys.cart, cart);
  renderCart();
  updateCounts();
  showToast("Продуктът е премахнат");
}

function buildOrderText(orderId) {
  const form = getFormData();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 199 ? 0 : cart.length ? 10 : 0;
  const total = subtotal + shipping;
  const itemsText = cart.map((item, index) => `${index + 1}. ${item.name} | ${item.qty} бр. | ${item.size} | ${item.color} | ${item.price} лв`).join("\n");
  return [
    `Поръчка № ${orderId}`,
    `Име: ${form.name}`,
    `Телефон: ${form.phone}`,
    `Имейл: ${form.email || "-"}`,
    `Адрес: ${form.address}`,
    `Град: ${form.city}`,
    `Пощ. код: ${form.zip || "-"}`,
    `Бележка: ${form.notes || "-"}`,
    "",
    "Продукти:",
    itemsText,
    "",
    `Междинна сума: ${subtotal} лв`,
    `Доставка: ${shipping} лв`,
    `Общо: ${total} лв`,
    "Метод: Наложен платеж"
  ].join("\n");
}

function getFormData() {
  return {
    name: els.nameInput.value.trim(),
    phone: els.phoneInput.value.trim(),
    email: els.emailInput.value.trim(),
    address: els.addressInput.value.trim(),
    city: els.cityInput.value.trim(),
    zip: els.zipInput.value.trim(),
    notes: els.notesInput.value.trim()
  };
}

function persistForm() {
  saveStorage(storageKeys.form, getFormData());
}

function loadForm() {
  const form = loadStorage(storageKeys.form, null);
  if (!form) return;
  els.nameInput.value = form.name || "";
  els.phoneInput.value = form.phone || "";
  els.emailInput.value = form.email || "";
  els.addressInput.value = form.address || "";
  els.cityInput.value = form.city || "";
  els.zipInput.value = form.zip || "";
  els.notesInput.value = form.notes || "";
}

function validateForm() {
  const { name, phone, address, city } = getFormData();
  if (!name || !phone || !address || !city) {
    alert("Попълни име, телефон, адрес и град.");
    return false;
  }
  if (phone.replace(/\D/g, "").length < 9) {
    alert("Въведи валиден телефонен номер.");
    return false;
  }
  if (!cart.length) {
    alert("Количката е празна.");
    return false;
  }
  return true;
}

async function copyOrderSummary() {
  if (!validateForm()) return;
  const orderId = `COD-${Date.now()}`;
  const orderText = buildOrderText(orderId);
  try {
    await navigator.clipboard.writeText(orderText);
    showToast("Поръчката е копирана");
  } catch {
    alert(orderText);
  }
}

function placeOrder() {
  if (!validateForm()) return;

  const orderId = `COD-${Date.now()}`;
  const orderText = buildOrderText(orderId);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 199 ? 0 : cart.length ? 10 : 0;
  const total = subtotal + shipping;

  els.successBox.classList.remove("hidden");
  els.successBox.innerHTML = `
    <strong>Поръчката е приета</strong>
    <p class="success-text">
      Номер: ${orderId}<br>
      Метод: Наложен платеж<br>
      Общо: ${formatPrice(total)}<br>
      Поръчката е запазена локално и може да бъде копирана при нужда.<br>
      Ще се свържем с вас за потвърждение.
    </p>
  `;

  console.log(orderText);
  cart = [];
  saveStorage(storageKeys.cart, cart);
  renderCart();
  updateCounts();
  showToast("Поръчката е изпратена успешно");
}

function subscribeNewsletter() {
  const email = els.newsletterInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    els.newsletterMessage.textContent = "Въведи валиден имейл адрес.";
    return;
  }
  const saved = loadStorage(storageKeys.newsletter, []);
  if (!saved.includes(email)) saved.push(email);
  saveStorage(storageKeys.newsletter, saved);
  els.newsletterInput.value = "";
  els.newsletterMessage.textContent = "Успешно се записа за следващия drop.";
  showToast("Успешен запис за newsletter");
}

function openWishlistFirstItem() {
  if (!wishlist.length) {
    showToast("Нямаш запазени продукти");
    return;
  }
  setActiveProduct(wishlist[0], true);
}

function clearFilters() {
  selectedCategory = "Всички";
  selectedFilterSize = "Всички";
  selectedFilterColor = "Всички";
  selectedMaxPrice = 189;
  searchQuery = "";
  els.searchInput.value = "";
  renderAll();
}

function renderAll() {
  renderCategories();
  renderFilterBars();
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

els.priceRange.addEventListener("input", (e) => {
  selectedMaxPrice = Number(e.target.value);
  renderProducts();
  renderFilterBars();
  updateCounts();
});

els.clearFiltersBtn.onclick = clearFilters;
els.qtyMinus.onclick = () => { quantity = Math.max(1, quantity - 1); renderActiveProduct(); };
els.qtyPlus.onclick = () => { quantity += 1; renderActiveProduct(); };
els.addToCartBtn.onclick = addToCart;
els.orderBtn.onclick = placeOrder;
els.copyOrderBtn.onclick = copyOrderSummary;
els.newsletterBtn.onclick = subscribeNewsletter;
els.wishlistOpenButton.onclick = openWishlistFirstItem;
els.cartCountButton.onclick = () => { window.location.hash = "checkout"; };
els.menuToggle.onclick = () => { els.mainNav.classList.toggle("mobile-open"); };

[
  els.nameInput,
  els.phoneInput,
  els.emailInput,
  els.addressInput,
  els.cityInput,
  els.zipInput,
  els.notesInput
].forEach((input) => input.addEventListener("input", persistForm));

loadForm();
renderAll();
