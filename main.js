import { initializeAuth } from './firebase-config.js';
import { uiController } from './ui.js';
import { scannerAR } from './scanner-ar.js';
import { galleryManager } from './gallery.js';
import { sharingManager } from './share.js';
import { localization } from './localization.js';
import { themeManager } from './theme-manager.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize core modules
    themeManager.init();
    await localization.init();
    
    // Initialize Firebase Authentication
    try {
      await initializeAuth();
      console.log('Firebase authentication initialized');
    } catch (error) {
      console.error('Firebase authentication failed:', error);
      // Continue with limited functionality
    }
    
    // Initialize UI components and event listeners
    uiController.init();
    
    // Initialize AR Scanner when UI is ready
    try {
      await scannerAR.init();
      console.log('AR Scanner initialized');
    } catch (error) {
      console.error('AR Scanner initialization failed:', error);
      document.querySelector('#scanner-container .placeholder').textContent = 
        localization.getText('scannerError') || 'Could not initialize AR scanner';
    }
    
    // Initialize gallery with previously saved models
    try {
      await galleryManager.init();
      console.log('Gallery initialized');
    } catch (error) {
      console.error('Gallery initialization failed:', error);
    }
    
    // Initialize sharing capabilities
    sharingManager.init();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Display error message to user
    alert(localization.getText('initError') || 'Application failed to initialize properly');
  }
});