const products = [
  {
    id: 1,
    slug: "marlex-tee",
    name: "Marlex Tee",
    category: "Тениски",
    price: 15,
    oldPrice: 25,
    badge: "Drop 01",
    rating: 5.0,
    reviews: 8,
    description: "Първата тениска на Marlex с clean front, bold гръб и premium streetwear визия.",
    longDescription:
      "Marlex Tee е първият drop на бранда — черна тениска с clean front дизайн, силен back print и удобен fit за ежедневен streetwear стил.",
    colors: ["Черно"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "01ca5580-cdf8-4b60-a76c-24fb9c27b7ed.png",
      "5f3a1e45-5669-4421-b30d-b306df771054.png"
    ]
  },
  {
    id: 2,
    slug: "marlex-hoodie",
    name: "Marlex Hoodie",
    category: "Худита",
    price: 25,
    oldPrice: 50,
    badge: "New",
    rating: 4.9,
    reviews: 6,
    description: "Плътно худи с clean визия и streetwear fit.",
    longDescription:
      "Marlex Hoodie е минималистично худи с premium усещане, удобна кройка и силно streetwear присъствие.",
    colors: ["Бяло"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "39a73b9d-1001-490d-9205-d19525f2f4c6.png",
      "ba3849d3-c1fa-47ea-9a77-05bb76b984df.png"
    ]
  },
   {
    id: 3,
    slug: "marlex-hoodie",
    name: "Marlex Hoodie",
    category: "Худита",
    price: 25,
    oldPrice: 50,
    badge: "New",
    rating: 4.9,
    reviews: 4,
    description: "Плътно худи с clean визия и streetwear fit.",
    longDescription:
      "Marlex Hoodie е минималистично худи с premium усещане, удобна кройка и силно streetwear присъствие.",
    colors: ["Черно"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "162a4dee-b137-4f1b-a78a-79383799a5c8.png",
      "98b51e07-a957-4c22-bd47-0c9f0e0c84e1.png"
    ]
  }
];

const categories = ["Всички", "Тениски", "Худита"];
const clothingSizes = ["S", "M", "L", "XL"];
const fallbackColors = ["Черно", "Бяло", "Сиво"];
const EUR_TO_BGN = 1.95583;

let selectedCategory = "Всички";
let searchQuery = "";
let activeProduct = products[0];
let selectedSize = "M";
let selectedColor = "Черно";
let quantity = 1;

const storedWishlist = JSON.parse(localStorage.getItem("marlexWishlist") || "[]");
const storedCart = JSON.parse(localStorage.getItem("marlexCart") || "[]");

let wishlist = Array.isArray(storedWishlist) ? storedWishlist : [];
let cart = Array.isArray(storedCart) ? storedCart : [];

function saveState() {
  localStorage.setItem("marlexWishlist", JSON.stringify(wishlist));
  localStorage.setItem("marlexCart", JSON.stringify(cart));
}

function toBgn(price) {
  return Number(price) * EUR_TO_BGN;
}

function formatPrice(price) {
  const eur = Number(price) || 0;
  return `€${eur.toFixed(2)} / ${toBgn(eur).toFixed(2)} лв`;
}

function getEls() {
  return {
    categoryBar: document.getElementById("categoryBar"),
    searchInput: document.getElementById("searchInput"),
    productsGrid: document.getElementById("productsGrid"),
    productCount: document.getElementById("productCount"),
    wishlistCount: document.getElementById("wishlistCount"),
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
    successBox: document.getElementById("successBox"),
    activeMainImage: document.getElementById("activeMainImage"),
    activeThumbs: document.getElementById("activeThumbs")
  };
}

function filteredProducts() {
  return products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Всички" || product.category === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();

    return matchesCategory && haystack.includes(q);
  });
}

function updateCounts(els) {
  if (els.productCount) {
    els.productCount.textContent = String(filteredProducts().length);
  }
  if (els.wishlistCount) {
    els.wishlistCount.textContent = String(wishlist.length);
  }
  if (els.cartItemCount) {
    els.cartItemCount.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));
  }
  if (els.cartCount) {
    els.cartCount.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));
  }
}

function renderCategories(els) {
  if (!els.categoryBar) return;

  els.categoryBar.innerHTML = "";

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category;
    btn.className = `chip ${selectedCategory === category ? "active" : ""}`;

    btn.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories(els);
      renderProducts(els);
      updateCounts(els);
    });

    els.categoryBar.appendChild(btn);
  });
}

