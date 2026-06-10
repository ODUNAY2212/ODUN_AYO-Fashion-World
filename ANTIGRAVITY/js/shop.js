// Shop Page Core Logic
const itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [...products];
let activeCategory = 'all';
let searchQuery = '';
let activeSort = 'featured';
let showOnlyWishlist = false;

document.addEventListener('DOMContentLoaded', () => {
  parseURLParameters();
  setupFilterListeners();
  renderShop();
});

// Parse query params (e.g. category, search, product id, wishlist)
function parseURLParameters() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('category')) {
    activeCategory = params.get('category');
    // Set active class on the filters sidebar
    const filterBtn = document.querySelector(`.category-filter-btn[data-category="${activeCategory}"]`);
    if (filterBtn) selectCategoryEl(filterBtn);
  }

  if (params.has('wishlist')) {
    showOnlyWishlist = params.get('wishlist') === 'true';
    const wishBanner = document.getElementById('wishlist-indicator-banner');
    if (wishBanner && showOnlyWishlist) {
      wishBanner.classList.remove('hidden');
    }
  }

  // Handle deep-linking to specific product Quick View
  if (params.has('id')) {
    const productId = params.get('id');
    const product = products.find(p => p.id === productId);
    if (product) {
      // Delay slightly to allow DOM initialization
      setTimeout(() => {
        openQuickView(productId);
      }, 300);
    }
  }
}

// Setup Event Listeners
function setupFilterListeners() {
  // Search bar
  const searchInput = document.getElementById('shop-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      applyFilters();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('shop-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      applyFilters();
    });
  }

  // Category filters
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectCategoryEl(btn);
      activeCategory = btn.getAttribute('data-category');
      showOnlyWishlist = false;
      
      const wishBanner = document.getElementById('wishlist-indicator-banner');
      if (wishBanner) wishBanner.classList.add('hidden');

      currentPage = 1;
      applyFilters();
    });
  });
}

function selectCategoryEl(activeEl) {
  document.querySelectorAll('.category-filter-btn').forEach(b => {
    b.classList.remove('text-luxury-gold', 'border-luxury-gold');
    b.classList.add('text-luxury-gray', 'border-transparent');
  });
  activeEl.classList.remove('text-luxury-gray', 'border-transparent');
  activeEl.classList.add('text-luxury-gold', 'border-luxury-gold');
}

// Clear Wishlist filter banner
function disableWishlistFilter() {
  showOnlyWishlist = false;
  const wishBanner = document.getElementById('wishlist-indicator-banner');
  if (wishBanner) wishBanner.classList.add('hidden');
  applyFilters();
}

