document.addEventListener('DOMContentLoaded', function () {
    // 移动端不加载（可按需修改）
  if (screen.width < 768) return;


  if (window.aplayerInited) return;
  window.aplayerInited = true;


  // 创建隐藏的APlayer实例
  const ap = new APlayer({
    container: document.getElementById('player'),
    fixed: false,
    mini: false,
    autoplay: false,
    theme: '#4682B4', // 钢蓝色
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.8,
    lrcType: 1, // 不显示歌词
    audio: [
      
      {
          name: 'Viva La Vida',
          artist: 'Coldplay',
          url: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/viva-la-vida-coldplay.mp3',
          cover: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/Viva%20La%20Vida.png'
      },
      {
        name: 'Do you hear the people sing?',
        artist: 'Coldplay',
        url: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/Do-you-hear-the-people-sing.mp3',
        cover: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/Do_you_hear_the_people_sing.png'
    },
        {
        name: '童话镇',
        artist: '陈一发儿',
        url: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/%E9%99%88%E4%B8%80%E5%8F%91%E5%84%BF-%E7%AB%A5%E8%AF%9D%E9%95%87.mp3',
        cover: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/%E7%AB%A5%E8%AF%9D%E9%95%87.jpg'
      },
      {
        name: '大主宰',
        artist: '洛天依',
        url: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/%E6%B4%9B%E5%A4%A9%E4%BE%9D-%E5%A4%A7%E4%B8%BB%E5%AE%B0.mp3',
        cover: 'https://cdn.jsdelivr.net/gh/o0wde0o/blog-image@main/music/%E5%A4%A7%E4%B8%BB%E5%AE%B0.jpg'
      },
    ]
  });

  // 获取DOM元素
  const ball = document.getElementById('floating-ball');
  const icon = document.getElementById('play-icon');
  const controlMenu = document.getElementById('control-menu');
  const songListContainer = document.getElementById('song-list-container');
  const songList = document.getElementById('song-list');
  const prevBtn = document.getElementById('prev-btn');
  const playBtn = document.getElementById('play-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentTitle = document.getElementById('current-title');
  const currentArtist = document.getElementById('current-artist');
  const progressBar = document.getElementById('progress-bar');
  const progress = document.getElementById('progress');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const volumeBar = document.getElementById('volume-bar');
  const volumeLevel = document.getElementById('volume-level');
  const paginationControls = document.getElementById('pagination-controls');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');


  
  // 分页相关变量
  const SONGS_PER_PAGE = 7;
  let currentPage = 1;
  let totalPages = 1;

  // 菜单显示/隐藏控制
  let menuTimeout;
  let isMenuHovered = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let ballStartLeft = 0;
  let ballStartTop = 0;
  let menuPosition = 'right'; // 记录菜单当前相对位置 ('right' 或 'left')

  // 显示菜单
  function showMenu() {
    clearTimeout(menuTimeout);
    controlMenu.classList.add('show');
    positionMenu();
  }

  // 隐藏菜单（带延迟）
  function hideMenu() {
    if (!isMenuHovered && !isDragging) {
      menuTimeout = setTimeout(() => {
        controlMenu.classList.remove('show');
      }, 300);
    }
  }

  // 定位菜单 - 智能调整位置
  function positionMenu() {
    const ballRect = ball.getBoundingClientRect();
    const menuWidth = controlMenu.offsetWidth;
    const menuHeight = controlMenu.offsetHeight;
    
    // 默认尝试放在右侧
    let left = ballRect.right + 10;
    let top = ballRect.top;
    let newPosition = 'right';
    
    // 检查右侧空间是否足够
    if (left + menuWidth > window.innerWidth - 10) {
      // 右侧空间不足，尝试放在左侧
      left = ballRect.left - menuWidth - 10;
      newPosition = 'left';
      
      // 检查左侧空间是否足够
      if (left < 10) {
        // 两侧都不够空间，强制放在右侧（会被窗口裁剪）
        left = ballRect.right + 10;
        newPosition = 'right';
      }
    }
    
    // 确保不超出屏幕上下边界
    if (top < 10) {
      top = 10;
    } else if (top + menuHeight > window.innerHeight - 10) {
      top = window.innerHeight - menuHeight - 10;
    }
    
    // 如果位置没有变化，保持当前相对位置
    if (newPosition === menuPosition) {
      // 保持当前相对位置
      if (menuPosition === 'right') {
        left = ballRect.right + 10;
      } else {
        left = ballRect.left - menuWidth - 10;
      }
      
      // 再次检查空间是否足够
      if ((menuPosition === 'right' && left + menuWidth > window.innerWidth - 10) ||
          (menuPosition === 'left' && left < 10)) {
        // 当前相对位置空间不足，切换位置
        menuPosition = menuPosition === 'right' ? 'left' : 'right';
        if (menuPosition === 'right') {
          left = ballRect.right + 10;
        } else {
          left = ballRect.left - menuWidth - 10;
        }
      }
    } else {
      // 位置有变化，更新记录
      menuPosition = newPosition;
    }
    
    controlMenu.style.left = `${left}px`;
    controlMenu.style.top = `${top}px`;
  }

  // 更新封面图
  function updateCover() {
    const current = ap.list.audios[ap.list.index];
    ball.style.backgroundImage = `url("${current.cover}")`;
    currentTitle.textContent = current.name;
    currentArtist.textContent = current.artist;
  }

  // 更新播放状态
  function updatePlayState() {
    if (ap.audio.paused) {
      ball.classList.remove('playing');
      icon.textContent = '▶️';
      playBtn.textContent = '▶️';
    } else {
      ball.classList.add('playing');
      icon.textContent = '⏸️';
      playBtn.textContent = '⏸️';
    }
  }

  // 更新进度条
  function updateProgress() {
    const percent = ap.audio.currentTime / ap.audio.duration * 100;
    progress.style.width = `${percent}%`;
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(ap.audio.currentTime);
    durationEl.textContent = formatTime(ap.audio.duration);
  }

  // 格式化时间 (秒 -> MM:SS)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 更新音量显示
  function updateVolume() {
    volumeLevel.style.width = `${ap.audio.volume * 100}%`;
  }

  // 更新分页信息
  function updatePagination() {
    totalPages = Math.ceil(ap.list.audios.length / SONGS_PER_PAGE);
    
    if (totalPages > 1) {
      paginationControls.style.display = 'flex';
      pageInfo.textContent = `${currentPage}/${totalPages}`;
      
      prevPageBtn.classList.toggle('disabled', currentPage === 1);
      nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
    } else {
      paginationControls.style.display = 'none';
    }
  }

  // 更新歌曲列表
  function updateSongList() {
    songList.innerHTML = '';
    
    const startIndex = (currentPage - 1) * SONGS_PER_PAGE;
    const endIndex = Math.min(startIndex + SONGS_PER_PAGE, ap.list.audios.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const song = ap.list.audios[i];
      const songItem = document.createElement('div');
      songItem.className = `song-item ${i === ap.list.index ? 'active' : ''}`;
      songItem.innerHTML = `
        <div class="song-title">${song.name}</div>
        <div class="song-artist">${song.artist}</div>
      `;
      songItem.addEventListener('click', () => {
        ap.list.switch(i);
        updateSongList();
        // 如果切换歌曲后不在当前页，跳转到对应页
        const newPage = Math.floor(i / SONGS_PER_PAGE) + 1;
        if (newPage !== currentPage) {
          currentPage = newPage;
          updateSongList();
          updatePagination();
        }
      });
      songList.appendChild(songItem);
    }
    
    // 更新分页信息
    updatePagination();
  }

  // 初始化
  updateCover();
  updatePlayState();
  updateSongList();
  updateVolume();

  // 事件监听
  ap.on('listswitch', () => {
    updateCover();
    // 检查当前歌曲是否在当前页，如果不在则跳转到对应页
    const newPage = Math.floor(ap.list.index / SONGS_PER_PAGE) + 1;
    if (newPage !== currentPage) {
      currentPage = newPage;
      updateSongList();
      updatePagination();
    } else {
      updateSongList();
    }
  });
  
  ap.on('loadeddata', () => {
    updateCover();
    durationEl.textContent = formatTime(ap.audio.duration);
  });
  
  ap.on('play', updatePlayState);
  ap.on('pause', updatePlayState);
  
  // 进度更新
  ap.on('timeupdate', updateProgress);
  
  // 音量变化
  ap.on('volumechange', updateVolume);

  // 悬浮球交互
  ball.addEventListener('mouseenter', showMenu);
  ball.addEventListener('mouseleave', hideMenu);
  
  controlMenu.addEventListener('mouseenter', () => {
    isMenuHovered = true;
    clearTimeout(menuTimeout);
  });
  
  controlMenu.addEventListener('mouseleave', () => {
    isMenuHovered = false;
    hideMenu();
  });

  // 点击悬浮球播放/暂停
  ball.addEventListener('click', e => {
    if (!isDragging && (e.target === ball || e.target === icon)) {
      ap.toggle();
    }
  });

  // 控制按钮
  prevBtn.addEventListener('click', () => {
    ap.skipBack();
    updateSongList();
  });

  playBtn.addEventListener('click', () => {
    ap.toggle();
  });

  nextBtn.addEventListener('click', () => {
    ap.skipForward();
    updateSongList();
  });

  // 进度条点击
  progressBar.addEventListener('click', e => {
    const percent = e.offsetX / progressBar.offsetWidth;
    ap.seek(percent * ap.audio.duration);
  });

  // 音量控制
  volumeBar.addEventListener('click', e => {
    const percent = e.offsetX / volumeBar.offsetWidth;
    ap.volume(percent);
  });

  // 窗口大小变化时重新定位菜单
  window.addEventListener('resize', () => {
    if (controlMenu.classList.contains('show')) {
      positionMenu();
    }
  });

  // 悬浮球拖动功能
  ball.addEventListener('mousedown', (e) => {
    isDragging = true;
    ball.classList.add('dragging');
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const ballRect = ball.getBoundingClientRect();
    ballStartLeft = ballRect.left;
    ballStartTop = ballRect.top;
    
    // 防止文本选中
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    
    let newLeft = ballStartLeft + dx;
    let newTop = ballStartTop + dy;
    
    // 限制在窗口范围内
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - ball.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - ball.offsetHeight));
    
    ball.style.left = `${newLeft}px`;
    ball.style.top = `${newTop}px`;
    
    // 更新菜单位置
    if (controlMenu.classList.contains('show')) {
      positionMenu();
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      ball.classList.remove('dragging');
      
      // 小延迟后再允许点击事件
      setTimeout(() => {
        isDragging = false;
      }, 100);
    }
  });
  
  // 分页控制
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateSongList();
    }
  });
  
  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateSongList();
    }
  });
});