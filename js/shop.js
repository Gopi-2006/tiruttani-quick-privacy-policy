/**
 * Tiruttani Quick — Shop Catalog & Cart Manager
 */

// Core Sample Products representing actual catalog schemas for instant render fallback
const SEED_PRODUCTS = [
  {
    id: "prod_1",
    name: "Aashirvaad Shuddh Chakki Atta",
    nameTamil: "ஆசீர்வாத் கோதுமை மாவு",
    price: 275,
    mrp: 310,
    unit: "5 kg",
    categoryId: "groceries",
    categoryName: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 45,
    isActive: true
  },
  {
    id: "prod_2",
    name: "Fortune Sunlite Sunflower Oil",
    nameTamil: "ஃபார்ச்சூன் சூரியகாந்தி எண்ணெய்",
    price: 135,
    mrp: 155,
    unit: "1 L",
    categoryId: "groceries",
    categoryName: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 30,
    isActive: true
  },
  {
    id: "prod_3",
    name: "Fresh Local Tomatoes (Thakkali)",
    nameTamil: "நல் தக்காளி",
    price: 24,
    mrp: 35,
    unit: "1 kg",
    categoryId: "daily-needs",
    categoryName: "Daily Needs",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 60,
    isActive: true
  },
  {
    id: "prod_4",
    name: "Tiruttani Fresh Farm Milk",
    nameTamil: "பஞ்சமிர்த பால்",
    price: 28,
    mrp: 30,
    unit: "500 ml",
    categoryId: "daily-needs",
    categoryName: "Daily Needs",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 100,
    isActive: true
  },
  {
    id: "prod_5",
    name: "Surf Excel Easy Wash Powder",
    nameTamil: "சர்ஃப் எக்செல் துவைக்கும் தூள்",
    price: 140,
    mrp: 160,
    unit: "1 kg",
    categoryId: "household",
    categoryName: "Household Essentials",
    imageUrl: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 25,
    isActive: true
  },
  {
    id: "prod_6",
    name: "Dettol Antiseptic Disinfectant Liquid",
    nameTamil: "டெட்டால் ஆண்டிசெப்டிக் லிக்விட்",
    price: 115,
    mrp: 130,
    unit: "250 ml",
    categoryId: "personal-care",
    categoryName: "Personal Care",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 18,
    isActive: true
  },
  {
    id: "prod_7",
    name: "Tata Salt Vacuum Evaporated",
    nameTamil: "டாடா உப்பு",
    price: 28,
    mrp: 30,
    unit: "1 kg",
    categoryId: "groceries",
    categoryName: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1626197031507-c170a0456481?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 80,
    isActive: true
  },
  {
    id: "prod_8",
    name: "Britannia Marie Gold Biscuits",
    nameTamil: "பிரிட்டானியா மேரி கோல்டு",
    price: 35,
    mrp: 40,
    unit: "300 g",
    categoryId: "daily-needs",
    categoryName: "Daily Needs",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80",
    stockQuantity: 50,
    isActive: true
  }
];

const SEED_CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛒" },
  { id: "groceries", name: "Groceries", icon: "🌾" },
  { id: "daily-needs", name: "Daily Needs", icon: "🥛" },
  { id: "household", name: "Household Essentials", icon: "🧹" },
  { id: "personal-care", name: "Personal Care", icon: "🧴" }
];

let selectedCategory = "all";
let searchQuery = "";
let loadedProducts = [...SEED_PRODUCTS];
let loadedCategories = [...SEED_CATEGORIES];

document.addEventListener('DOMContentLoaded', () => {
  initShopPage();
});

function initShopPage() {
  renderCategoryPills();
  renderProductsGrid();
  updateCartDrawerUI();
  setupShopEventListeners();
  fetchFirestoreData();
}

/**
 * Fetches Categories & Products from Firestore
 */
