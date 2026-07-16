(function () {
  'use strict';

  const loginScreen = document.getElementById('login-screen');
  const congratsScreen = document.getElementById('congrats-screen');
  const codeForm = document.getElementById('code-form');
  const codeInputs = document.querySelectorAll('#code-inputs input');
  const errorMsg = document.getElementById('error-msg');
  const video = document.getElementById('congrats-video');
  const youtubePlayerEl = document.getElementById('youtube-player');
  const postVideoContent = document.getElementById('post-video-content');
  const wishesList = document.getElementById('wishes-list');
  const canvas = document.getElementById('fireworks-canvas');
  const messagesContainer = document.getElementById('messages-container');

  let fireworksRunning = false;
  let animationId = null;
  let ytPlayer = null;

  initVideo();

  // Kiểm tra đã đăng nhập trong session
  if (sessionStorage.getItem('graduation_unlocked') === 'true') {
    showCongrats();
  }

  function initVideo() {
    const { type, localSrc, youtubeId } = CONFIG.video;

    if (type === 'youtube' && youtubeId) {
      video.classList.add('hidden');
      youtubePlayerEl.classList.remove('hidden');
      loadYouTubePlayer(youtubeId);
      return;
    }

    video.classList.remove('hidden');
    youtubePlayerEl.classList.add('hidden');
    video.src = localSrc;
    video.load();
  }

  function loadYouTubePlayer(videoId) {
    const id = extractYouTubeId(videoId);
    if (!id) {
      showVideoError('Mã YouTube không hợp lệ trong config.js');
      return;
    }

    if (window.YT && window.YT.Player) {
      createYouTubePlayer(id);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = () => createYouTubePlayer(id);
    document.head.appendChild(tag);
  }

  function createYouTubePlayer(videoId) {
    ytPlayer = new YT.Player('youtube-player', {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) startCelebration();
        },
      },
    });
  }

  function extractYouTubeId(value) {
    const match = String(value).match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : (value.length === 11 ? value : '');
  }

  // Xử lý nhập mã từng ô
  codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val.slice(-1);
      errorMsg.textContent = '';

      if (val) {
        e.target.classList.add('filled');
        if (index < codeInputs.length - 1) {
          codeInputs[index + 1].focus();
        }
      } else {
        e.target.classList.remove('filled');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        codeInputs[index - 1].focus();
        codeInputs[index - 1].value = '';
        codeInputs[index - 1].classList.remove('filled');
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 8);
      pasted.split('').forEach((char, i) => {
        if (codeInputs[i]) {
          codeInputs[i].value = char;
          codeInputs[i].classList.add('filled');
        }
      });
      const focusIndex = Math.min(pasted.length, codeInputs.length - 1);
      codeInputs[focusIndex].focus();
    });
  });

  codeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = Array.from(codeInputs).map((inp) => inp.value).join('');

    if (code.length !== 8) {
      showError('Vui lòng nhập đủ 8 số');
      return;
    }

    if (code === CONFIG.securityCode) {
      sessionStorage.setItem('graduation_unlocked', 'true');
      showCongrats();
    } else {
      showError('Mã không đúng, thử lại nhé!');
      codeInputs.forEach((inp) => {
        inp.classList.add('error');
        setTimeout(() => inp.classList.remove('error'), 500);
      });
      codeInputs[0].focus();
    }
  });

  function showError(msg) {
    errorMsg.textContent = msg;
  }

  function showCongrats() {
    loginScreen.classList.remove('active');
    congratsScreen.classList.add('active');
    resizeCanvas();
  }

  // Video kết thúc → pháo hoa + lời chúc
  video.addEventListener('ended', () => {
    startCelebration();
  });

  video.addEventListener('error', () => {
    showVideoError(`Không tải được video: ${CONFIG.video.localSrc}`);
    addFallbackButton();
  });

  function showVideoError(msg) {
    const hint = document.querySelector('.video-hint');
    if (hint) {
      hint.textContent = `⚠ ${msg}. Nhấn nút bên dưới để xem pháo hoa!`;
      hint.style.color = '#ffd700';
    }
  }

  function addFallbackButton() {
    if (document.getElementById('fallback-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'fallback-btn';
    btn.className = 'btn-primary';
    btn.textContent = '🎆 Xem pháo hoa & lời chúc';
    btn.style.marginTop = '1rem';
    btn.addEventListener('click', startCelebration);
    document.querySelector('.video-wrapper').appendChild(btn);
  }

  function startCelebration() {
    if (fireworksRunning) return;
    fireworksRunning = true;

    postVideoContent.classList.remove('hidden');
    renderWishes();
    startFireworks();
    spawnFloatingMessages();
  }

  function renderWishes() {
    wishesList.innerHTML = '';
    CONFIG.wishes.forEach((wish, i) => {
      const li = document.createElement('li');
      li.textContent = wish;
      li.style.animationDelay = `${i * 0.3}s`;
      wishesList.appendChild(li);
    });
  }

  // ===== PHÁO HOA CANVAS =====
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor(x, y, color, velocity, size, decay) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = velocity;
      this.size = size;
      this.alpha = 1;
      this.decay = decay;
      this.gravity = 0.04;
    }

    update() {
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    const colors = ['#ffd700', '#ff6b9d', '#c471ed', '#00d2ff', '#ff4757', '#2ed573', '#ffa502'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 60 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 2 + Math.random() * 4;
      particles.push(new Particle(
        x, y, color,
        { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        2 + Math.random() * 2,
        0.008 + Math.random() * 0.012
      ));
    }
  }

  function animateFireworks() {
    ctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.08) createFirework();

    particles = particles.filter((p) => p.alpha > 0);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animateFireworks);
  }

  function startFireworks() {
    resizeCanvas();
    for (let i = 0; i < 5; i++) {
      setTimeout(createFirework, i * 300);
    }
    if (!animationId) animateFireworks();
  }

  // ===== LỜI CHÚC BAY =====
  function spawnFloatingMessages() {
    const messages = CONFIG.wishes;
    let index = 0;

    function spawnOne() {
      if (index >= messages.length * 2) return;

      const el = document.createElement('div');
      el.className = 'floating-message';
      el.textContent = messages[index % messages.length];
      el.style.left = `${10 + Math.random() * 70}%`;
      el.style.top = `${15 + Math.random() * 60}%`;
      el.style.animationDelay = '0s';
      messagesContainer.appendChild(el);

      setTimeout(() => el.remove(), 4500);
      index++;
      setTimeout(spawnOne, 1200);
    }

    spawnOne();
  }
})();
