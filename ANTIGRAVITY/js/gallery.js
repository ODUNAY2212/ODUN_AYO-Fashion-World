// Gallery & Lookbook Functionality
document.addEventListener('DOMContentLoaded', () => {
  setupGalleryFilters();
  setupLightbox();
});

// 1. Gallery Filter Animations
function setupGalleryFilters() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');

  if (filters.length === 0 || items.length === 0) return;

  filters.forEach(filter => {
    filter.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active filter style
      filters.forEach(f => f.classList.remove('border-luxury-gold', 'text-luxury-gold'));
      filters.forEach(f => f.classList.add('border-transparent', 'text-luxury-gray'));
      filter.classList.remove('border-transparent', 'text-luxury-gray');
      filter.classList.add('border-luxury-gold', 'text-luxury-gold');

      const selectedCategory = filter.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Simple smooth transition using opacity and scale
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

// 2. Full-Screen Image Lightbox Viewer
function setupLightbox() {
  const images = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!lightbox || images.length === 0) return;

  let currentIndex = 0;
  const imageList = Array.from(images);

  const openLightbox = (index) => {
    currentIndex = index;
    const img = imageList[currentIndex];
    const parentItem = img.closest('.gallery-item');
    const title = parentItem.querySelector('h3') ? parentItem.querySelector('h3').textContent : 'ODUN_AYO Lookbook';
    const desc = parentItem.querySelector('p') ? parentItem.querySelector('p').textContent : '';

    lightboxImg.src = img.src;
    lightboxCaption.innerHTML = `<h4 class="font-serif text-lg text-luxury-gold">${title}</h4><p class="text-xs text-luxury-gray mt-1">${desc}</p>`;
    
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.classList.add('modal-active');
  };

  const closeLightbox = () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.classList.remove('modal-active');
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % imageList.length;
    // Skip hidden images
    const parentItem = imageList[currentIndex].closest('.gallery-item');
    if (parentItem.classList.contains('hidden')) {
      nextImage();
    } else {
      openLightbox(currentIndex);
    }
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    // Skip hidden images
    const parentItem = imageList[currentIndex].closest('.gallery-item');
    if (parentItem.classList.contains('hidden')) {
      prevImage();
    } else {
      openLightbox(currentIndex);
    }
  };

  // Bind click to each image
  imageList.forEach((img, index) => {
    img.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}
