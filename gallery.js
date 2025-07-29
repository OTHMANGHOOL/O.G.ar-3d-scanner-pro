import { uiController } from './ui.js';
import { db, storage, ref, getDownloadURL, collection, currentUser } from './firebase-config.js';
import { localization } from './localization.js';

export const galleryManager = {
  models: [],
  currentModelId: null,
  
  async init() {
    // Load models from local storage
    this.loadLocalModels();
    
    // If authenticated, load models from Firebase
    if (currentUser) {
      await this.loadFirebaseModels();
    }
    
    // Render initial gallery
    this.refreshGallery();
    
    console.log('Gallery initialized with', this.models.length, 'models');
  },
  
  loadLocalModels() {
    try {
      const savedModels = JSON.parse(localStorage.getItem('ar_scanner_models') || '[]');
      this.models = savedModels;
    } catch (error) {
      console.error('Failed to load local models:', error);
      this.models = [];
    }
  },
  
  async loadFirebaseModels() {
    try {
      // In a real implementation, you would query Firestore for the user's models
      // For this example, we'll assume it's already done and models are in this.models
      console.log('Loaded Firebase models');
    } catch (error) {
      console.error('Failed to load Firebase models:', error);
    }
  },
  
  refreshGallery() {
    const gridContainer = document.getElementById('models-grid');
    const emptyPlaceholder = document.querySelector('#gallery-container .placeholder');
    
    // Clear existing items
    gridContainer.innerHTML = '';
    
    if (this.models.length === 0) {
      // Show empty placeholder
      emptyPlaceholder.style.display = 'block';
      return;
    }
    
    // Hide empty placeholder
    emptyPlaceholder.style.display = 'none';
    
    // Sort models by timestamp (newest first)
    const sortedModels = [...this.models].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Create model cards
    sortedModels.forEach(model => {
      const card = document.createElement('div');
      card.className = 'model-card';
      card.dataset.modelId = model.id;
      
      // Card content
      card.innerHTML = `
        <div class="model-thumbnail">
          <img src="${model.thumbnail || '/images/modelthumbnail.jpg'}" alt="${model.name}">
        </div>
        <div class="model-info">
          <h3>${model.name}</h3>
          <p>${new Date(model.timestamp).toLocaleDateString()}</p>
        </div>
      `;
      
      // Add click event
      card.addEventListener('click', () => {
        this.openModel(model.id);
      });
      
      gridContainer.appendChild(card);
    });
  },
  
  openModel(modelId) {
    this.currentModelId = modelId;
    uiController.openModal(modelId);
  },
  
  displayModel(modelId) {
    const model = this.models.find(m => m.id === modelId);
    if (!model) {
      console.error('Model not found:', modelId);
      return;
    }
    
    const modelContainer = document.getElementById('model-container');
    
    // In a real implementation, you would:
    // 1. Load the 3D model file
    // 2. Create a Three.js viewer or use <model-viewer>
    // 3. Display the model with controls
    
    // For this example, we'll create a simple placeholder
    modelContainer.innerHTML = `
      <div class="model-placeholder">
        <img src="${model.thumbnail || '/images/modelthumbnail.jpg'}" alt="${model.name}">
        <h4>${model.name}</h4>
        <p>${localization.getText('createdOn')}: ${new Date(model.timestamp).toLocaleString()}</p>
        <p>${localization.getText('format')}: ${model.format.toUpperCase()}</p>
      </div>
    `;
  },
  
  async downloadModel(modelId) {
    const model = this.models.find(m => m.id === modelId);
    if (!model) {
      console.error('Model not found:', modelId);
      return;
    }
    
    try {
      uiController.showLoading(localization.getText('downloading') || 'Downloading 3D model...');
      
      // In a real implementation, you would:
      // 1. Get the model file from local storage or Firebase
      // 2. Create a download link for the file
      
      // For this example, we'll simulate a download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      uiController.hideLoading();
      uiController.showNotification(
        localization.getText('downloadComplete') || 'Model downloaded successfully', 
        'success'
      );
    } catch (error) {
      console.error('Failed to download model:', error);
      uiController.hideLoading();
      uiController.showNotification(
        localization.getText('downloadError') || 'Failed to download model', 
        'error'
      );
    }
  },
  
  async deleteModel(modelId) {
    const modelIndex = this.models.findIndex(m => m.id === modelId);
    if (modelIndex === -1) {
      console.error('Model not found:', modelId);
      return;
    }
    
    try {
      uiController.showLoading(localization.getText('deleting') || 'Deleting model...');
      
      // Remove from local array
      const model = this.models[modelIndex];
      this.models.splice(modelIndex, 1);
      
      // Update local storage
      localStorage.setItem('ar_scanner_models', JSON.stringify(this.models));
      
      // If authenticated, delete from Firebase
      if (currentUser && model.firebaseId) {
        // In a real implementation, you would delete the document from Firestore
        // and the file from Storage
        console.log('Model deleted from Firebase:', modelId);
      }
      
      // Refresh gallery
      this.refreshGallery();
      
      uiController.hideLoading();
      uiController.showNotification(
        localization.getText('deleteComplete') || 'Model deleted successfully', 
        'success'
      );
    } catch (error) {
      console.error('Failed to delete model:', error);
      uiController.hideLoading();
      uiController.showNotification(
        localization.getText('deleteError') || 'Failed to delete model', 
        'error'
      );
    }
  }
};