function fetchFirestoreData() {
  if (typeof firebase === 'undefined' || !window.db) {
    console.log("Using seed product catalog fallback.");
    return;
  }

  // Fetch Categories
  window.db.collection('categories').orderBy('sortOrder', 'asc').get().then(snapshot => {
    if (!snapshot.empty) {
      const dbCategories = [{ id: "all", name: "All Products", icon: "🛒" }];
      snapshot.forEach(doc => {
        const data = doc.data();
        dbCategories.push({
          id: doc.id,
          name: data.name || doc.id,
          icon: data.icon || "🛒"
        });
      });
      loadedCategories = dbCategories;
      renderCategoryPills();
    }
  }).catch(err => console.warn("Firestore categories fetch notice:", err));

  // Fetch Active Products
  window.db.collection('products').where('isActive', '==', true).limit(100).get().then(snapshot => {
    if (!snapshot.empty) {
      const dbProducts = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        dbProducts.push({
          id: doc.id,
          name: data.productName || data.name || "Grocery Item",
          nameTamil: data.productNameTamil || data.nameTamil || "",
          price: Number(data.sellingPrice || data.price || 0),
          mrp: Number(data.mrp || data.sellingPrice || data.price || 0),
          unit: data.unit || "",
          categoryId: data.category || data.categoryId || "groceries",
          categoryName: data.category || "Groceries",
          imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
          stockQuantity: Number(data.stockQuantity || 0),
          isActive: data.isActive ?? true
        });
      });
      loadedProducts = dbProducts;
      renderProductsGrid();
    }
  }).catch(err => console.warn("Firestore products fetch notice:", err));
}

/**
 * Render Category Filter Pills
 */
function renderCategoryPills() {
  const container = document.getElementById('categoryPillsContainer');
  if (!container) return;

  container.innerHTML = loadedCategories.map(cat => `
    <button class="category-pill ${cat.id === selectedCategory ? 'active' : ''}" data-cat-id="${cat.id}">
      <span>${cat.icon || ''}</span> ${cat.name}
    </button>
  `).join('');

  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-cat-id');
      renderCategoryPills();
      renderProductsGrid();
    });
  });
}

/**
 * Render Products Grid with Search & Category Filtering
 */
function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = loadedProducts.filter(product => {
    const matchesCat = selectedCategory === "all" || product.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameTamil.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
        <h3 style="font-size: 22px; margin-bottom: 8px;">No Products Found</h3>
        <p style="color: var(--text-muted);">Try adjusting your search query or selecting another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const hasDiscount = product.mrp > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
    const isOut = product.stockQuantity <= 0;

    return `
      <div class="product-card">
        ${hasDiscount ? `<span class="product-badge-discount">SAVE ${discountPercent}%</span>` : ''}
        <div class="product-image-box">
          <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'">
        </div>
        <div class="product-category-name">${product.categoryName}</div>
        <h3 class="product-name">${product.name}</h3>
        ${product.nameTamil ? `<div class="product-name-tamil">${product.nameTamil}</div>` : ''}
        <div class="product-unit">${product.unit}</div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price}</span>
          ${hasDiscount ? `<span class="product-mrp">₹${product.mrp}</span>` : ''}
        </div>
        <div class="product-card-footer">
          ${isOut ? `
            <span class="stock-badge out-of-stock">Out of Stock</span>
          ` : `
            <button class="btn btn-primary add-cart-btn" onclick="addToCart('${product.id}')">
              + Add to Cart
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Setup Event Listeners for Search
 */
function setupShopEventListeners() {
  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProductsGrid();
    });
  }
}

/**
 * Cart State Management
 */
function addToCart(productId) {
  const product = loadedProducts.find(p => p.id === productId);
  if (!product) return;

  const cart = window.TiruttaniQuickState.cart;
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartDrawerUI();
  openCartDrawer();
}

function updateCartQuantity(productId, delta) {
  const cart = window.TiruttaniQuickState.cart;
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartDrawerUI();
}

