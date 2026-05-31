// Main App Logic for User Views
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    selectedItemIds: [],
    activeCategory: 'All',
    searchQuery: '',
    highlightDiffs: false,
    showOnlyDiffs: false,
    theme: localStorage.getItem('theme') || 'dark'
  };

  // DOM Elements - Navigation
  const logoBtn = document.getElementById('logo-btn');
  const navCatalogBtn = document.getElementById('nav-catalog-btn');
  const navAdminBtn = document.getElementById('nav-admin-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // DOM Elements - Sections
  const catalogSection = document.getElementById('catalog-section');
  const compareSection = document.getElementById('compare-section');
  const adminLoginSection = document.getElementById('admin-login-section');
  const adminDashboardSection = document.getElementById('admin-dashboard-section');

  // DOM Elements - Catalog
  const searchInput = document.getElementById('search-input');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const productGrid = document.getElementById('product-grid');
  const catalogEmptyState = document.getElementById('catalog-empty-state');

  // DOM Elements - Compare
  const compareBackBtn = document.getElementById('compare-back-btn');
  const toggleHighlightDiff = document.getElementById('toggle-highlight-diff');
  const toggleShowOnlyDiff = document.getElementById('toggle-show-only-diff');
  const compareTable = document.getElementById('compare-table');

  // DOM Elements - Drawer
  const compareDrawer = document.getElementById('compare-drawer');
  const compareDrawerItems = document.getElementById('compare-drawer-items');
  const compareCountText = document.getElementById('compare-count-text');
  const compareClearBtn = document.getElementById('compare-clear-btn');
  const compareSubmitBtn = document.getElementById('compare-submit-btn');

  // DOM Elements - Toast Container
  const toastContainer = document.getElementById('toast-container');

  // ==========================================
  // 1. Theme Management
  // ==========================================
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcons();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const iconMoon = themeToggleBtn.querySelector('.icon-moon');
    const iconSun = themeToggleBtn.querySelector('.icon-sun');
    if (state.theme === 'dark') {
      iconMoon.style.display = 'block';
      iconSun.style.display = 'none';
    } else {
      iconMoon.style.display = 'none';
      iconSun.style.display = 'block';
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // ==========================================
  // 2. View Switcher System
  // ==========================================
  function switchView(viewId) {
    // Remove active-view class from all sections
    const sections = [catalogSection, compareSection, adminLoginSection, adminDashboardSection];
    sections.forEach(sec => sec.classList.remove('active-view'));
    
    // Deactivate nav links
    navCatalogBtn.classList.remove('active');
    navAdminBtn.classList.remove('active');

    if (viewId === 'catalog') {
      catalogSection.classList.add('active-view');
      navCatalogBtn.classList.add('active');
      renderCatalog();
      updateCompareDrawer();
    } else if (viewId === 'compare') {
      compareSection.classList.add('active-view');
      // Hide compare drawer when looking at the table
      compareDrawer.classList.remove('open');
      renderComparisonTable();
    } else if (viewId === 'admin') {
      navAdminBtn.classList.add('active');
      // If admin is logged in (sessionStorage item present), show dashboard, else show login
      if (sessionStorage.getItem('admin_authenticated') === 'true') {
        adminDashboardSection.classList.add('active-view');
        if (window.initAdminDashboard) {
          window.initAdminDashboard();
        }
      } else {
        adminLoginSection.classList.add('active-view');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
      }
      // Hide compare drawer in admin panels
      compareDrawer.classList.remove('open');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logoBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('catalog'); });
  navCatalogBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('catalog'); });
  navAdminBtn.addEventListener('click', (e) => { e.preventDefault(); switchView('admin'); });
  compareBackBtn.addEventListener('click', () => switchView('catalog'));

  // Export view switcher to window so admin panel can use it to log out / log in
  window.switchView = switchView;

  // ==========================================
  // 3. Toast Notifications
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
    
    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate and remove after timeout
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Export toast to window for admin JS access
  window.showToast = showToast;

  // ==========================================
  // 4. Catalog Management
  // ==========================================
  function initCatalog() {
    // Load categories dynamically from items
    updateCategoryTabs();
    
    // Register search events
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderCatalog();
    });
    
    renderCatalog();
  }

  function updateCategoryTabs() {
    const items = window.AppDB.getItems();
    const categories = ['All', ...new Set(items.map(item => item.category))];
    
    categoryTabsContainer.innerHTML = '';
    categories.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = `category-tab ${state.activeCategory === cat ? 'active' : ''}`;
      tab.textContent = cat;
      tab.addEventListener('click', () => {
        state.activeCategory = cat;
        // Highlight active tab
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCatalog();
      });
      categoryTabsContainer.appendChild(tab);
    });
  }

  // Export category loading to window for admin update callbacks
  window.updateCategoryTabs = updateCategoryTabs;

  function renderCatalog() {
    const items = window.AppDB.getItems();
    const config = window.AppDB.getConfig();
    
    // Filter logic
    let filtered = items;
    
    if (state.activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === state.activeCategory);
    }
    
    if (state.searchQuery) {
      filtered = filtered.filter(item => {
        const matchesName = item.name.toLowerCase().includes(state.searchQuery);
        const matchesBrand = item.brand.toLowerCase().includes(state.searchQuery);
        const matchesDesc = item.description && item.description.toLowerCase().includes(state.searchQuery);
        
        // Search in specs values
        let matchesSpec = false;
        if (item.features) {
          matchesSpec = Object.values(item.features).some(val => 
            String(val).toLowerCase().includes(state.searchQuery)
          );
        }
        
        return matchesName || matchesBrand || matchesDesc || matchesSpec;
      });
    }
    
    // Clear catalog grid
    productGrid.innerHTML = '';
    
    if (filtered.length === 0) {
      catalogEmptyState.style.display = 'block';
      return;
    }
    
    catalogEmptyState.style.display = 'none';
    
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      const isSelected = state.selectedItemIds.includes(item.id);
      const buttonClass = isSelected ? 'compare-btn selected' : 'compare-btn';
      const buttonText = isSelected ? 'Selected' : 'Compare';
      
      // Fallback image SVG if Unsplash URL fails or empty
      const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
      
      card.innerHTML = `
        <img class="product-card-image" src="${imageUrl}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'200\\' viewBox=\\'0 0 300 200\\' style=\\'background:%23252528;fill:%23fff;font-family:sans-serif;font-size:16px;text-anchor:middle;\\'><text x=\\'150\\' y=\\'100\\'>No Image</text></svg>'">
        <span class="product-card-badge">${item.category}</span>
        <div class="product-card-brand">${item.brand}</div>
        <h3 class="product-card-title">${item.name}</h3>
        <p class="product-card-description">${item.description || 'No description provided.'}</p>
        
        <div class="product-card-footer">
          <span class="product-card-price">$${item.price.toLocaleString()}</span>
          <span class="product-card-rating">
            <svg width="14" height="14" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${Number(item.rating).toFixed(1)}</span>
          </span>
        </div>
        <button class="${buttonClass}" data-id="${item.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${isSelected 
              ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' 
              : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'}
          </svg>
          <span>${buttonText}</span>
        </button>
      `;
      
      // Wire up compare toggle click
      card.querySelector('.compare-btn').addEventListener('click', () => {
        toggleCompareSelection(item.id);
      });
      
      productGrid.appendChild(card);
    });
  }

  // Export renderCatalog globally so admin file edits trigger refresh
  window.renderCatalog = renderCatalog;

  // ==========================================
  // 5. Compare Selection & Drawer Management
  // ==========================================
  function toggleCompareSelection(itemId) {
    const config = window.AppDB.getConfig();
    const index = state.selectedItemIds.indexOf(itemId);
    
    if (index !== -1) {
      // Remove
      state.selectedItemIds.splice(index, 1);
      showToast('Product removed from the comparison list.', 'info');
    } else {
      // Add (Check Limit)
      if (state.selectedItemIds.length >= config.maxCompareItems) {
        showToast(`You reached the maximum comparison limit (${config.maxCompareItems}). Clear the list before selecting another product.`, 'danger');
        return;
      }
      state.selectedItemIds.push(itemId);
      showToast('Product added to the comparison list.', 'success');
    }
    
    renderCatalog();
    updateCompareDrawer();
  }

  function updateCompareDrawer() {
    const config = window.AppDB.getConfig();
    const items = window.AppDB.getItems();
    
    if (state.selectedItemIds.length === 0) {
      compareDrawer.classList.remove('open');
      return;
    }
    
    // Populate items
    compareDrawerItems.innerHTML = '';
    
    state.selectedItemIds.forEach(id => {
      const item = items.find(i => i.id === id);
      if (!item) return;
      
      const thumb = document.createElement('div');
      thumb.className = 'drawer-item-thumbnail';
      
      const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
      
      thumb.innerHTML = `
        <img class="drawer-item-img" src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' style=\\'background:%23252528;fill:%23fff;font-family:sans-serif;font-size:10px;text-anchor:middle;\\'><text x=\\'20\\' y=\\'25\\'>IMG</text></svg>'">
        <div class="drawer-item-info">
          <div class="drawer-item-name">${item.name}</div>
          <div class="drawer-item-price">$${item.price.toLocaleString()}</div>
        </div>
        <button class="drawer-item-remove" title="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
      
      // Wire remove button inside drawer
      thumb.querySelector('.drawer-item-remove').addEventListener('click', () => {
        toggleCompareSelection(item.id);
      });
      
      compareDrawerItems.appendChild(thumb);
    });
    
    // Update count text
    compareCountText.textContent = `${state.selectedItemIds.length} / ${config.maxCompareItems} selected`;
    
    // Enable/disable compare submit button
    compareSubmitBtn.disabled = state.selectedItemIds.length < 2;
    if (state.selectedItemIds.length < 2) {
      compareSubmitBtn.style.opacity = '0.5';
      compareSubmitBtn.style.cursor = 'not-allowed';
    } else {
      compareSubmitBtn.style.opacity = '1';
      compareSubmitBtn.style.cursor = 'pointer';
    }
    
    compareDrawer.classList.add('open');
  }

  // Clear compare drawer
  compareClearBtn.addEventListener('click', () => {
    state.selectedItemIds = [];
    renderCatalog();
    updateCompareDrawer();
    showToast('Comparison list cleared.', 'info');
  });

  // Submit compare drawer
  compareSubmitBtn.addEventListener('click', () => {
    if (state.selectedItemIds.length >= 2) {
      switchView('compare');
    }
  });

  // ==========================================
  // 6. Detailed Comparison Table Generation
  // ==========================================
  function renderComparisonTable() {
    const allItems = window.AppDB.getItems();
    const selectedItems = state.selectedItemIds.map(id => allItems.find(item => item.id === id)).filter(Boolean);
    
    if (selectedItems.length < 2) {
      switchView('catalog');
      return;
    }
    
    // 1. Gather all feature keys (union of all specification keys in selected items)
    const allFeatureKeys = new Set();
    selectedItems.forEach(item => {
      if (item.features) {
        Object.keys(item.features).forEach(key => allFeatureKeys.add(key));
      }
    });
    const featureKeysArray = Array.from(allFeatureKeys);
    
    // Find cheapest price for highlight
    const prices = selectedItems.map(item => Number(item.price)).filter(p => !isNaN(p));
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    
    // Build table HTML
    let tableHtml = '';
    
    // --- THEAD (Header row: Image, Name, Brand, Remove button) ---
    tableHtml += '<thead><tr>';
    // Top-left cell sticky corner
    tableHtml += `
      <th>
        <div style="font-weight:800; font-size:1.1rem; color:var(--accent-primary);">Features</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Comparison Table</div>
      </th>
    `;
    
    selectedItems.forEach(item => {
      const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
      tableHtml += `
        <th>
          <div class="table-header-product">
            <button class="btn-remove" data-id="${item.id}" title="Remove from comparison">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <img class="table-product-img" src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 80 80\\' style=\\'background:%23252528;fill:%23fff;font-family:sans-serif;font-size:12px;text-anchor:middle;\\'><text x=\\'40\\' y=\\'45\\'>IMG</text></svg>'">
            <span class="table-product-brand">${item.brand}</span>
            <div class="table-product-name">${item.name}</div>
          </div>
        </th>
      `;
    });
    tableHtml += '</tr></thead>';
    
    // --- TBODY ---
    tableHtml += '<tbody>';
    
    // 1. Row: Price
    const priceDiffers = selectedItems.some(item => item.price !== selectedItems[0].price);
    tableHtml += `<tr class="${priceDiffers ? 'row-different' : ''}" data-row-type="price">`;
    tableHtml += '<td>Price</td>';
    selectedItems.forEach(item => {
      const isCheapest = minPrice !== null && Number(item.price) === minPrice && selectedItems.length > 1;
      const valClass = isCheapest ? 'spec-value best-value-highlight' : 'spec-value';
      tableHtml += `<td class="${valClass}">$${item.price.toLocaleString()}</td>`;
    });
    tableHtml += '</tr>';
    
    // 2. Row: Brand
    const brandDiffers = selectedItems.some(item => item.brand !== selectedItems[0].brand);
    tableHtml += `<tr class="${brandDiffers ? 'row-different' : ''}" data-row-type="brand">`;
    tableHtml += '<td>Brand</td>';
    selectedItems.forEach(item => {
      tableHtml += `<td class="spec-value">${item.brand}</td>`;
    });
    tableHtml += '</tr>';
    
    // 3. Row: Category
    const categoryDiffers = selectedItems.some(item => item.category !== selectedItems[0].category);
    tableHtml += `<tr class="${categoryDiffers ? 'row-different' : ''}" data-row-type="category">`;
    tableHtml += '<td>Category</td>';
    selectedItems.forEach(item => {
      tableHtml += `<td class="spec-value">${item.category}</td>`;
    });
    tableHtml += '</tr>';

    // 4. Row: Rating
    const ratingDiffers = selectedItems.some(item => item.rating !== selectedItems[0].rating);
    tableHtml += `<tr class="${ratingDiffers ? 'row-different' : ''}" data-row-type="rating">`;
    tableHtml += '<td>Rating</td>';
    selectedItems.forEach(item => {
      const stars = Array(5).fill(0).map((_, i) => {
        const fillVal = i < Math.floor(item.rating) ? 'var(--color-warning)' : 'none';
        const strokeVal = i < Math.floor(item.rating) ? 'var(--color-warning)' : 'var(--text-muted)';
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="${fillVal}" stroke="${strokeVal}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }).join('');
      
      tableHtml += `
        <td>
          <div class="table-row-item-rating">
            ${stars} <span style="margin-left:4px;">${Number(item.rating).toFixed(1)}</span>
          </div>
        </td>
      `;
    });
    tableHtml += '</tr>';
    
    // 5. Row: Description
    const descDiffers = selectedItems.some(item => item.description !== selectedItems[0].description);
    tableHtml += `<tr class="${descDiffers ? 'row-different' : ''}" data-row-type="description">`;
    tableHtml += '<td>Description</td>';
    selectedItems.forEach(item => {
      tableHtml += `<td class="spec-value" style="font-size:0.85rem;">${item.description || '-'}</td>`;
    });
    tableHtml += '</tr>';
    
    // 6. Dynamic Specification Rows
    featureKeysArray.forEach(key => {
      // Check if feature differs
      const vals = selectedItems.map(item => (item.features && item.features[key] !== undefined) ? String(item.features[key]).trim() : '');
      const differs = vals.some(v => v !== vals[0]);
      
      tableHtml += `<tr class="${differs ? 'row-different' : ''}" data-row-type="spec" data-spec-key="${key}">`;
      tableHtml += `<td>${key}</td>`;
      
      selectedItems.forEach(item => {
        const val = (item.features && item.features[key] !== undefined) ? item.features[key] : '-';
        tableHtml += `<td class="spec-value">${val}</td>`;
      });
      tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody>';
    
    compareTable.innerHTML = tableHtml;
    
    // Register top header column remove button events
    compareTable.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        toggleCompareSelection(id);
        
        // Re-read and refresh comparison view
        const currentSelected = state.selectedItemIds;
        if (currentSelected.length < 2) {
          switchView('catalog');
        } else {
          renderComparisonTable();
        }
      });
    });
    
    // Apply options filters
    applyCompareToggles();
  }

  // ==========================================
  // 7. Difference Highlight Logic
  // ==========================================
  function applyCompareToggles() {
    const rows = compareTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const isDifferent = row.classList.contains('row-different');
      
      // 1. Highlight differences logic:
      // We toggle CSS classes that will apply background color tint
      if (state.highlightDiffs) {
        if (isDifferent) {
          row.style.boxShadow = 'inset 4px 0 0 var(--accent-primary)';
        }
      } else {
        row.style.boxShadow = 'none';
      }
      
      // 2. Show only differences logic:
      if (state.showOnlyDiffs) {
        if (!isDifferent) {
          row.style.display = 'none';
        } else {
          row.style.display = 'table-row';
        }
      } else {
        row.style.display = 'table-row';
      }
    });
  }

  // Register compare view option toggles
  toggleHighlightDiff.addEventListener('change', (e) => {
    state.highlightDiffs = e.target.checked;
    applyCompareToggles();
  });

  toggleShowOnlyDiff.addEventListener('change', (e) => {
    state.showOnlyDiffs = e.target.checked;
    applyCompareToggles();
  });

  // Initialize Catalog and Theme
  initTheme();
  initCatalog();
});
