// Admin Panel Management Logic
document.addEventListener('DOMContentLoaded', () => {
  // Elements - Login
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPasswordInput = document.getElementById('admin-password');
  const loginSubmitBtn = document.getElementById('login-submit-btn');

  // Elements - Dashboard Views & Actions
  const adminConfigForm = document.getElementById('admin-config-form');
  const maxCompareLimitInput = document.getElementById('max-compare-limit');
  const adminProductsTbody = document.getElementById('admin-products-tbody');
  const adminProductCountText = document.getElementById('admin-product-count');
  
  // Elements - Modal Product Form
  const productModal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const productForm = document.getElementById('product-form');
  const editProductIdInput = document.getElementById('edit-product-id');
  const productNameInput = document.getElementById('product-name');
  const productBrandInput = document.getElementById('product-brand');
  const productCategoryInput = document.getElementById('product-category');
  const productPriceInput = document.getElementById('product-price');
  const productRatingInput = document.getElementById('product-rating');
  const productImageInput = document.getElementById('product-image');
  const productDescriptionInput = document.getElementById('product-description');
  const dynamicSpecsContainer = document.getElementById('dynamic-specs-container');
  const categoriesDatalist = document.getElementById('categories-list');
  
  // Elements - Buttons inside Modal
  const addSpecRowBtn = document.getElementById('add-spec-row-btn');
  const productCancelBtn = document.getElementById('product-cancel-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const adminAddProductBtn = document.getElementById('admin-add-product-btn');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');

  // Elements - Database Tool Buttons
  const dbExportBtn = document.getElementById('db-export-btn');
  const dbImportBtn = document.getElementById('db-import-btn');
  const dbImportFileInput = document.getElementById('db-import-file');
  const dbResetBtn = document.getElementById('db-reset-btn');

  // ==========================================
  // 1. Admin Authentication
  // ==========================================
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const enteredPassword = adminPasswordInput.value;
      const config = window.AppDB.getConfig();

      if (enteredPassword === config.adminPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        window.switchView('admin');
        window.showToast('Admin login successful.', 'success');
      } else {
        window.showToast('Incorrect password. Please try again.', 'danger');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      window.switchView('catalog');
      window.showToast('Admin session ended.', 'info');
    });
  }

  // ==========================================
  // 2. Admin Dashboard Initialization
  // ==========================================
  function initAdminDashboard() {
    // 1. Load config settings into form
    const config = window.AppDB.getConfig();
    maxCompareLimitInput.value = config.maxCompareItems;

    // 2. Render Products list table
    renderAdminProducts();

    // 3. Update category autocomplete datalist
    updateDatalistCategories();
  }

  // Export to window so app.js view switcher can trigger it
  window.initAdminDashboard = initAdminDashboard;

  // ==========================================
  // 3. Configuration Management
  // ==========================================
  if (adminConfigForm) {
    adminConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const limit = Number(maxCompareLimitInput.value);
      if (limit < 2 || limit > 6) {
        window.showToast('Please enter a valid comparison limit between 2 and 6.', 'danger');
        return;
      }

      const config = window.AppDB.getConfig();
      config.maxCompareItems = limit;
      window.AppDB.saveConfig(config);
      
      window.showToast('Comparison limit updated successfully.', 'success');
      
      // Update catalog list display drawer count
      if (window.renderCatalog) window.renderCatalog();
    });
  }

  // ==========================================
  // 4. Products Table Renderer
  // ==========================================
  function renderAdminProducts() {
    const items = window.AppDB.getItems();
    adminProductsTbody.innerHTML = '';
    adminProductCountText.textContent = `Total: ${items.length} Products`;

    if (items.length === 0) {
      adminProductsTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No products are registered in the database. Click the "+" button to add a new product.
          </td>
        </tr>
      `;
      return;
    }

    items.forEach(item => {
      const tr = document.createElement('tr');
      const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';

      tr.innerHTML = `
        <td>
          <div class="admin-product-row-info">
            <img class="admin-product-row-img" src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' style=\\'background:%23252528;fill:%23fff;font-family:sans-serif;font-size:10px;text-anchor:middle;\\'><text x=\\'20\\' y=\\'25\\'>IMG</text></svg>'">
            <div>
              <div class="admin-product-row-name">${item.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${item.brand}</div>
            </div>
          </div>
        </td>
        <td><span class="product-card-badge" style="position:static;">${item.category}</span></td>
        <td style="font-weight:700;">$${item.price.toLocaleString()}</td>
        <td>
          <span style="color:var(--color-warning); font-weight:600;">*</span> ${Number(item.rating).toFixed(1)}
        </td>
        <td>
          <div class="actions-cell">
            <button class="btn-icon-sm edit-btn" data-id="${item.id}" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </button>
            <button class="btn-icon-sm delete-btn" data-id="${item.id}" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        </td>
      `;

      // Wire edit action
      tr.querySelector('.edit-btn').addEventListener('click', () => {
        openProductModal(item.id);
      });

      // Wire delete action
      tr.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to permanently delete "${item.name}" from the database?`)) {
          window.AppDB.deleteItem(item.id);
          window.showToast('Product deleted successfully.', 'success');
          renderAdminProducts();
          if (window.renderCatalog) window.renderCatalog();
          updateDatalistCategories();
        }
      });

      adminProductsTbody.appendChild(tr);
    });
  }

  // ==========================================
  // 5. Autocomplete Categories list helper
  // ==========================================
  function updateDatalistCategories() {
    const items = window.AppDB.getItems();
    const categories = [...new Set(items.map(item => item.category))];
    
    categoriesDatalist.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      categoriesDatalist.appendChild(opt);
    });
  }

  // ==========================================
  // 6. Dynamic Specifications Fields Form Builder
  // ==========================================
  function addSpecRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'spec-entry-row';
    
    row.innerHTML = `
      <input type="text" class="form-control spec-key" placeholder="Feature Name (Example: RAM)" value="${key}" required>
      <input type="text" class="form-control spec-val" placeholder="Value (Example: 16 GB)" value="${value}" required>
      <button type="button" class="spec-remove-btn" title="Remove feature">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    row.querySelector('.spec-remove-btn').addEventListener('click', () => {
      row.remove();
    });
    
    dynamicSpecsContainer.appendChild(row);
  }

  addSpecRowBtn.addEventListener('click', () => addSpecRow());

  // ==========================================
  // 7. Modal Form Opening / Closing
  // ==========================================
  function openProductModal(productId = null) {
    // Clear previous dynamic rows
    dynamicSpecsContainer.innerHTML = '';

    if (productId) {
      // Edit mode
      modalTitle.textContent = 'Edit Product';
      const items = window.AppDB.getItems();
      const product = items.find(item => item.id === productId);
      
      if (product) {
        editProductIdInput.value = product.id;
        productNameInput.value = product.name;
        productBrandInput.value = product.brand;
        productCategoryInput.value = product.category;
        productPriceInput.value = product.price;
        productRatingInput.value = product.rating;
        productImageInput.value = product.imageUrl || '';
        productDescriptionInput.value = product.description || '';
        
        // Build dynamic specs rows
        if (product.features) {
          Object.entries(product.features).forEach(([key, val]) => {
            addSpecRow(key, val);
          });
        }
      }
    } else {
      // Add new mode
      modalTitle.textContent = 'Add New Product';
      editProductIdInput.value = '';
      productForm.reset();
      
      // Add a couple of initial empty specification helper rows
      addSpecRow('Processor', '');
      addSpecRow('RAM', '');
      addSpecRow('Storage', '');
      addSpecRow('Battery', '');
    }

    productModal.classList.add('open');
  }

  adminAddProductBtn.addEventListener('click', () => openProductModal(null));

  function closeProductModal() {
    productModal.classList.remove('open');
  }

  productCancelBtn.addEventListener('click', closeProductModal);
  modalCloseBtn.addEventListener('click', closeProductModal);

  // Close modal when clicking outside content area
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
      closeProductModal();
    }
  });

  // ==========================================
  // 8. Product Save Handler
  // ==========================================
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read general details
    const id = editProductIdInput.value || null;
    const name = productNameInput.value.trim();
    const brand = productBrandInput.value.trim();
    const category = productCategoryInput.value.trim();
    const price = Number(productPriceInput.value);
    const rating = Number(productRatingInput.value);
    const imageUrl = productImageInput.value.trim();
    const description = productDescriptionInput.value.trim();

    // Gather specs from dynamic form entries
    const features = {};
    const specRows = dynamicSpecsContainer.querySelectorAll('.spec-entry-row');
    
    specRows.forEach(row => {
      const key = row.querySelector('.spec-key').value.trim();
      const val = row.querySelector('.spec-val').value.trim();
      if (key && val) {
        features[key] = val;
      }
    });

    const newOrEditedProduct = {
      id,
      name,
      brand,
      category,
      price,
      rating,
      imageUrl,
      description,
      features
    };

    // Save to LocalStorage
    window.AppDB.saveItem(newOrEditedProduct);
    
    window.showToast(id ? 'Product updated successfully.' : 'New product added successfully.', 'success');
    closeProductModal();
    
    // Refresh admin tables and catalog
    renderAdminProducts();
    if (window.renderCatalog) window.renderCatalog();
    if (window.updateCategoryTabs) window.updateCategoryTabs();
    updateDatalistCategories();
  });

  // ==========================================
  // 9. Database Backup Tools (Import/Export/Reset)
  // ==========================================
  
  // Export DB to server-saved Desktop backup
  dbExportBtn.addEventListener('click', async () => {
    const jsonString = window.AppDB.exportDatabase();
    
    try {
      window.showToast('Saving database to the desktop...', 'info');
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
      });
      
      const result = await response.json();
      
      if (result.success) {
        window.showToast(`Success! File saved: ${result.path}`, 'success');
      } else {
        window.showToast(`ERROR: ${result.error}`, 'danger');
      }
    } catch (err) {
      window.showToast('ERROR: Could not connect to the server. Make sure the server is running.', 'danger');
    }
  });

  // Import DB from server-read Desktop backup
  dbImportBtn.addEventListener('click', async () => {
    try {
      window.showToast('Reading backup file from the desktop...', 'info');
      
      const response = await fetch('/api/import');
      const result = await response.json();
      
      if (result.success) {
        // Write the imported data to localStorage
        const success = window.AppDB.importDatabase(JSON.stringify(result.data));
        
        if (success) {
          window.showToast(`Success! ${result.data.items.length} products imported.`, 'success');
          
          // Refresh everything
          initAdminDashboard();
          if (window.renderCatalog) window.renderCatalog();
          if (window.updateCategoryTabs) window.updateCategoryTabs();
        } else {
          window.showToast('ERROR: Data could not be written to localStorage.', 'danger');
        }
      } else {
        window.showToast(`ERROR: ${result.error}`, 'danger');
      }
    } catch (err) {
      window.showToast('ERROR: Could not connect to the server. Make sure the server is running.', 'danger');
    }
  });

  // Reset database tool
  dbResetBtn.addEventListener('click', () => {
    const doubleConfirm = confirm(
      'WARNING: Are you sure you want to reset the database?\n' +
      'All products, features, and settings you added will be deleted and the default seed data will be restored.'
    );
    
    if (doubleConfirm) {
      window.AppDB.resetDatabase();
      window.showToast('Database reset to default settings.', 'success');
      
      // Refresh views
      initAdminDashboard();
      if (window.renderCatalog) window.renderCatalog();
      if (window.updateCategoryTabs) window.updateCategoryTabs();
    }
  });

});
