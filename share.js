import { uiController } from './ui.js';
import { galleryManager } from './gallery.js';
import { localization } from './localization.js';
import { db, storage, ref, getDownloadURL } from './firebase-config.js';

export const sharingManager = {
  init() {
    // Check if Web Share API is available
    this.canShare = navigator.share !== undefined;
    console.log('Sharing manager initialized, Web Share API available:', this.canShare);
  },
  
  async shareModel(modelId) {
    const model = galleryManager.models.find(m => m.id === modelId);
    if (!model) {
      console.error('Model not found:', modelId);
      return;
    }
    
    try {
      uiController.showLoading(localization.getText('preparing') || 'Preparing model for sharing...');
      
      // In a real implementation, you would:
      // 1. Generate a shareable link or file
      // 2. Use the Web Share API if available
      
      if (this.canShare) {
        // Prepare share data
        const shareData = {
          title: model.name || 'AR 3D Model',
          text: localization.getText('shareMessage') || 'Check out this 3D model I scanned with AR Scanner Pro!',
          // In a real implementation, this would be a generated URL
          url: window.location.href
        };
        
        // Try to share
        await navigator.share(shareData);
        
        uiController.hideLoading();
        uiController.showNotification(
          localization.getText('shared') || 'Model shared successfully', 
          'success'
        );
      } else {
        // Fallback if Web Share API is not available
        // Create a shareable link
        const shareLink = window.location.origin + '?model=' + modelId;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareLink);
        
        uiController.hideLoading();
        uiController.showNotification(
          localization.getText('linkCopied') || 'Share link copied to clipboard', 
          'info'
        );
      }
    } catch (error) {
      console.error('Failed to share model:', error);
      uiController.hideLoading();
      
      if (error.name === 'AbortError') {
        // User cancelled sharing
        uiController.showNotification(
          localization.getText('shareCancelled') || 'Sharing cancelled', 
          'info'
        );
      } else {
        uiController.showNotification(
          localization.getText('shareError') || 'Failed to share model', 
          'error'
        );
      }
    }
  },
  
  async generateShareableLink(modelId) {
    // In a real implementation, you would:
    // 1. Upload the model to Firebase Storage if not already there
    // 2. Generate a public URL or custom short link
    // 3. Return the URL
    
    const shareLink = window.location.origin + '?model=' + modelId;
    return shareLink;
  }
};