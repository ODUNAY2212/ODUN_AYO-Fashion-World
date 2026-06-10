// Checkout & Payment Integrations
let couponDiscount = 0;
let activeCouponCode = '';
const COUPONS = {
  'GOLD10': 0.10, // 10% Off
  'ODUNAYO': 0.15, // 15% Off
  'WELCOME50': 50 // Flat $50 Off (for orders over $200)
};

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  setupCheckoutListeners();
});

// Render Order Summary
function renderCheckoutSummary() {
  const itemsContainer = document.getElementById('checkout-items-list');
  if (!itemsContainer) return;

  const items = cartSystem.getCartItems();
  const subtotal = cartSystem.getCartTotal();

  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-8">
        <p class="text-luxury-gray text-sm mb-4">No items in your cart.</p>
        <a href="shop.html" class="inline-block px-6 py-2 bg-luxury-gold text-luxury-black font-semibold text-xs tracking-widest uppercase hover:bg-luxury-goldLight transition-colors">Go to Shop</a>
      </div>
    `;
    updateTotalsDisplay(0, 0, 0, 0);
    return;
  }

  // Generate HTML for cart items
  let html = '';
  items.forEach(item => {
    html += `
      <div class="flex items-center py-4 border-b border-luxury-border justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-16 h-20 bg-luxury-charcoal border border-luxury-border flex-shrink-0 overflow-hidden">
            <img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover">
          </div>
          <div>
            <h4 class="font-serif text-sm text-white">${item.product.name}</h4>
            <p class="text-xs text-luxury-gray mt-1">Size: ${item.size} x ${item.quantity}</p>
          </div>
        </div>
        <p class="text-sm font-semibold text-luxury-gold">$${(item.product.price * item.quantity).toLocaleString()}</p>
      </div>
    `;
  });
  itemsContainer.innerHTML = html;

  // Calculate Shipping (Free if over 500)
  const shippingRegion = document.getElementById('shipping-region') ? document.getElementById('shipping-region').value : 'national';
  let shippingCost = 15;
  if (subtotal > 500) {
    shippingCost = 0;
  } else {
    if (shippingRegion === 'local') shippingCost = 5; // Local Ibadan delivery
    else if (shippingRegion === 'international') shippingCost = 35;
  }

  // Calculate Tax (7.5% standard VAT)
  const tax = Math.round(subtotal * 0.075);

  // Apply Coupon Discount
  let discountAmount = 0;
  if (activeCouponCode && COUPONS[activeCouponCode]) {
    const value = COUPONS[activeCouponCode];
    if (value <= 1) {
      discountAmount = Math.round(subtotal * value);
    } else {
      discountAmount = subtotal > 200 ? value : 0;
    }
  }

  const grandTotal = Math.max(0, subtotal + shippingCost + tax - discountAmount);

  updateTotalsDisplay(subtotal, shippingCost, tax, discountAmount, grandTotal);
}

// Update DOM elements for totals
function updateTotalsDisplay(subtotal, shipping, tax, discount, total) {
  const elements = {
    'summary-subtotal': `$${subtotal.toLocaleString()}`,
    'summary-shipping': shipping === 0 ? 'FREE' : `$${shipping.toLocaleString()}`,
    'summary-tax': `$${tax.toLocaleString()}`,
    'summary-discount': discount > 0 ? `-$${discount.toLocaleString()}` : '$0',
    'summary-total': `$${total.toLocaleString()}`
  };

  for (const [id, value] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Update button total text if exists
  const submitBtnText = document.getElementById('submit-btn-total');
  if (submitBtnText) submitBtnText.textContent = `$${total.toLocaleString()}`;
}

// Set up event listeners
function setupCheckoutListeners() {
  // Region change listener
  const regionSelector = document.getElementById('shipping-region');
  if (regionSelector) {
    regionSelector.addEventListener('change', () => {
      renderCheckoutSummary();
    });
  }

  // Apply coupon button
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-code-input');
  const couponMsg = document.getElementById('coupon-msg');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;

      if (COUPONS[code] !== undefined) {
        activeCouponCode = code;
        couponMsg.textContent = `Coupon "${code}" applied successfully!`;
        couponMsg.className = 'text-xs text-green-500 mt-1';
        renderCheckoutSummary();
      } else {
        couponMsg.textContent = 'Invalid coupon code. Try GOLD10 or ODUNAYO.';
        couponMsg.className = 'text-xs text-red-500 mt-1';
      }
    });
  }

  // Submit checkout form
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const items = cartSystem.getCartItems();
      if (items.length === 0) {
        cartSystem.showToast('Please add items to your cart first.');
        return;
      }

      // Check form validity
      const requiredInputs = form.querySelectorAll('[required]');
      let allValid = true;
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          allValid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });

      if (!allValid) {
        cartSystem.showToast('Please fill out all required shipping fields.');
        return;
      }

      // Get selected payment method
      const paymentMethod = form.querySelector('input[name="payment_gateway"]:checked').value;
      
      // Open Payment Modal with instructions
      triggerPaymentGateway(paymentMethod);
    });
  }
}

// Payment Gateway Mock Interceptor
function triggerPaymentGateway(gateway) {
  const modal = document.getElementById('payment-modal');
  const modalLogo = document.getElementById('payment-modal-logo');
  const modalInstruction = document.getElementById('payment-modal-instruction');
  const modalTitle = document.getElementById('payment-modal-title');
  const modalRef = document.getElementById('payment-modal-ref');

  if (!modal) return;

  const total = document.getElementById('summary-total').textContent;
  const refCode = 'OA-' + Math.floor(100000 + Math.random() * 900000);

  if (modalRef) modalRef.textContent = refCode;

  // Custom logo and style details depending on Paystack or Flutterwave
  if (gateway === 'paystack') {
    modalTitle.textContent = 'Paystack Secure Checkout';
    modalLogo.innerHTML = `
      <span class="px-3 py-1 bg-[#09a5db] text-white text-xs font-semibold rounded mr-2">PAYSTACK</span>
      <span class="text-luxury-gray text-xs">Secure Payment Gateway</span>
    `;
    modalInstruction.textContent = `You are paying ${total} via Paystack. Press "Complete Payment" to simulate transaction success.`;
  } else {
    modalTitle.textContent = 'Flutterwave Secure Checkout';
    modalLogo.innerHTML = `
      <span class="px-3 py-1 bg-[#fbba15] text-luxury-black text-xs font-semibold rounded mr-2">FLUTTERWAVE</span>
      <span class="text-luxury-gray text-xs">Rave Payment Systems</span>
    `;
    modalInstruction.textContent = `You are paying ${total} via Flutterwave. Press "Complete Payment" to simulate transaction success.`;
  }

  // Display payment modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('modal-active');

  // Bind close/payment simulation buttons
  const btnClose = document.getElementById('payment-modal-close');
  const btnCancel = document.getElementById('payment-modal-cancel');
  const btnSuccess = document.getElementById('payment-modal-success');

  const closePayModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('modal-active');
  };

  if (btnClose) btnClose.onclick = closePayModal;
  if (btnCancel) btnCancel.onclick = closePayModal;
  
  if (btnSuccess) {
    btnSuccess.onclick = () => {
      closePayModal();
      showOrderSuccessScreen(refCode);
    };
  }
}

// Show final order completion screen
function showOrderSuccessScreen(ref) {
  const checkoutContainer = document.getElementById('checkout-grid-container');
  if (!checkoutContainer) return;

  // Clear cart storage and badge counts
  cartSystem.clearCart();

  const email = document.getElementById('shipping-email').value;
  const fullName = document.getElementById('shipping-first-name').value + ' ' + document.getElementById('shipping-last-name').value;
  const address = document.getElementById('shipping-address').value + ', ' + document.getElementById('shipping-city').value;
  
  checkoutContainer.innerHTML = `
    <div class="col-span-full bg-luxury-charcoal border border-luxury-gold p-8 md:p-12 text-center max-w-2xl mx-auto reveal active">
      <div class="w-20 h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold-glow-strong">
        <svg class="w-10 h-10 text-luxury-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="font-serif text-3xl text-white mb-2">Order Confirmed</h2>
      <p class="text-luxury-gold text-sm uppercase tracking-wider mb-6">Reference: ${ref}</p>
      
      <p class="text-luxury-gray text-sm leading-relaxed mb-8">
        Thank you for choosing <strong>ODUN_AYO Fashion World</strong>, ${fullName}. A luxury receipt and order tracking summary has been sent to <strong>${email}</strong>.
      </p>

      <div class="border-t border-b border-luxury-border py-4 mb-8 text-left text-xs text-luxury-gray space-y-2">
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Estimated Delivery:</strong> 3 - 5 Business Days</p>
        <p><strong>Payment Status:</strong> Authorized / Completed via Gateway</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="index.html" class="px-8 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black font-semibold text-xs tracking-widest uppercase transition-all">Back to Home</a>
        <a href="https://wa.me/2349165454646?text=Hi%20ODUN_AYO%20Fashion%20World%2C%20I%20just%20placed%20order%20${ref}%20on%20your%20website" target="_blank" class="px-8 py-3 bg-[#25D366] text-white hover:bg-green-600 font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.461 5.432.001 9.853-4.417 9.856-9.853.002-2.63-1.023-5.102-2.89-6.969C17.155 1.958 14.68 .934 12.05.934c-5.44 0-9.863 4.42-9.866 9.858-.002 1.94.502 3.834 1.464 5.441l-.986 3.601 3.69-.968zM17.65 15.65c-.29-.145-1.72-.85-1.99-.95-.27-.1-.465-.145-.66.15-.195.295-.755.95-.925 1.145-.17.195-.34.22-.63.075-.29-.145-1.225-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2-.17-.29-.015-.45.13-.595.13-.13.29-.34.435-.51.145-.17.195-.29.29-.485.095-.195.05-.37-.025-.515-.075-.15-.66-1.59-.9-2.18-.235-.57-.475-.49-.66-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.075-.79.37-.27.295-1.03.1-1.03 2.5 0 2.405 1.75 4.73 1.99 5.055.24.325 3.445 5.26 8.345 7.38 1.165.505 2.075.805 2.785 1.03 1.17.37 2.24.32 3.08.19 1.045-.155 2.185-.895 2.49-1.76.305-.865.305-1.61.215-1.76-.09-.15-.33-.24-.62-.385z"/>
          </svg>
          Notify via WhatsApp
        </a>
      </div>
    </div>
  `;

  // Scroll to top of grid
  window.scrollTo({
    top: checkoutContainer.offsetTop - 100,
    behavior: 'smooth'
  });
}
