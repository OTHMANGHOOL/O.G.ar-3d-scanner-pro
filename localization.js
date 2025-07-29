export const localization = {
  supportedLanguages: ['en', 'ar'],
  currentLanguage: 'en',
  translations: {},
  
  async init() {
    // Determine initial language
    this.detectLanguage();
    
    // Load translations
    await this.loadTranslations(this.currentLanguage);
    
    // Setup language toggle
    this.setupLanguageToggle();
    
    // Apply initial translations
    this.updateAllText();
    
    // Set text direction based on language
    document.body.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    console.log('Localization initialized with language:', this.currentLanguage);
  },
  
  detectLanguage() {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('ar_scanner_language');
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }
    
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      this.currentLanguage = browserLang;
      return;
    }
    
    // Default to English
    this.currentLanguage = 'en';
  },
  
  async loadTranslations(language) {
    try {
      const response = await fetch(`./locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to empty translations object
      this.translations = {};
    }
  },
  
  setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      // Update button text
      langToggle.querySelector('[data-i18n="language"]').textContent = 
        this.currentLanguage === 'en' ? 'AR' : 'EN';
      
      // Add click handler
      langToggle.addEventListener('click', async () => {
        // Toggle language
        const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
        await this.setLanguage(newLang);
        
        // Update button text
        langToggle.querySelector('[data-i18n="language"]').textContent = 
          this.currentLanguage === 'en' ? 'AR' : 'EN';
      });
    }
  },
  
  async setLanguage(language) {
    if (!this.supportedLanguages.includes(language) || language === this.currentLanguage) {
      return;
    }
    
    this.currentLanguage = language;
    
    // Save to localStorage
    localStorage.setItem('ar_scanner_language', language);
    
    // Load new translations
    await this.loadTranslations(language);
    
    // Update all text elements
    this.updateAllText();
    
    // Update text direction
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    console.log('Language changed to:', language);
  },
  
  updateAllText() {
    // Find all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getText(key);
      if (translation) {
        element.textContent = translation;
      }
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.getText(key);
      if (translation) {
        element.placeholder = translation;
      }
    });
    
    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.getText(key);
      if (translation) {
        element.title = translation;
      }
    });
  },
  
  getText(key) {
    return this.translations[key] || key;
  }
};