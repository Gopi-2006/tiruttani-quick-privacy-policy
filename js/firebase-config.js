/**
 * Tiruttani Quick — Firebase & Firestore Integration
 * Firebase Project ID: blinkit-grocery-c3f5d
 * Collection Path for Shop Availability: shop_settings / config
 * Collection Path for Categories: categories
 * Collection Path for Products: products
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC3NfrW8Ozq9gGRHEMp3jOWbTMCU5dcMck",
  authDomain: "blinkit-grocery-c3f5d.firebaseapp.com",
  projectId: "blinkit-grocery-c3f5d",
  storageBucket: "blinkit-grocery-c3f5d.firebasestorage.app",
  messagingSenderId: "335404099413",
  appId: "1:335404099413:web:263a2b7d815db0ae6eb1dc"
};

// Global Application State
window.TiruttaniQuickState = {
  firebaseInitialized: false,
  deliveryAvailable: true,
  deliveryUnavailableMessage: "Our shop delivery is temporarily unavailable in Tiruttani. Please check back soon!",
  categories: [],
  products: [],
  cart: JSON.parse(localStorage.getItem('tq_cart') || '[]'),
  listeners: []
};

// Initialize Firebase SDK when loaded
function initFirebase() {
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      window.db = firebase.firestore();
      window.auth = firebase.auth();
      window.TiruttaniQuickState.firebaseInitialized = true;
      console.log("🔥 Tiruttani Quick Firebase initialized successfully.");
      listenToShopSettings();
    } catch (err) {
      console.warn("Firebase initialization warning:", err);
    }
  } else {
    console.log("Firebase SDK script loading or deferred.");
  }
}

/**
 * Real-time listener for central Shop Delivery Availability
 */
function listenToShopSettings() {
  if (!window.db) return;

  try {
    window.db.collection('shop_settings').doc('config')
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          window.TiruttaniQuickState.deliveryAvailable = data.deliveryAvailable ?? true;
          window.TiruttaniQuickState.deliveryUnavailableMessage = data.deliveryUnavailableMessage || 
            "Our shop delivery is temporarily unavailable in Tiruttani. Please check back soon!";
        }
        updateGlobalDeliveryBadge();
      }, (error) => {
        console.warn("Firestore shop_settings listener error, defaulting to available:", error);
        updateGlobalDeliveryBadge();
      });
  } catch (e) {
    console.warn("Error setting up shop_settings listener:", e);
  }
}

/**
 * Updates status badge across all header and status elements on the page
 */
function updateGlobalDeliveryBadge() {
  const isAvailable = window.TiruttaniQuickState.deliveryAvailable;
  const statusElements = document.querySelectorAll('.status-pill-dynamic');

  statusElements.forEach(el => {
    if (isAvailable) {
      el.className = 'status-pill available status-pill-dynamic';
      el.innerHTML = '<span class="status-dot"></span> 🟢 Delivery Available in Tiruttani';
    } else {
      el.className = 'status-pill unavailable status-pill-dynamic';
      el.innerHTML = '<span class="status-dot"></span> 🔴 Delivery Currently Unavailable';
    }
  });

  // Notify any cart / checkout gates on the current page
  if (typeof window.onDeliveryStatusChanged === 'function') {
    window.onDeliveryStatusChanged(isAvailable);
  }
}

// Execute initialization when script runs
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initFirebase();
} else {
  document.addEventListener('DOMContentLoaded', initFirebase);
}
