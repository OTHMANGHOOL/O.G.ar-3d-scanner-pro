import { localization } from './localization.js';
import { scannerAR } from './scanner-ar.js';
import { galleryManager } from './gallery.js';

// UI Controller Module
export const uiController = {
  activeView: 'scanner',
  
  init() {
    this.setupNavigation();
    this.setupModalHandlers();
    this.setupButtons();
    console.log('UI Controller initialized');
  },
  
  setupNavigation() {
    // Navigation buttons
    const scannerNavBtn = document.getElementById('scannerNav');
    const galleryNavBtn = document.getElementById('galleryNav');
    
    scannerNavBtn.addEventListener('click', () => this.showView('scanner'));
    galleryNavBtn.addEventListener('click', () => this.showView('gallery'));
  },
  
  showView(viewName) {
    if (this.activeView === viewName) return;
    
    // Update active view
    this.activeView = viewName;
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(`${viewName}-container`).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`${viewName}Nav`).classList.add('active');
    
    // Special handling for views
    if (viewName === 'scanner') {
      scannerAR.resume();
    } else if (viewName === 'gallery') {
      scannerAR.pause();
      galleryManager.refreshGallery();
    }
  },
  
  setupModalHandlers() {
    const modal = document.getElementById('model-viewer-modal');
    const closeBtn = modal.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Close when clicking outside the modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  },
  
  openModal(modelId) {
    const modal = document.getElementById('model-viewer-modal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // Load the model data
    galleryManager.displayModel(modelId);
  },
  
  closeModal() {
    const modal = document.getElementById('model-viewer-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    
    // Clean up the model viewer
    document.getElementById('model-container').innerHTML = '';
  },
  
  setupButtons() {
    // Capture button
    const captureBtn = document.getElementById('captureBtn');
    captureBtn.addEventListener('click', () => {
      scannerAR.captureModel();
    });
    
    // Model action buttons
    const shareBtn = document.getElementById('shareBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    shareBtn.addEventListener('click', () => {
      const currentModelId = galleryManager.currentModelId;
      if (currentModelId) {
        import('./share.js').then(module => {
          module.sharingManager.shareModel(currentModelId);
        });
      }
    });
    
    downloadBtn.addEventListener('click', () => {
      const currentModelId = galleryManager.currentModelId;
      if (currentModelId) {
        galleryManager.downloadModel(currentModelId);
      }
    });
    
    deleteBtn.addEventListener('click', () => {
      const currentModelId = galleryManager.currentModelId;
      if (currentModelId && confirm(localization.getText('confirmDelete') || 'Are you sure you want to delete this model?')) {
        galleryManager.deleteModel(currentModelId);
        this.closeModal();
      }
    });
  },
  
  showLoading(message) {
    // Create or update loading overlay
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <p id="loading-message">${message || localization.getText('loading') || 'Loading...'}</p>
      `;
      document.body.appendChild(loadingOverlay);
    } else {
      document.getElementById('loading-message').textContent = 
        message || localization.getText('loading') || 'Loading...';
      loadingOverlay.style.display = 'flex';
    }
  },
  
  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  },
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Create container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification);
        }
      }, 300); // Match the CSS transition time
    }, 5000);
  }
};