function saveCart() {
  localStorage.setItem('tq_cart', JSON.stringify(window.TiruttaniQuickState.cart));
}

/**
 * Cart Drawer UI Updates (Subtotal & Free Delivery Threshold ₹500)
 */
function updateCartDrawerUI() {
  const cart = window.TiruttaniQuickState.cart;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update floating trigger badges
  const floatingBadges = document.querySelectorAll('.cart-count-badge');
  floatingBadges.forEach(b => b.innerText = totalCount);

  // Render cart body
  const cartBody = document.getElementById('cartDrawerBody');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDeliveryFeeEl = document.getElementById('cartDeliveryFee');
  const cartGrandTotalEl = document.getElementById('cartGrandTotal');
  const freeDeliveryText = document.getElementById('freeDeliveryText');
  const freeDeliveryBar = document.getElementById('freeDeliveryProgress');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutNotice = document.getElementById('checkoutNotice');

  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 40px; margin-bottom: 12px;">🛍️</div>
        <p style="font-size: 16px; font-weight: 600;">Your cart is currently empty.</p>
        <p style="font-size: 13.5px; margin-top: 4px;">Explore groceries & essentials to add items.</p>
      </div>
    `;
  } else {
    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.imageUrl}" class="cart-item-img" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} × ${item.quantity} = <strong>₹${item.price * item.quantity}</strong></div>
        </div>
        <div class="cart-item-stepper">
          <button class="stepper-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
          <span style="font-weight: 700; font-size: 14px;">${item.quantity}</span>
          <button class="stepper-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');
  }

  // Calculate Delivery Fee (Free above ₹500, else ₹29)
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 29;
  const grandTotal = subtotal + deliveryFee;

  if (cartSubtotalEl) cartSubtotalEl.innerText = `₹${subtotal}`;
  if (cartDeliveryFeeEl) cartDeliveryFeeEl.innerText = deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`;
  if (cartGrandTotalEl) cartGrandTotalEl.innerText = `₹${grandTotal}`;

  // Free delivery threshold progress bar (₹500 target)
  if (freeDeliveryText && freeDeliveryBar) {
    if (subtotal >= 500) {
      freeDeliveryText.innerHTML = "🎉 Congratulations! You unlocked <strong>FREE Delivery</strong> in Tiruttani.";
      freeDeliveryBar.style.width = "100%";
    } else {
      const remaining = 500 - subtotal;
      const progressPercent = Math.min(100, Math.round((subtotal / 500) * 100));
      freeDeliveryText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Delivery</strong>!`;
      freeDeliveryBar.style.width = `${progressPercent}%`;
    }
  }

  // Delivery Availability Gate for Checkout
  const isDeliveryAvailable = window.TiruttaniQuickState.deliveryAvailable;

  if (checkoutBtn && checkoutNotice) {
    if (!isDeliveryAvailable) {
      checkoutBtn.disabled = true;
      checkoutBtn.innerText = "Delivery Currently Unavailable";
      checkoutNotice.style.display = "block";
      checkoutNotice.innerText = window.TiruttaniQuickState.deliveryUnavailableMessage;
    } else if (cart.length === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.innerText = "Cart is Empty";
      checkoutNotice.style.display = "none";
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.innerText = `Proceed to Order (₹${grandTotal})`;
      checkoutNotice.style.display = "none";
    }
  }
}

// Global hook called when Firestore shop availability changes
window.onDeliveryStatusChanged = function(isAvailable) {
  updateCartDrawerUI();
};

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function proceedToCheckout() {
  if (!window.TiruttaniQuickState.deliveryAvailable) {
    showToastModal("Delivery Unavailable", window.TiruttaniQuickState.deliveryUnavailableMessage);
    return;
  }
  
  showToastModal(
    "Download Customer App to Complete Order",
    "To finalize your grocery order with live tracking & delivery in Tiruttani, please download the official Tiruttani Quick Customer App on Google Play!"
  );
}
