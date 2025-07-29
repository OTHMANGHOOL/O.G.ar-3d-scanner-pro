export const themeManager = {
  init() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('ar_scanner_theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark');
      } else {
        this.setTheme('light');
      }
    }
    
    // Setup theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('ar_scanner_theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    
    console.log('Theme manager initialized');
  },
  
  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    
    // Save preference
    localStorage.setItem('ar_scanner_theme', theme);
    
    console.log('Theme set to:', theme);
  },
  
  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    this.setTheme(isDark ? 'light' : 'dark');
  },
  
  getCurrentTheme() {
    return document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
  }
};