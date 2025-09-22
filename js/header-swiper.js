(function () {
    const swiperImgs = [
      "https://picsum.photos/id/1015/1200/400",
      "https://picsum.photos/id/1022/1200/400",
      "https://picsum.photos/id/1033/1200/400"
    ];
  
    function isSkyCategoryPage() {
      const decodedPath = decodeURIComponent(window.location.pathname);
      return decodedPath.includes('/categories/sky-光·遇');
    }
  
    function initSwiperHeader() {
      if (!isSkyCategoryPage()) return;
  
      const header = document.getElementById("page-header");
      if (!header || header.classList.contains('swiper-injected')) return;
  
      // 标记避免重复注入
      header.classList.add('swiper-injected');
      header.innerHTML = `
        <div class="swiper-container header-swiper">
          <div class="swiper-wrapper">
            ${swiperImgs.map(src => `<div class="swiper-slide"><img src="${src}" alt=""></div>`).join('')}
          </div>
        </div>
      `;
  
      // 延迟初始化 Swiper（确保类库已加载）
      if (typeof Swiper !== "undefined") {
        new Swiper('.header-swiper', {
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          effect: 'fade'
        });
      } else {
        console.warn('Swiper.js 未加载，请确认 cdn 引入是否在 header 中加载。');
      }
    }
  
    document.addEventListener("DOMContentLoaded", initSwiperHeader);
    document.addEventListener("pjax:complete", initSwiperHeader);
  })();
  