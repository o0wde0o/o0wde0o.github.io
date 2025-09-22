// theme-switcher.js
document.addEventListener('DOMContentLoaded', function() {
    // 背景图片配置
    const bgImages = {
      light: "https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/background/wallhaven-wqery6-light.jpg",
      dark: "https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/background/wallhaven-wqery6-dark.jpg"
    };
  
    // 获取当前主题（优先从 localStorage，默认 light）
    function getCurrentTheme() {
      return localStorage.getItem('theme') || 
             document.documentElement.getAttribute('data-theme') || 
             'light';
    }
  
    // 设置背景图片
    function setBackgroundImage(theme) {
      const bgImage = bgImages[theme];
      if (!bgImage) return;
      
      // 应用到整个页面背景
      document.body.style.backgroundImage = `url(${bgImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundRepeat = 'no-repeat';
      
      // 可选：应用到特定元素（如 header）
      const header = document.getElementById('page-header');
      if (header) {
        header.style.backgroundImage = `url(${bgImage})`;
      }
    }
  
    // 初始化背景
    setBackgroundImage(getCurrentTheme());
  
    // 监听主题变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setBackgroundImage(newTheme);
        }
      });
    });
  
    // 开始观察 html 元素的属性变化
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  
    // 监听 storage 事件（跨标签页同步）
    window.addEventListener('storage', function(e) {
      if (e.key === 'theme') {
        setBackgroundImage(e.newValue);
      }
    });
  });