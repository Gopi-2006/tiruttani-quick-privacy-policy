/**
 * Tiruttani Quick — Main UI Controller & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initContactForm();
  initSmoothScroll();
  highlightActivePage();
});

// Sticky Header Box Shadow on Scroll
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Drawer Navigation Toggle
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.style.display === 'block';
    drawer.style.display = isOpen ? 'none' : 'block';
  });

  // Close drawer when clicking backdrop
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      drawer.style.display = 'none';
    }
  });

  // Close drawer on window resize above 768px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      drawer.style.display = 'none';
    }
  });
}

// Highlight Current Active Page Link in Nav
function highlightActivePage() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Contact Form Handler with Validation and Visual Confirmation Modal
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      showToastModal("Missing Fields", "Please enter your name, email address, and message.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending Message...";
    }

    // Simulate sending message securely
    setTimeout(() => {
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
      }
      showToastModal(
        "Message Sent Successfully!",
        `Thank you ${name}! We have received your inquiry. Our Tiruttani support team will respond to your email (${email}) shortly.`
      );
    }, 1200);
  });
}

// Toast / Alert Modal Helper
function showToastModal(title, message) {
  let modal = document.getElementById('globalModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px auto;">
          ✓
        </div>
        <h3 id="modalTitle" style="font-size: 22px; margin-bottom: 8px;"></h3>
        <p id="modalMessage" style="color: var(--text-muted); font-size: 14.5px; margin-bottom: 24px; line-height: 1.6;"></p>
        <button class="btn btn-primary" onclick="closeToastModal()" style="width: 100%;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalMessage').innerText = message;
  modal.classList.add('active');
}

function closeToastModal() {
  const modal = document.getElementById('globalModal');
  if (modal) modal.classList.remove('active');
}

// Smooth scroll to links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
