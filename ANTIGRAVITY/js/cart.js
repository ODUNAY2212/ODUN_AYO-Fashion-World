// Global Cart & Wishlist System
class CartSystem {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('odunayo_cart')) || [];
    this.wishlist = JSON.parse(localStorage.getItem('odunayo_wishlist')) || [];
    this.init();
  }

  init() {
    // Add side-cart markup dynamically if not in DOM, but we can also rely on structured markup in HTML
    document.addEventListener('DOMContentLoaded', () => {
      this.updateUI();
      this.setupEventListeners();
    });
  }

  // Save changes to localStorage
  saveCart() {
    localStorage.setItem('odunayo_cart', JSON.stringify(this.cart));
    this.updateUI();
  }

  saveWishlist() {
    localStorage.setItem('odunayo_wishlist', JSON.stringify(this.wishlist));
    this.updateUI();
  }

  // Cart operations
  addToCart(productId, quantity = 1, size = 'Standard') {
    const existingIndex = this.cart.findIndex(item => item.productId === productId && item.size === size);
    
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({ productId, quantity, size });
    }
    
    this.saveCart();
    this.openSidebar();
    this.showToast('Item added to cart');
  }

  removeFromCart(productId, size = 'Standard') {
    this.cart = this.cart.filter(item => !(item.productId === productId && item.size === size));
    this.saveCart();
    this.showToast('Item removed from cart');
  }

  updateQuantity(productId, size = 'Standard', newQty) {
    const index = this.cart.findIndex(item => item.productId === productId && item.size === size);
    if (index > -1) {
      this.cart[index].quantity = Math.max(1, parseInt(newQty));
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Wishlist operations
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast('Removed from wishlist');
    } else {
      this.wishlist.push(productId);
      this.showToast('Added to wishlist');
    }
    this.saveWishlist();
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // Totals calculations
  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  getCartItems() {
    return this.cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    }).filter(item => item.product !== undefined);
  }

  // Sidebar Controls
  openSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
      sidebar.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
      document.body.classList.add('modal-active');
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
      sidebar.classList.add('translate-x-full');
      overlay.classList.add('hidden');
      document.body.classList.remove('modal-active');
    }
  }

  // Update UI Elements
  updateUI() {
    const count = this.getCartCount();
    const total = this.getCartTotal();

    // Update all badges
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update sidebar items
    const sidebarContainer = document.getElementById('cart-sidebar-items');
    if (sidebarContainer) {
      const items = this.getCartItems();
      if (items.length === 0) {
        sidebarContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center h-64 text-center px-4">
            <svg class="w-16 h-16 text-luxury-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <p class="text-luxury-gray text-sm">Your luxury shopping cart is empty.</p>
            <a href="shop.html" class="mt-6 px-6 py-2 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-widest uppercase hover:bg-luxury-goldLight transition-colors">Start Shopping</a>
          </div>
        `;
      } else {
        let html = '';
        items.forEach(item => {
          html += `
            <div class="flex py-6 border-b border-luxury-border gap-4">
              <div class="w-20 h-24 bg-luxury-charcoal flex-shrink-0 overflow-hidden border border-luxury-border">
                <img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between text-sm">
                    <h3 class="font-serif text-white hover:text-luxury-gold transition-colors">
                      <a href="shop.html?id=${item.product.id}">${item.product.name}</a>
                    </h3>
                    <p class="ml-4 text-luxury-gold font-medium">$${item.product.price * item.quantity}</p>
                  </div>
                  <p class="mt-1 text-xs text-luxury-gray">Size: ${item.size}</p>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <!-- Quantity controls -->
                  <div class="flex items-center border border-luxury-border">
                    <button onclick="cartSystem.updateQuantity('${item.productId}', '${item.size}', ${item.quantity - 1})" class="px-2 py-1 text-luxury-gray hover:text-white">-</button>
                    <span class="px-3 text-white">${item.quantity}</span>
                    <button onclick="cartSystem.updateQuantity('${item.productId}', '${item.size}', ${item.quantity + 1})" class="px-2 py-1 text-luxury-gray hover:text-white">+</button>
                  </div>
                  <!-- Remove -->
                  <button onclick="cartSystem.removeFromCart('${item.productId}', '${item.size}')" class="text-luxury-gold font-medium hover:text-white uppercase tracking-wider text-[10px]">Remove</button>
                </div>
              </div>
            </div>
          `;
        });
        sidebarContainer.innerHTML = html;
      }
    }

    // Update sidebar subtotal
    const sidebarTotal = document.getElementById('cart-sidebar-subtotal');
    if (sidebarTotal) {
      sidebarTotal.textContent = `$${total.toLocaleString()}`;
    }

    // Update cart page details (if we are on checkout or page containing it)
    if (typeof renderCheckoutSummary === 'function') {
      renderCheckoutSummary();
    }
  }

  // Setup generic listeners
  setupEventListeners() {
    // Open cart buttons
    document.querySelectorAll('.btn-cart-open').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSidebar();
      });
    });

    // Close cart button
    const btnClose = document.getElementById('btn-cart-close');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeSidebar());
    }

    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeSidebar());
    }
  }

  // Custom visual toast notifier
  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-luxury-charcoal text-white border border-luxury-gold px-4 py-3 shadow-lg flex items-center gap-2 transform translate-y-5 opacity-0 transition-all duration-300 pointer-events-auto';
    toast.innerHTML = `
      <svg class="w-5 h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="text-xs uppercase tracking-wider font-semibold">${message}</span>
    `;

    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-y-5', 'opacity-0');
    }, 50);

    // Remove toast
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-10px]');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// Instantiate Global Cart
const cartSystem = new CartSystem();
window.cartSystem = cartSystem; // Expose globally
