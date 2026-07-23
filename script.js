/* ================= Starfield canvas with parallax + shooting stars ================= */
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  function resizeCanvas(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const STAR_COUNT = 140;
  for(let i=0;i<STAR_COUNT;i++){
    stars.push({
      x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.4 + 0.3,
      baseAlpha: Math.random()*0.5 + 0.15, phase: Math.random()*Math.PI*2,
      speed: Math.random()*0.02 + 0.008, parallax: Math.random()*0.5 + 0.1
    });
  }

  let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5);
    targetMouseY = (e.clientY / window.innerHeight - 0.5);
  });

  let shootingStar = null;
  function maybeSpawnShootingStar(){
    if(!shootingStar && Math.random() < 0.004){
      const startX = Math.random()*W*0.6;
      shootingStar = { x: startX, y: -10, vx: 5+Math.random()*3, vy: 3+Math.random()*2, life: 1 };
    }
  }

  let t = 0;
  function drawStars(){
    t += 1;
    mouseX += (targetMouseX - mouseX)*0.03;
    mouseY += (targetMouseY - mouseY)*0.03;
    ctx.clearRect(0,0,W,H);
    stars.forEach(s => {
      const alpha = s.baseAlpha + Math.sin(t*s.speed + s.phase)*0.25;
      const px = s.x + mouseX * 22 * s.parallax;
      const py = s.y + mouseY * 22 * s.parallax;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(245,233,220,' + Math.max(0,Math.min(1,alpha)) + ')';
      ctx.fill();
    });
    maybeSpawnShootingStar();
    if(shootingStar){
      const s = shootingStar;
      ctx.strokeStyle = 'rgba(232,146,124,' + s.life + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx*8, s.y - s.vy*8);
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.02;
      if(s.life <= 0 || s.x > W || s.y > H) shootingStar = null;
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ================= Fireflies ================= */
  const fireContainer = document.getElementById('fireflies');
  for(let i=0;i<16;i++){
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = Math.random()*100+'%';
    f.style.top = Math.random()*100+'%';
    f.style.setProperty('--dx', (Math.random()*60-30)+'px');
    f.style.setProperty('--dy', (Math.random()*60-30)+'px');
    f.style.animationDuration = (6+Math.random()*6)+'s, ' + (2.5+Math.random()*2)+'s';
    f.style.animationDelay = (Math.random()*5)+'s, ' + (Math.random()*3)+'s';
    fireContainer.appendChild(f);
  }

  /* ================= Dual clock (You: IST, Her: Canada/Eastern) ================= */
  function updateClocks(){
    const now = new Date();
    const you = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true, timeZone:'Asia/Kolkata' });
    const her = now.toLocaleTimeString('en-CA', { hour:'2-digit', minute:'2-digit', hour12:true, timeZone:'America/Toronto' });
    document.getElementById('clockYou').textContent = you;
    document.getElementById('clockHer').textContent = her;
  }
  updateClocks();
  setInterval(updateClocks, 1000*30);

  /* ================= Sound effects removed per request — chime() is now a silent no-op ================= */
  function chime(){ /* music/sound removed */ }

  /* ================= Birthday badge (born 28 July 2004) ================= */
  const BDAY_MONTH = 6; // 0-indexed: 6 = July
  const BDAY_DAY = 28;
  const BDAY_YEAR = 2004;
  function updateBdayBadge(){
    const badge = document.getElementById('bdayBadge');
    const line = document.getElementById('bdayLine');
    if(!badge || !line) return;

    const now = new Date();
    const isToday = (now.getMonth() === BDAY_MONTH && now.getDate() === BDAY_DAY);
    const turningAge = now.getFullYear() - BDAY_YEAR;

    if(isToday){
      badge.classList.add('today');
      line.textContent = "Happy " + ordinal(turningAge) + " Birthday, Bacha! \uD83C\uDF82";
      return;
    }

    badge.classList.remove('today');
    let target = new Date(now.getFullYear(), BDAY_MONTH, BDAY_DAY);
    if(target < now){ target = new Date(now.getFullYear() + 1, BDAY_MONTH, BDAY_DAY); }
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((target - now) / msPerDay);
    const ageThatBday = target.getFullYear() - BDAY_YEAR;
    line.textContent = daysLeft + (daysLeft === 1 ? " day" : " days") + " until she turns " + ageThatBday;
  }
  function ordinal(n){
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  updateBdayBadge();
  setInterval(updateBdayBadge, 1000 * 60 * 60); // refresh hourly is enough

  /* ================= Background music removed per request ================= */

  /* ================= Confetti burst ================= */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cctx = confettiCanvas.getContext('2d');
  let CW, CH, confettiParticles = [];
  function resizeConfetti(){ CW = confettiCanvas.width = window.innerWidth; CH = confettiCanvas.height = window.innerHeight; }
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);
  const CONFETTI_COLORS = ['#FF3D6E', '#FFB238', '#FF7EA6', '#FFF7F0', '#B15CDE'];
  function burstConfetti(x, y, count){
    x = (typeof x === 'number') ? x : CW / 2;
    y = (typeof y === 'number') ? y : CH / 3;
    count = count || 60;
    for(let i = 0; i < count; i++){
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      confettiParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1
      });
    }
  }
  function drawConfetti(){
    cctx.clearRect(0, 0, CW, CH);
    confettiParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.rotation += p.rotSpeed; p.life -= 0.012;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rotation * Math.PI / 180);
      cctx.globalAlpha = Math.max(0, p.life);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      cctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < CH + 40);
    requestAnimationFrame(drawConfetti);
  }
  drawConfetti();

  /* ================= Password gate (big keypad) ================= */
  const PASSCODE = "2128";
  const passError = document.getElementById('passError');
  const passDisplay = document.getElementById('passDisplay');
  let enteredCode = '';

  function renderPassDisplay(){
    if(enteredCode.length === 0){
      passDisplay.textContent = 'Enter code';
      passDisplay.classList.add('placeholder');
    } else {
      passDisplay.textContent = '\u2022'.repeat(enteredCode.length);
      passDisplay.classList.remove('placeholder');
    }
  }

  function keypadPress(digit){
    if(enteredCode.length >= 6) return;
    enteredCode += digit;
    renderPassDisplay();
    chime(520 + enteredCode.length*10);
  }

  function keypadClear(){
    enteredCode = '';
    renderPassDisplay();
    passError.classList.remove('show');
  }

  function keypadEnter(){
    checkPassword();
  }

  function checkPassword(){
    if(enteredCode === PASSCODE){
      chime(660);
      document.getElementById('eggWrap').classList.add('cracked');
      burstConfetti(window.innerWidth/2, window.innerHeight/2.4, 70);
      setTimeout(() => goTo(1), 1200);
    } else {
      passError.classList.remove('show');
      void passError.offsetWidth;
      passError.classList.add('show');
      enteredCode = '';
      renderPassDisplay();
    }
  }

  document.addEventListener('keydown', (e) => {
    const passScreen = document.getElementById('password');
    if(!passScreen || !passScreen.classList.contains('active')) return;
    if(e.key >= '0' && e.key <= '9') keypadPress(e.key);
    else if(e.key === 'Backspace') { enteredCode = enteredCode.slice(0, -1); renderPassDisplay(); }
    else if(e.key === 'Enter') keypadEnter();
  });

  renderPassDisplay();

  /* ================= Yes/No game ================= */
  function chooseNo(){
    chime(220);
    document.getElementById('question').classList.remove('active');
    document.getElementById('locked').classList.add('active');
  }

  function retryQuestion(){
    document.getElementById('locked').classList.remove('active');
    document.getElementById('question').classList.add('active');
    document.getElementById('gameMsg').textContent = '\u00a0';
  }

  function celebrateYes(){
    const btn = document.getElementById('yesBtn');
    const rect = btn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width/2, rect.top, 70);
    chime(880);
    setTimeout(() => goTo(2), 350);
  }

  /* ================= Envelope open ================= */
  function openEnvelope(){
    const env = document.getElementById('envelope');
    if(env.classList.contains('open')) return;
    env.classList.add('open');
    document.getElementById('openHint').style.display = 'none';
    document.getElementById('openBtn').classList.add('show');
    chime(660);
  }

  /* ================= Constellation (heart shape) ================= */
  const NS = 'http://www.w3.org/2000/svg';
  const constSvg = document.getElementById('constSvg');
  const constPoints = [];

  const slides = [
    { src: "bacha1.png",  caption: "Every great story begins with a single 'yes'. Choosing you today, tomorrow, and every day." },
    { src: "bacha2.jpg",  caption: "Dreams demand patience, they answered back 🎓🌸. A milestone earned with quiet determination." },
    { src: "bacha3.jpeg",  caption: "Some smiles don't need an audience 🤍. Soft on the outside, steady underneath." },
    { src: "bacha4.png",  caption: "Two hearts. One direction. Some connections don't need explanations." },
    { src: "bacha5.jpg",  caption: "Sunlight suits her more than most things do ✨. Nothing tries too hard, and nothing needs to." },
    { src: "bacha6.jpg",  caption: "Flowers fade. Character blooms 🌹. Confidence is the most beautiful thing you can wear." },
    { src: "bacha7.jpeg",  caption: "Building a future through compassion and purpose. Every step forward begins with serving others 💙." },
    { src: "bacha8.jpeg",  caption: "No filter, no performance ☁️. Just her, mid-thought, mid-morning." },
    { src: "bacha9.jpeg",  caption: "A smile that speaks before words ever could ✨. Happiness looks good in every light." },
    { src: "bacha10.jpeg", caption: "Rooted in tradition, unbothered by the frame 🌸. Some pictures are more feeling than pose." },
    { src: "bacha11.jpeg", caption: "Classic never competes 🖤. Timeless over trendy." },
    { src: "bacha12.jpeg", caption: "The best moments are rarely planned — a teddy bear and a laugh mid-photo say enough." },
    { src: "bacha13.jpeg", caption: "Confidence is quiet, style is effortless — simple, elegant, unforgettable ❤️." },
    { src: "bacha14.jpeg", caption: "Her eyes are poetry written in silence ✨. Not just beautiful eyes — beautiful intentions." },
    { src: "bacha15.jpeg", caption: "In a world full of people, this is my favorite one to come home to ❤️. Different journeys, one frame." },
  ];
  const N = slides.length;

  for(let i=0;i<N;i++){
    const tt = (i / N) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(tt), 3);
    const hy = 13*Math.cos(tt) - 5*Math.cos(2*tt) - 2*Math.cos(3*tt) - Math.cos(4*tt);
    const x = 150 + hx * 6.2;
    const y = 150 - hy * 6.2;
    constPoints.push({x, y});
  }
  const lineEls = [];
  for(let i=0;i<N;i++){
    const a = constPoints[i], b = constPoints[(i+1)%N];
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.setAttribute('class', 'const-line');
    constSvg.appendChild(line);
    lineEls.push(line);
  }
  const dotEls = [];
  constPoints.forEach((p) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 3);
    c.setAttribute('class', 'const-dot');
    constSvg.appendChild(c);
    dotEls.push(c);
  });

  function updateConstellation(idx){
    dotEls.forEach((d, i) => d.classList.toggle('on', i < idx));
    lineEls.forEach((l, i) => l.classList.toggle('on', i < idx - 1 + (idx === N ? 1 : 0)));
    document.getElementById('constellation').classList.toggle('complete', idx >= N);
  }

  const slideImg = document.getElementById('slideImg');
  const slideFallback = document.getElementById('slideFallback');
  const fallbackText = document.getElementById('fallbackText');
  const slideIndex = document.getElementById('slideIndex');
  const slideCaption = document.getElementById('slideCaption');
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const postcard = document.getElementById('postcard');

  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    d.id = 'dot'+i;
    dotsWrap.appendChild(d);
  });

  let current = 0;
  let maxSeen = 1;

  function renderSlide(animate){
    const s = slides[current];
    slideImg.style.display = 'block';
    slideFallback.style.display = 'none';
    slideImg.src = s.src;
    slideImg.alt = "Photo " + (current+1);
    fallbackText.textContent = "photo " + (current+1) + " — add your picture here";
    slideIndex.textContent = "Letter " + String(current+1).padStart(2,'0') + " / " + slides.length;
    slideCaption.textContent = s.caption;

    slides.forEach((_, i) => document.getElementById('dot'+i).classList.toggle('on', i === current));

    prevBtn.disabled = (current === 0);
    nextBtn.innerHTML = (current === slides.length - 1) ? '&#10084;' : '&#8594;';

    maxSeen = Math.max(maxSeen, current + 1);
    updateConstellation(maxSeen);

    if(animate){
      postcard.classList.remove('entering');
      void postcard.offsetWidth;
      postcard.classList.add('entering');
    }
  }

  function nextSlide(){
    if(current < slides.length - 1){
      current++;
      chime(520 + current*8);
      renderSlide(true);
    } else {
      burstConfetti(window.innerWidth/2, window.innerHeight/2.5, 55);
      playShootingTransition(() => goTo(4));
    }
  }
  function prevSlide(){
    if(current > 0){
      current--;
      chime(420);
      renderSlide(true);
    }
  }

  function playShootingTransition(cb){
    const el = document.getElementById('shootTransition');
    el.style.background = 'radial-gradient(circle at 50% 50%, rgba(217,101,75,0.45), rgba(255,248,233,0.0) 60%)';
    el.classList.add('play');
    chime(880);
    setTimeout(() => { el.classList.remove('play'); cb(); }, 500);
  }

  if(window.matchMedia('(hover: hover)').matches){
    document.getElementById('gallery').addEventListener('mousemove', (e) => {
      const rect = postcard.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      postcard.style.transform = 'rotateY(' + (dx*6) + 'deg) rotateX(' + (-dy*6) + 'deg)';
    });
    document.getElementById('gallery').addEventListener('mouseleave', () => {
      postcard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  let touchStartX = null;
  const galleryScreen = document.getElementById('gallery');
  galleryScreen.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
  galleryScreen.addEventListener('touchend', (e) => {
    if(touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(dx < -40) nextSlide();
    else if(dx > 40) prevSlide();
    touchStartX = null;
  });

  /* ================= Screen navigation ================= */
  /* 0 password, 1 question, 2 cover, 3 gallery, 4 jar, 5 scratch, 6 memorymatch, 7 finale
     ('locked' is shown/hidden separately, outside this indexed flow) */
  const screens = [
    document.getElementById('password'),
    document.getElementById('question'),
    document.getElementById('cover'),
    document.getElementById('gallery'),
    document.getElementById('jar'),
    document.getElementById('scratch'),
    document.getElementById('memorymatch'),
    document.getElementById('finale')
  ];

  function goTo(screenIdx){
    screens.forEach((sc, i) => sc.classList.toggle('active', i === screenIdx));
    if(screenIdx === 3){
      current = 0;
      renderSlide(true);
    }
    if(screenIdx === 4){
      jarIndex = -1;
      document.getElementById('jarContinueBtn').classList.remove('show');
      nextJarNote();
    }
    if(screenIdx === 6){
      renderMemoryMatch();
    }
    if(screenIdx === 7){
      burstConfetti(window.innerWidth/2, window.innerHeight/3, 50);
      setupLetterReveal();
    }
    document.getElementById('chickCompanion').classList.toggle('show', screenIdx >= 2);
  }

  function restartAll(){
    document.getElementById('envelope').classList.remove('open');
    document.getElementById('openHint').style.display = 'block';
    document.getElementById('openBtn').classList.remove('show');
    maxSeen = 1;
    updateConstellation(0);
    goTo(2);
  }

  /* ================= Jar of love ================= */
  /* EDIT ME: change these reasons to your own — they cycle one at a
     time and she must go through all of them before Continue appears. */
  const jarNotes = [
    "Because you said yes, and my whole world made sense after that.",
    "Because your graduation photo is proof you can do anything you set your mind to.",
    "Because even an ocean between us can't make you feel far.",
    "Because 'accha' from you fixes moods I didn't even know were broken.",
    "Because you make mornings feel closer to home, no matter the time zone.",
    "Because you're patient with me on days I don't deserve it.",
    "Because your laugh is my favourite background music.",
    "Because you never stopped believing in us, not even for a second.",
    "Because being your boy is the only title I've ever wanted to keep forever.",
    "Because one day 'goodnight, bacha' will be said in the same room, not through a screen.",
    "Because you make studying abroad look graceful, and homesickness look brave.",
    "Because loving you is the easiest, best decision I've ever made."
  ];
  let jarIndex = -1;
  const jarNoteEl = document.getElementById('jarNote');
  const jarDotsWrap = document.getElementById('jarDots');
  jarNotes.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    d.id = 'jdot' + i;
    jarDotsWrap.appendChild(d);
  });

  function nextJarNote(){
    jarIndex++;
    if(jarIndex >= jarNotes.length){
      jarIndex = jarNotes.length - 1;
      document.getElementById('jarContinueBtn').classList.add('show');
      return;
    }
    jarNoteEl.classList.remove('in');
    void jarNoteEl.offsetWidth;
    jarNoteEl.textContent = jarNotes[jarIndex];
    jarNoteEl.classList.add('in');
    jarNotes.forEach((_, i) => document.getElementById('jdot'+i).classList.toggle('on', i <= jarIndex));
    chime(500 + jarIndex*10);
    if(jarIndex === jarNotes.length - 1){
      setTimeout(() => document.getElementById('jarContinueBtn').classList.add('show'), 500);
    }
  }

  /* ================= Scratch to reveal ================= */
  let scratchDone = false;
  function initScratch(){
    const canvas = document.getElementById('scratchCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    function paintCoating(){
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#F2A65A');
      grad.addColorStop(1, '#E8577A');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '13px sans-serif';
      for(let i = 0; i < 26; i++){
        ctx.fillText('\u2764', Math.random()*w, Math.random()*h);
      }
    }
    paintCoating();

    let isDown = false, moveCount = 0;
    function getPos(e){
      const rect = canvas.getBoundingClientRect();
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - rect.left) * (w / rect.width), y: (clientY - rect.top) * (h / rect.height) };
    }
    function scratchAt(x, y){
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI*2);
      ctx.fill();
    }
    function checkComplete(){
      if(scratchDone) return;
      const data = ctx.getImageData(0, 0, w, h).data;
      let cleared = 0, sampled = 0;
      for(let i = 3; i < data.length; i += 4*30){
        sampled++;
        if(data[i] < 10) cleared++;
      }
      if(cleared / sampled > 0.5){
        scratchDone = true;
        ctx.clearRect(0, 0, w, h);
        const hint = document.getElementById('scratchHint');
        if(hint) hint.style.display = 'none';
        document.getElementById('scratchContinueBtn').classList.add('show');
        burstConfetti(window.innerWidth/2, window.innerHeight/2.6, 40);
      }
    }
    canvas.addEventListener('pointerdown', (e) => {
      isDown = true;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      chime(620);
    });
    canvas.addEventListener('pointermove', (e) => {
      if(!isDown || scratchDone) return;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      moveCount++;
      if(moveCount % 8 === 0) checkComplete();
    });
    window.addEventListener('pointerup', () => {
      if(isDown) checkComplete();
      isDown = false;
    });
  }

  /* ================= Memory match game ================= */
  /* EDIT ME: swap these for any 6 of your own photo filenames */
  const matchPhotos = ["bacha1.png", "bacha2.jpg", "bacha4.png", "bacha6.jpg", "bacha9.jpeg", "bacha13.jpeg"];
  let matchRendered = false, matchDeck = [], matchFlipped = [], matchLock = false, matchMatched = 0;
  function shuffleArr(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function renderMemoryMatch(){
    if(matchRendered) return;
    matchRendered = true;
    const grid = document.getElementById('matchGrid');
    matchDeck = shuffleArr([...matchPhotos, ...matchPhotos]);
    matchDeck.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'match-card';
      card.dataset.photo = photo;
      card.innerHTML =
        '<div class="match-card-inner">' +
          '<div class="match-card-face match-card-back">&#9825;</div>' +
          '<div class="match-card-face match-card-front"><img src="' + photo + '" alt=""></div>' +
        '</div>';
      card.addEventListener('click', () => flipMatchCard(card));
      grid.appendChild(card);
    });
  }
  function flipMatchCard(card){
    if(matchLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    chime(600);
    matchFlipped.push(card);
    if(matchFlipped.length === 2){
      matchLock = true;
      const [a, b] = matchFlipped;
      if(a.dataset.photo === b.dataset.photo){
        a.classList.add('matched'); b.classList.add('matched');
        matchMatched++;
        matchFlipped = [];
        matchLock = false;
        chime(880);
        if(matchMatched === matchPhotos.length){
          burstConfetti(window.innerWidth/2, window.innerHeight/3, 60);
          document.getElementById('matchSub').textContent = "Every single pair — just like us.";
          document.getElementById('matchContinueBtn').classList.add('show');
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped'); b.classList.remove('flipped');
          matchFlipped = [];
          matchLock = false;
        }, 800);
      }
    }
  }

  /* ================= Chick companion ================= */
  const chickMessages = [
    "hi boo \uD83D\uDC23",
    "your bacha's boy is right here",
    "miss you more than this chick can say",
    "tap me anytime \uD83D\uDC9B"
  ];
  let chickIdx = 0;
  function chickChirp(){
    const msg = document.getElementById('chickMsg');
    msg.textContent = chickMessages[chickIdx % chickMessages.length];
    chickIdx++;
    msg.classList.add('show');
    chime(700);
    clearTimeout(window._chickTimer);
    window._chickTimer = setTimeout(() => msg.classList.remove('show'), 2200);
  }

  document.addEventListener('keydown', (e) => {
    if(!galleryScreen.classList.contains('active')) return;
    if(e.key === 'ArrowRight') nextSlide();
    if(e.key === 'ArrowLeft') prevSlide();
  });

  /* ================= Print the letter ================= */
  function printLetter(){
    window.print();
  }

  /* ================= Letter scroll reveal ================= */
  let letterObserver = null;
  function setupLetterReveal(){
    const paras = document.querySelectorAll('#letterBox p, #letterBox .sign');
    if(letterObserver) letterObserver.disconnect();
    letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); } });
    }, { threshold: 0.2 });
    paras.forEach(p => letterObserver.observe(p));
  }

  updateConstellation(0);
  renderSlide(false);
  initScratch();