document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Elements
  const themeToggle = document.getElementById('themeToggle');
  const darkIcon = document.getElementById('theme-dark-icon');
  const lightIcon = document.getElementById('theme-light-icon');
  
  // Sidebar Toggle Elements
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('appSidebar');
  
  // Search Elements
  const searchInput = document.getElementById('policySearch');
  const searchClearBtn = document.getElementById('searchClear');
  const policyCards = document.querySelectorAll('.policy-card');
  const noResultsState = document.getElementById('noResultsState');
  const navLinks = document.querySelectorAll('.nav-link');

  /* 1. Theme Management */
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      darkIcon.style.display = 'none';
      lightIcon.style.display = 'block';
    } else {
      darkIcon.style.display = 'block';
      lightIcon.style.display = 'none';
    }
  };

  // Initialize Theme (Default is dark theme as per visual prompt)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  /* 2. Mobile Sidebar Toggle Drawer */
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
          sidebar.classList.remove('open');
        }
      }
    });

    // Close sidebar on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  /* 3. Real-time Policy Searching */
  const filterPolicies = (query) => {
    const cleanQuery = query.toLowerCase().trim();
    let matchesCount = 0;

    if (cleanQuery === '') {
      if (searchClearBtn) searchClearBtn.classList.remove('visible');
      policyCards.forEach(card => card.style.display = 'block');
      if (noResultsState) noResultsState.style.display = 'none';
      return;
    }

    if (searchClearBtn) searchClearBtn.classList.add('visible');

    policyCards.forEach(card => {
      const searchKeys = card.getAttribute('data-search-keys') || '';
      const textContent = card.innerText.toLowerCase();
      
      if (searchKeys.includes(cleanQuery) || textContent.includes(cleanQuery)) {
        card.style.display = 'block';
        matchesCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsState) {
      if (matchesCount === 0) {
        noResultsState.style.display = 'block';
      } else {
        noResultsState.style.display = 'none';
      }
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterPolicies(e.target.value));
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterPolicies('');
      searchInput.focus();
    });
  }

  /* 4. Active Sidebar Navigation on Click and Scroll */
  // Active states for click navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // IntersectionObserver to highlight sidebar nav item as user scrolls
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // trigger in the upper middle area of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (correspondingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  };

  if (policyCards && policyCards.length > 0) {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    policyCards.forEach(card => observer.observe(card));
  }
});
