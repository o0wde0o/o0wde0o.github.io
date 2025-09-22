if (!window.live2dAlreadyInitialized && screen.width >= 768) {
    window.live2dAlreadyInitialized = true;
  
    let dialogueData = null;
    let currentDialogueTimeout = null;
    let lastDialogueTime = 0;
  
    async function loadDialogueData() {
      try {
        const res = await fetch('/live2d/waifu-tips.json');
        dialogueData = await res.json();
      } catch (e) {
        console.error('对话数据加载失败:', e);
      }
    }
  
    function showDialogue(text) {
      if (!text) return;
      const box = document.getElementById('dialogue-box');
      if (!box) return;
  
      const now = Date.now();
  
      // 若距离上次说话少于 500ms，则不立即替换
      if (now - lastDialogueTime < 500) return;
  
      clearTimeout(currentDialogueTimeout);
      box.textContent = Array.isArray(text)
        ? text[Math.floor(Math.random() * text.length)]
        : text;
      box.style.display = 'block';
  
      lastDialogueTime = now;
      currentDialogueTimeout = setTimeout(() => {
        box.style.display = 'none';
      }, 3000); // 停留 3 秒
    }
  
    function initTestButtons() {
      const buttons = document.querySelectorAll('.test-btn');
      buttons.forEach(btn => {
        if (btn.id !== 'toggle-hit-areas') {
          btn.addEventListener('mouseover', () => {
            const sel = btn.getAttribute('data-selector');
            const tip = dialogueData?.mouseover?.find(item => item.selector === sel);
            if (tip) showDialogue(tip.text);
          });
        }
      });
  
      document.getElementById('toggle-hit-areas')?.addEventListener('click', () => {
        const container = document.getElementById('live2d-container');
        if (document.querySelector('.debug-area')) {
          document.querySelectorAll('.debug-area').forEach(el => el.remove());
        } else {
          const areas = {
            head: { x: 100, y: 70, w: 100, h: 80, borderRadius: '50%' },
            body: { x: 100, y: 160, w: 100, h: 90, borderRadius: '0' },
            tail: { x: 30, y: 140, w: 60, h: 100, borderRadius: '30px 0 0 30px' }
          };
          for (const [part, area] of Object.entries(areas)) {
            const div = document.createElement('div');
            div.className = 'debug-area';
            Object.assign(div.style, {
              position: 'absolute',
              left: area.x + 'px',
              top: area.y + 'px',
              width: area.w + 'px',
              height: area.h + 'px',
              border: '2px dashed red',
              borderRadius: area.borderRadius,
              zIndex: 20,
              pointerEvents: 'none'
            });
            container.appendChild(div);
          }
        }
      });
    }
  
    (async () => {
      await loadDialogueData();
      if (!dialogueData) return;
  
      const container = document.getElementById('live2d-container');
      if (!container) return;
  
      const app = new PIXI.Application({
        view: container.appendChild(document.createElement('canvas')),
        width: 300,
        height: 300,
        backgroundAlpha: 0
      });
  
      const model = await PIXI.live2d.Live2DModel.from("/live2d/model0.model3.json");
      model.scale.set(0.3);
      model.anchor.set(0.5);
      model.x = app.screen.width / 2;
      model.y = app.screen.height / 2;
      app.stage.addChild(model);
  
      // ✅ 全局鼠标视觉跟随
      window.addEventListener('mousemove', (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 3;
        const dy = (e.clientY / window.innerHeight - 0.5) * -3;
  
        const setParam = (name, value) => {
          try {
            const core = model.internalModel.coreModel;
            const current = core.getParameterValueById(name);
            core.setParameterValueById(name, current + (value - current) * 0.15);
          } catch {}
        };
  
        setParam("PARAM_ANGLE_X", dx * 10);
        setParam("PARAM_ANGLE_Y", dy * 8);
        setParam("PARAM_BODY_ANGLE_X", dx * 5);
        setParam("PARAM_EYE_BALL_X", dx);
        setParam("PARAM_EYE_BALL_Y", dy);
      });
  
      // ✅ 点击动作与对话，仅限容器内
      container.addEventListener('click', () => {
        model.motion("Tap", 0);
        showDialogue(dialogueData.message?.tapBody || "别戳我啦~");
      });
  
      // ✅ 鼠标在容器内部触发区域对话
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        const areas = {
          head: { x: 100, y: 70, w: 100, h: 80 },
          body: { x: 100, y: 160, w: 100, h: 90 },
          tail: { x: 30, y: 140, w: 60, h: 100 }
        };
  
        for (const [part, area] of Object.entries(areas)) {
          if (x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h) {
            const msgKey = `hover${part.charAt(0).toUpperCase()}${part.slice(1)}`;
            const text = dialogueData.message?.[msgKey];
            if (text) showDialogue(text);
            break;
          }
        }
      });
  
      // ✅ 初始对话
      setTimeout(() => {
        showDialogue(dialogueData.message?.default || "你好~");
      }, 1000);
  
      initTestButtons();
    })();
  }
  