// Filter, Sort, and Paginate Products
function applyFilters() {
  filteredProducts = products.filter(product => {
    // Category match
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    
    // Search match
    const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                          product.description.toLowerCase().includes(searchQuery) ||
                          product.category.toLowerCase().includes(searchQuery);
    
    // Wishlist match
    const matchesWishlist = !showOnlyWishlist || cartSystem.isInWishlist(product.id);

    return matchesCategory && matchesSearch && matchesWishlist;
  });

  // Apply Sorting
  if (activeSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (activeSort === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default featured: keep database order or ID order
    filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
  }

  renderShop();
}

// Render Products Grid & Pagination
function renderShop() {
  const container = document.getElementById('products-grid-hook');
  const countDisplay = document.getElementById('products-count');
  
  if (!container) return;

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filteredProducts.length} luxurious items`;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <svg class="w-16 h-16 text-luxury-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-luxury-gray text-sm">No items found matching your filters.</p>
        <button onclick="resetAllFilters()" class="mt-6 px-6 py-2 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-widest uppercase hover:bg-luxury-goldLight transition-colors">Reset Filters</button>
      </div>
    `;
    renderPagination(0);
    return;
  }

  // Calculate pages
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Safe boundaries for currentPage
  currentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const visibleProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate HTML for products
  let html = '';
  visibleProducts.forEach((product, idx) => {
    const isWished = cartSystem.isInWishlist(product.id);
    const wishIconClass = isWished ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-gray hover:text-luxury-gold';
    
    html += `
      <div class="group border border-luxury-border bg-luxury-black p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-gold-glow reveal active">
        <div>
          <div class="product-card-img-container overflow-hidden h-80 w-full bg-luxury-charcoal mb-4 relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            
            <!-- Quick View Hover Overlay -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <button onclick="openQuickView('${product.id}')" class="px-6 py-2 border border-luxury-gold bg-luxury-black text-luxury-gold font-semibold text-xs tracking-widest uppercase hover:bg-luxury-gold hover:text-luxury-black transition-all">Quick View</button>
            </div>
            
            <!-- Wishlist Button -->
            <button onclick="toggleWishlistShop('${product.id}', this)" class="absolute top-3 right-3 p-2 bg-luxury-black/80 rounded-full text-white border border-luxury-border hover:border-luxury-gold transition-all" title="Toggle Wishlist">
              <svg class="w-4 h-4 ${wishIconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          <p class="text-[10px] text-luxury-gray tracking-wider uppercase mb-1">${product.category}</p>
          <h3 class="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors mb-2">
            <a href="#" onclick="openQuickView('${product.id}'); return false;">${product.name}</a>
          </h3>
          <div class="flex items-center text-xs text-luxury-gold mb-4">
            <span>${renderStars(product.rating)}</span>
            <span class="text-luxury-gray ml-2 text-[10px]">(${product.rating})</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-white">$${product.price.toLocaleString()}</span>
          <button onclick="cartSystem.addToCart('${product.id}', 1, 'Standard')" class="text-xs text-luxury-gold uppercase tracking-wider font-semibold hover:text-white transition-colors">Add to Cart</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  renderPagination(totalPages);
}

// Helper to render rating stars
function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars += '&#9733;';
    else if (i === fullStars && rating % 1 >= 0.5) stars += '&#9733;'; // Simple half representation
    else stars += '&#9734;';
  }
  return stars;
}

// Render Pagination Switchers
function renderPagination(totalPages) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  // Prev button
  html += `
    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="w-10 h-10 border border-luxury-border flex items-center justify-center text-luxury-gray hover:text-white hover:border-luxury-gold disabled:opacity-40 disabled:hover:text-luxury-gray disabled:hover:border-luxury-border transition-colors">
      &larr;
    </button>
  `;

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    html += `
      <button onclick="changePage(${i})" class="w-10 h-10 border ${isActive ? 'border-luxury-gold text-luxury-gold font-semibold' : 'border-luxury-border text-luxury-gray'} flex items-center justify-center hover:text-luxury-gold hover:border-luxury-gold transition-colors">
        ${i}
      </button>
    `;
  }

  // Next button
  html += `
    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="w-10 h-10 border border-luxury-border flex items-center justify-center text-luxury-gray hover:text-white hover:border-luxury-gold disabled:opacity-40 disabled:hover:text-luxury-gray disabled:hover:border-luxury-border transition-colors">
      &rarr;
    </button>
  `;

  container.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderShop();
  // Scroll up gently to the product section
  const section = document.getElementById('shop-section');
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 120,
      behavior: 'smooth'
    });
  }
}

// Reset filters to default
function resetAllFilters() {
  document.getElementById('shop-search').value = '';
  document.getElementById('shop-sort').value = 'featured';
  
  searchQuery = '';
  activeSort = 'featured';
  activeCategory = 'all';
  showOnlyWishlist = false;

  const firstBtn = document.querySelector('.category-filter-btn[data-category="all"]');
  if (firstBtn) selectCategoryEl(firstBtn);

  const wishBanner = document.getElementById('wishlist-indicator-banner');
  if (wishBanner) wishBanner.classList.add('hidden');

  currentPage = 1;
  applyFilters();
}

// Wishlist interaction on shop page
function toggleWishlistShop(productId, el) {
  cartSystem.toggleWishlist(productId);
  const svg = el.querySelector('svg');
  if (cartSystem.isInWishlist(productId)) {
    svg.className.baseVal = 'w-4 h-4 fill-luxury-gold text-luxury-gold';
  } else {
    svg.className.baseVal = 'w-4 h-4 text-luxury-gray hover:text-luxury-gold';
  }

  // If we are currently displaying wishlist only, re-apply filter to hide the removed item immediately
  if (showOnlyWishlist) {
    applyFilters();
  }
}

// QUICK VIEW MODAL CONTROLLER
let selectedProductId = '';
function openQuickView(productId) {
  selectedProductId = productId;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  if (!modal) return;

  // Set images and texts
  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-category').textContent = product.category;
  document.getElementById('modal-product-name').textContent = product.name;
  document.getElementById('modal-product-price').textContent = `$${product.price.toLocaleString()}`;
  document.getElementById('modal-product-rating-stars').innerHTML = renderStars(product.rating);
  document.getElementById('modal-product-rating-val').textContent = `(${product.rating})`;
  document.getElementById('modal-product-desc').textContent = product.description;
  
  // Reset quantity input to 1
  const qtyInput = document.getElementById('modal-qty-input');
  if (qtyInput) qtyInput.value = 1;

  // Handle sizes selector defaults
  const sizeSelector = document.getElementById('modal-size-select');
  if (sizeSelector) {
    sizeSelector.value = 'M'; // Default medium
    toggleCustomMeasurementsField();
  }

  // Set wishlist button state in modal
  const wishBtn = document.getElementById('modal-wish-btn');
  if (wishBtn) {
    const svg = wishBtn.querySelector('svg');
    if (cartSystem.isInWishlist(productId)) {
      svg.className.baseVal = 'w-5 h-5 fill-luxury-gold text-luxury-gold';
    } else {
      svg.className.baseVal = 'w-5 h-5 text-luxury-gray hover:text-luxury-gold';
    }
  }

  // Open modal visual
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('modal-active');
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('modal-active');
  }
}

// Toggle custom measurements text area if user selects 'Custom Bespoke Fitting'
function toggleCustomMeasurementsField() {
  const select = document.getElementById('modal-size-select');
  const detailsField = document.getElementById('custom-measurements-field');
  if (select && detailsField) {
    if (select.value === 'Custom') {
      detailsField.classList.remove('hidden');
    } else {
      detailsField.classList.add('hidden');
    }
  }
}

// Add to Cart from Quick View Modal
function addCurrentToCart() {
  const qty = parseInt(document.getElementById('modal-qty-input').value) || 1;
  const sizeSelect = document.getElementById('modal-size-select').value;
  let finalSize = sizeSelect;
  
  if (sizeSelect === 'Custom') {
    const details = document.getElementById('modal-custom-detail-input').value.trim();
    finalSize = details ? `Bespoke Tailoring (${details})` : 'Bespoke Tailoring (TBA)';
  }

  cartSystem.addToCart(selectedProductId, qty, finalSize);
  closeQuickView();
}

// Wishlist toggle from modal
function toggleCurrentWishlist() {
  if (!selectedProductId) return;
  cartSystem.toggleWishlist(selectedProductId);
  
  const wishBtn = document.getElementById('modal-wish-btn');
  if (wishBtn) {
    const svg = wishBtn.querySelector('svg');
    if (cartSystem.isInWishlist(selectedProductId)) {
      svg.className.baseVal = 'w-5 h-5 fill-luxury-gold text-luxury-gold';
    } else {
      svg.className.baseVal = 'w-5 h-5 text-luxury-gray hover:text-luxury-gold';
    }
  }
  
  // Sync back to main list view triggers if cards exist
  applyFilters();
}

// Reset Qty Adjustments
function changeModalQty(change) {
  const qtyInput = document.getElementById('modal-qty-input');
  if (qtyInput) {
    let currentVal = parseInt(qtyInput.value) || 1;
    qtyInput.value = Math.max(1, currentVal + change);
  }
}