function renderProducts(els) {
  if (!els.productsGrid) return;

  const list = filteredProducts();
  els.productsGrid.innerHTML = "";

  if (!list.length) {
    els.productsGrid.innerHTML = '<div class="notice">Няма намерени продукти.</div>';
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const wished = wishlist.includes(product.id);
    const primaryImage = product.images && product.images.length ? product.images[0] : null;

    card.innerHTML = `
      <div class="product-card-top product-media">
        <div class="product-label badge">${product.badge}</div>
        <button class="icon-btn wishlist-btn" type="button" aria-label="Запази">
          ${wished ? "♥" : "♡"}
        </button>
        <div class="product-visual product-card-visual">
          ${
            primaryImage
              ? `<img src="${primaryImage}" alt="${product.name}" class="product-card-image">`
              : `<div><div class="mark">MF</div><div class="sub mock-sub">${product.category}</div></div>`
          }
        </div>
      </div>

      <div class="product-card-body product-body">
        <div class="product-meta" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;font-size:12px;color:rgba(255,255,255,.6)">
          <span>${product.category}</span>
          <span>${product.rating.toFixed(1)} (${product.reviews})</span>
        </div>

        <div class="product-title-row" style="display:flex;justify-content:space-between;gap:14px;align-items:start;">
          <h4>${product.name}</h4>
          <div class="price-box" style="text-align:right;">
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
    const actionButtons = card.querySelectorAll(".product-actions .btn");
    const detailsBtn = actionButtons[0];
    const saveBtn = actionButtons[1];

    const openDetails = () => {
      activeProduct = product;
      selectedSize = (product.sizes && product.sizes[0]) || "M";
      selectedColor = (product.colors && product.colors[0]) || "Черно";
      quantity = 1;
      renderActiveProduct(els);

      const productSection = document.getElementById("product");
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    detailsBtn.addEventListener("click", openDetails);
    wishBtn.addEventListener("click", () => toggleWishlist(product.id, els));
    saveBtn.addEventListener("click", () => toggleWishlist(product.id, els));

    els.productsGrid.appendChild(card);
  });
}

function renderActiveProduct(els) {
  if (!els.activeName) return;

  els.activeName.textContent = activeProduct.name;
  els.activePrice.textContent = formatPrice(activeProduct.price);
  els.activeRating.textContent = activeProduct.rating.toFixed(1);
  els.activeReviews.textContent = String(activeProduct.reviews);
  els.activeDescription.textContent = activeProduct.longDescription || activeProduct.description;
  els.qtyValue.textContent = String(quantity);

  if (els.selectedColorText) {
    els.selectedColorText.textContent = selectedColor;
  }

  const sizes = activeProduct.sizes || clothingSizes;
  els.sizeOptions.innerHTML = "";

  sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = size;
    btn.className = `option-btn chip ${selectedSize === size ? "active" : ""}`;

    btn.addEventListener("click", () => {
      selectedSize = size;
      renderActiveProduct(els);
    });

    els.sizeOptions.appendChild(btn);
  });

  const colors = activeProduct.colors || fallbackColors;
  els.colorOptions.innerHTML = "";

  colors.forEach((color) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = color;
    btn.className = `option-btn chip ${selectedColor === color ? "active" : ""}`;

    btn.addEventListener("click", () => {
      selectedColor = color;
      renderActiveProduct(els);
    });

    els.colorOptions.appendChild(btn);
  });

  renderProductImages(els);
}

function renderProductImages(els) {
  if (!els.activeMainImage || !els.activeThumbs) return;

  const images = activeProduct.images || [];
  els.activeThumbs.innerHTML = "";

  if (!images.length) return;

  els.activeMainImage.src = images[0];
  els.activeMainImage.alt = activeProduct.name;

  images.forEach((image, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `thumb thumb-btn ${index === 0 ? "active" : ""}`;
    btn.textContent = index === 0 ? "Front" : index === 1 ? "Back" : `View ${index + 1}`;

    btn.addEventListener("click", () => {
      els.activeMainImage.src = image;
      els.activeMainImage.alt = activeProduct.name;

      const allThumbs = els.activeThumbs.querySelectorAll(".thumb-btn");
      allThumbs.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });

    els.activeThumbs.appendChild(btn);
  });
}

function toggleWishlist(productId, els) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
  } else {
    wishlist.push(productId);
  }

  saveState();
  renderProducts(els);
  updateCounts(els);
}

function addToCart(els) {
  const existing = cart.find(
    (item) =>
      item.productId === activeProduct.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      productId: activeProduct.id,
      name: activeProduct.name,
      price: activeProduct.price,
      qty: quantity,
      size: selectedSize,
      color: selectedColor
    });
  }

  saveState();
  renderCart(els);
  updateCounts(els);
}

function renderCart(els) {
  if (!els.cartList) return;

  els.cartList.innerHTML = "";

  if (!cart.length) {
    els.cartList.innerHTML = '<div class="notice">Количката е празна.</div>';
  } else {
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.className = "order-item cart-item";

      div.innerHTML = `
        <div class="cart-top" style="display:flex;justify-content:space-between;gap:16px;align-items:start;">
          <div>
            <div><strong>${item.name}</strong></div>
            <div class="cart-sub small">Размер: ${item.size} · Цвят: ${item.color}</div>
          </div>
          <div><strong>${formatPrice(item.price * item.qty)}</strong></div>
        </div>

        <div class="cart-controls" style="display:flex;gap:10px;align-items:center;margin-top:12px;">
          <button class="icon-btn" type="button">-</button>
          <span>${item.qty}</span>
          <button class="icon-btn" type="button">+</button>
          <button class="icon-btn remove-btn" type="button">✕</button>
        </div>
      `;

      const buttons = div.querySelectorAll("button");
      buttons[0].addEventListener("click", () =>
        updateCartQty(item.productId, item.size, item.color, -1, els)
      );
      buttons[1].addEventListener("click", () =>
        updateCartQty(item.productId, item.size, item.color, 1, els)
      );
      buttons[2].addEventListener("click", () =>
        removeFromCart(item.productId, item.size, item.color, els)
      );

      els.cartList.appendChild(div);
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length ? 5 : 0;
  const total = subtotal + shipping;

  els.subtotal.textContent = formatPrice(subtotal);
  els.shipping.textContent = formatPrice(shipping);
  els.total.textContent = formatPrice(total);
}

function updateCartQty(productId, size, color, delta, els) {
  cart = cart
    .map((item) => {
      if (
        item.productId === productId &&
        item.size === size &&
        item.color === color
      ) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    })
    .filter((item) => item.qty > 0);

  saveState();
  renderCart(els);
  updateCounts(els);
}

function removeFromCart(productId, size, color, els) {
  cart = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.size === size &&
        item.color === color
      )
  );

  saveState();
  renderCart(els);
  updateCounts(els);
}

function placeOrder(els) {
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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + 5;
  const orderId = `COD-${Date.now()}`;

  els.successBox.classList.remove("hidden");
  els.successBox.innerHTML = `
    <strong>Поръчката е приета</strong>
    <p style="margin-top:8px;color:rgba(255,255,255,.62)">
      Номер: ${orderId}<br>
      Метод: Наложен платеж<br>
      Общо: ${formatPrice(total)}<br>
      Ще се свържем с вас за потвърждение.
    </p>
  `;

  cart = [];
  saveState();
  renderCart(els);
  updateCounts(els);

  els.nameInput.value = "";
  els.phoneInput.value = "";
  els.emailInput.value = "";
  els.addressInput.value = "";
  els.cityInput.value = "";
  els.zipInput.value = "";
  els.notesInput.value = "";

  const checkout = document.getElementById("checkout");
  if (checkout) {
    checkout.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function init() {
  const els = getEls();

  if (els.searchInput) {
    els.searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts(els);
      updateCounts(els);
    });
  }

  if (els.qtyMinus) {
    els.qtyMinus.addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      renderActiveProduct(els);
    });
  }

  if (els.qtyPlus) {
    els.qtyPlus.addEventListener("click", () => {
      quantity += 1;
      renderActiveProduct(els);
    });
  }

  if (els.addToCartBtn) {
    els.addToCartBtn.addEventListener("click", () => addToCart(els));
  }

  if (els.orderBtn) {
    els.orderBtn.addEventListener("click", () => placeOrder(els));
  }

  if (els.cartCountButton) {
    els.cartCountButton.addEventListener("click", () => {
      const checkout = document.getElementById("checkout");
      if (checkout) {
        checkout.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  renderCategories(els);
  renderProducts(els);
  renderActiveProduct(els);
  renderCart(els);
  updateCounts(els);
}

document.addEventListener("DOMContentLoaded", init);
