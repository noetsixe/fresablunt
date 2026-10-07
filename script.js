/* =========================================
   FRESA BLUNT — INTRO GAME
   ========================================= */
const strawberry = document.getElementById("strawberry");
const blunt = document.getElementById("blunt");
const intro = document.getElementById("intro");
const introBackground = document.getElementById("intro-background");
const impact = document.getElementById("impact");
const impactFlash = document.querySelector(".impact-flash");
const transition = document.getElementById("transition");
const mainSite = document.getElementById("main-site");
const strawberryImage = document.querySelector(".pixel-strawberry");
const shineCanvas = document.getElementById("strawberry-shine");
const shineCtx = shineCanvas.getContext("2d");
const scoreValue = document.getElementById("score-value");
const bgMusic = document.getElementById("bg-music");
const gameMortal = new Audio("./GAMEMORTAL.mp3");
gameMortal.preload = "auto";
const soundToggle = document.getElementById("sound-toggle");
const focusVignette = document.getElementById("focus-vignette");
const soundLabel = document.getElementById("sound-label");
const splashBrand = document.getElementById("splash-brand");
const splashName = document.getElementById("splash-name");
const splashYear = document.getElementById("splash-year");
const hAnimation = document.getElementById("h-animation");

let spotifyController = null;
let spotifyReplayBlocked = false;

/* =========================================
   MEMORIA DE ENTRADA — 24 HORAS
   ========================================= */

const ENTRY_MEMORY_KEY = "fresaEnteredAt";
const ENTRY_MEMORY_TIME = 24 * 60 * 60 * 1000;

const savedEntryTime = Number(
  localStorage.getItem(ENTRY_MEMORY_KEY)
);

const returningVisitor =
  Number.isFinite(savedEntryTime) &&
  Date.now() - savedEntryTime < ENTRY_MEMORY_TIME;


bgMusic.volume = 0.60;
let audioStartTime = performance.now();
let audioMuted = true;
let audioUnlocked = false;

/* =========================================
   AUDIO: EMPEZAR DESDE LA ENTRADA
   ========================================= */
bgMusic.muted = true;
bgMusic.play()
  .then(() => {
    /* El navegador permitió el autoplay. La canción avanza desde 0:00, pero está silenciosa. */
    audioUnlocked = true;
  })
  .catch(() => {
    /* El navegador bloqueó el autoplay. El tiempo seguirá contando desde que entró la página. */
    audioUnlocked = false;
  });

/* =========================================
   CONTROL DE SONIDO
   ========================================= */
soundToggle.addEventListener("click", async () => {
  if (audioMuted) {
    /* Si el autoplay fue bloqueado, calculamos en qué segundo debería estar. */
    if (!audioUnlocked) {
      const elapsed = (performance.now() - audioStartTime) / 1000;
      if (Number.isFinite(bgMusic.duration) && bgMusic.duration > 0) {
        bgMusic.currentTime = elapsed % bgMusic.duration;
      } else {
        bgMusic.currentTime = elapsed;
      }
    }
    bgMusic.muted = false;
    try {
      await bgMusic.play();
      audioUnlocked = true;
      audioMuted = false;
      soundToggle.classList.add("is-on");
      soundToggle.setAttribute("aria-pressed", "true");
      soundToggle.setAttribute("aria-label", "Apagar sonido");
      soundLabel.textContent = "ON";
    } catch (error) {
      console.log("No se pudo iniciar el audio:", error);
    }
  } else {
    /* No detenemos la canción. Solo quitamos el sonido. */
    bgMusic.muted = true;
    audioMuted = true;
    soundToggle.classList.remove("is-on");
    soundToggle.setAttribute("aria-pressed", "false");
    soundToggle.setAttribute("aria-label", "Activar sonido");
    soundLabel.textContent = "OFF";
  }
});

/* =========================================
   SPOTIFY — REPRODUCTOR FLOTANTE
   ========================================= */

window.onSpotifyIframeApiReady = (IFrameAPI) => {

  const element = document.getElementById("spotify-embed");

  if (!element) return;

  const options = {
    width: "100%",
    height: "152",
    uri: "spotify:playlist:5d1xHYxXLiQb480Zs9787P"
  };

  IFrameAPI.createController(
    element,
    options,
    (EmbedController) => {
  spotifyController = EmbedController;

  if (returningVisitor && !spotifyReplayBlocked) {
  spotifyController.play().catch(() => {});
}
}
  );
};


let visits = Number(localStorage.getItem("fresaVisits") || 0);
visits++;
localStorage.setItem("fresaVisits", visits);
scoreValue.textContent = String(visits).padStart(6, "0");

const shineColors = [
  "#ff6bb5",
  "#ff9d5c",
  "#ffe66d",
  "#8ee6a0",
  "#70d9e8",
  "#819cff",
  "#bd82ed"
];
const shineImages = [];
let shineReady = false;
let shineStart = performance.now();
let started = false;
let strawberryPaused = false;
let frame = 1;
let direction = 1;


/* =========================================
   MENSAJES ALEATORIOS DEL INTRO
   ========================================= */

const introMessages = [
  "¿QUIERES PROBARLO?",
  "QUÉDATE Y DISFRUTEMOS EL ESPACIO.",
  "NO TODO LO DULCE ES SUAVE.",
  "RECUERDA PRESIONAR LA FRESA.",
  "NO TE VAYAS.",
  "NO PARPADEES. EN SERIO.",
  "¿YA HAS ESTADO AQUÍ ANTES?",
  "NADA ES CASUALIDAD.",
  "SOLO EN TU MIRAR...",
  "...FANTASÍA LUNAR.",
  "BUENA SUERTE. LA VAS A NECESITAR.",
  "¿CÓMO LLEGASTE TAN LEJOS?",
  "DEMASIADO TARDE PARA IRTE.",
  "TOO SWEET.",
  "CUIDADO CON LA FRESA.",
  "NO TOQUES LA FRESA.",
  "¿TE GUSTAN LOS VIDEOJUEGOS?",
  "SÉ LO QUE ESTÁS PENSANDO.",
  "¿FB?",
  "PUEDES IGNORAR ESTE MENSAJE.",
  "ESPERA EL TUMPA TUMPA.",
  "¿ODIAS EL REGUETÓN?",
  "¿QUÉ #%& ES TUNDARA?",
  "¿ESTÁS SEGURO DE QUE SABES DÓNDE ESTÁS?",
  "SI ESTÁS ESPERANDO ALGO, NOSOTROS TAMBIÉN.",
  "NO SABEMOS QUIÉN TE DEJÓ ENTRAR.",
  "¿QUIÉN TE DIJO QUE PODÍAS TOCAR LA FRESA?",
  "LA FRESA PARECE TRANQUILA. ESO DEBERÍA PREOCUPARTE.",
  "¿VINISTE POR LA FRESA O POR LO QUE VIENE DESPUÉS?",
  "SI ESTÁS LEYENDO ESTO, PROBABLEMENTE ESTÁS IGNORANDO EL OBJETIVO PRINCIPAL.",
  "NO SABEMOS CUÁNTAS VIDAS TE QUEDAN, PERO ESTA PANTALLA NO VA A ESPERAR PARA SIEMPRE.",
  "SI ALGO PARECE FUERA DE LUGAR, PROBABLEMENTE LO PUSIMOS AHÍ A PROPÓSITO.",
  "NO SABEMOS QUÉ PASA DESPUÉS. PERO SERÍA MUY RARO QUE TE FUERAS AHORA.",
  "¿QUÉ ESPERAS PARA ACTIVAR EL AUDIO?",
  "NO SABEMOS QUIÉN PROGRAMÓ ESTO. PERO TENÍA BUEN GUSTO.",
  "¿ESTE ES UN VIDEOJUEGO O QUÉ?",
  "¡QUE VIVA EL ROCK!",
  "ME SIENTO SOLO. ¿TE QUEDAS CONMIGO?",
  "PUM PUM..pum pum... PUM PUM..pum pum...",
  "HMMM... CANCACHO"
];

const introMessage = document.getElementById("intro-message");

let messageTimer = null;
let lastMessageIndex = -1;
let messagesStopped = false;

function showRandomMessage() {
  if (messagesStopped || !introMessage) return;

  let index;

  do {
    index = Math.floor(Math.random() * introMessages.length);
  } while (index === lastMessageIndex && introMessages.length > 1);

  lastMessageIndex = index;

  introMessage.textContent = introMessages[index];
  introMessage.classList.add("message-visible");

  messageTimer = setTimeout(() => {
    introMessage.classList.remove("message-visible");

    messageTimer = setTimeout(() => {
      showRandomMessage();
    }, 2500);

  }, 8000);
}

function stopIntroMessages() {
  messagesStopped = true;

  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  if (introMessage) {
    introMessage.classList.remove("message-visible");
  }
}

setTimeout(() => {
  showRandomMessage();
}, 5000);

/* =========================================
   ANIMACIÓN IDLE DE LA FRESA
   ========================================= */
function animateStrawberry() {
   if (strawberryPaused) return;
  const sprite = `url("./Fresa${frame}.png")`;
  strawberryImage.style.backgroundImage = sprite;
  strawberryImage.style.setProperty("--strawberry-mask", sprite);
  frame += direction;
  if (frame >= 6) {
    frame = 6;
    direction = -1;
  }
  if (frame <= 1) {
    frame = 1;
    direction = 1;
  }
  setTimeout(animateStrawberry, 110);
}
animateStrawberry();

/* =========================================
   PREPARAR DESTELLO
   ========================================= */
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.onload = () => {
    shineImages[i] = img;
    if (i === 6) {
      shineReady = true;
      shineCanvas.width = img.naturalWidth;
      shineCanvas.height = img.naturalHeight;
      shineCtx.imageSmoothingEnabled = false;
      animateRainbowShine();
    }
  };
  img.src = `./Fresa${i}.png`;
}

/* =========================================
   PRECARGAR FRAMES DE LA FRESA
   ========================================= */
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `./Fresa${i}.png`;
}

/* =========================================
   CLICK / TOUCH EN LA FRESA
   ========================================= */
function vibrateDevice(pattern = 100) {
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // El dispositivo simplemente no soporta vibración
  }
}

strawberry.addEventListener("click", () => {
  stopIntroMessages();
  vibrateDevice([80, 40, 140]);

  gameMortal.currentTime = 0;
  gameMortal.muted = false;
  gameMortal.play().catch(() => {});
   
  starfieldPaused = true;
   
  const hud = document.querySelector(".arcade-hud");
  const soundToggle = document.getElementById("sound-toggle");
  hud.classList.add("hud-vanish");
  soundToggle.classList.add("hud-vanish");
  intro.classList.add("press-start-hide");
  bgMusic.pause();
  bgMusic.currentTime = 0;
  bgMusic.muted = true;
  soundToggle.classList.remove("is-on");
  soundToggle.setAttribute("aria-pressed", "false");
  soundToggle.setAttribute("aria-label", "Activar sonido");
  soundLabel.textContent = "OFF";

  if (started) return;
  started = true;
strawberryPaused = true;
  strawberry.style.pointerEvents = "none";
  strawberry.classList.add("strawberry-hit");

  setTimeout(() => {
    // Primer parpadeo
    vibrateDevice([25]);
strawberry.style.visibility = "hidden";
    setTimeout(() => {
      strawberry.style.visibility = "visible";
      // Segundo parpadeo
      setTimeout(() => {
        vibrateDevice([25]);
strawberry.style.visibility = "hidden";
        setTimeout(() => {
  strawberry.style.visibility = "visible";

setTimeout(() => {
  strawberryPaused = false;
  animateStrawberry();
}, 500);

  const introBackground = document.getElementById("intro-background");
  introBackground.classList.add("stars-fade-out");
  focusVignette.classList.add("focus-active");

  setTimeout(() => {
    dropBlunt();
  }, 300);
}, 180);
      }, 180);
    }, 180);
  }, 600);
});

/* =========================================
   CAÍDA DEL BLUNT
   ========================================= */
/* CAÍDA DEL BLUNT */
const bluntFrames = [];
for (let i = 0; i < 12; i++) {
  const img = new Image();
  img.src = `./pixil-frame-${i}.png`;
  bluntFrames.push(img);
}

/* FRAMES BB 14 → 21 */
const bbFrames = [];
for (let i = 14; i <= 21; i++) {
  const img = new Image();
  img.src = `./BB (${i}).png`;
  bbFrames.push(img);
}

/* FRAMES A1 1 → 31 */
const a1Frames = [];
for (let i = 1; i <= 31; i++) {
  const img = new Image();
  img.src = `./A1 (${i}).png`;
  a1Frames.push(img);
}

const hFrames = [];

for (let i = 1; i <= 4; i++) {
  const img = new Image();
  img.src = `./H (${i}).png`;
  hFrames.push(img);
}

function dropBlunt() {
  blunt.style.opacity = "1";
  blunt.classList.remove("blunt-falling");
  void blunt.offsetWidth;

  blunt.style.backgroundImage = 'url("./pixil-frame-0.png")';
  blunt.classList.add("blunt-falling");

  let bluntFrame = 0;
  let bluntAnimation;
  let lastFrameTime = performance.now();

  const bbFrameDuration = 30;
  const a1FrameDuration = 100;

  let bbStarted = false;

  function startBBSequence() {
    if (bbStarted) return;
    bbStarted = true;

    /* Guardamos EXACTAMENTE la posición actual */
    const currentTop = blunt.getBoundingClientRect().top;

    /* Quitamos la animación CSS sin mover el blunt */
    blunt.classList.remove("blunt-falling");
    blunt.style.top = `${currentTop}px`;

    const targetTop = window.innerHeight / 2 - 60;
    const startTop = currentTop;

    let bbFrame = 0;
    let lastBBFrameTime = performance.now();

     blunt.style.backgroundImage =
  `url("${bbFrames[0].src}")`;

    function animateBB(now) {
      if (now - lastBBFrameTime >= bbFrameDuration) {
        bbFrame++;

        if (bbFrame >= bbFrames.length) {
          bbFrame = bbFrames.length - 1;
        }

        blunt.style.backgroundImage =
          `url("${bbFrames[bbFrame].src}")`;

        const progress = bbFrame / (bbFrames.length - 1);

        const top =
          startTop + (targetTop - startTop) * progress;

        blunt.style.top = `${top}px`;

        lastBBFrameTime = now;

        if (bbFrame === bbFrames.length - 1) {
          cancelAnimationFrame(bbAnimation);
          startA1Sequence();
          return;
        }
      }

      bbAnimation = requestAnimationFrame(animateBB);
    }

    let bbAnimation = requestAnimationFrame(animateBB);
  }

function startA1Sequence() {
  let a1Frame = 0;
  let loopMode = false;
  let loopFrame = 25;
   let hStarted = false;
let hFrame = 0;

  strawberry.style.visibility = "hidden";
  shineCanvas.style.visibility = "hidden";

  blunt.classList.add("a1-sequence");

  const strawberrySize =
    parseFloat(getComputedStyle(strawberry).width);

  const a1Size =
    strawberrySize * (96 / 64);

  blunt.style.backgroundSize =
    `${a1Size}px ${a1Size}px`;

  blunt.style.backgroundImage =
    `url("${a1Frames[0].src}")`;

  const a1Interval = setInterval(() => {

    if (!loopMode) {

      a1Frame++;

      if (a1Frame >= a1Frames.length) {
        return;
      }

      blunt.style.backgroundImage =
        `url("${a1Frames[a1Frame].src}")`;

       if (a1Frame === 13 && !hStarted) {
  hStarted = true;

  const bluntRect = blunt.getBoundingClientRect();

  hAnimation.style.left =
  `${bluntRect.left + bluntRect.width * -0.25}px`;

hAnimation.style.top =
  `${bluntRect.top + bluntRect.height * -0.30}px`;

hAnimation.style.width =
  `${bluntRect.width * 0.55}px`;

hAnimation.style.height =
  `${bluntRect.height * 0.55}px`;

  hAnimation.style.backgroundImage =
    `url("${hFrames[0].src}")`;

  hAnimation.style.opacity = "1";

  hFrame = 0;

  setInterval(() => {
    hFrame++;

    if (hFrame >= hFrames.length) {
      hFrame = 0;
    }

    hAnimation.style.backgroundImage =
      `url("${hFrames[hFrame].src}")`;
  }, 100);
}

      if (a1Frame === 1) {
        focusVignette.classList.remove("focus-active");
        vibrateDevice([120, 50, 180, 50, 220]);
        createImpact();
      }

      // A1 (31) → comenzar bucle A1 (26 → 31)
if (a1Frame === 30) {
    loopMode = true;
    loopFrame = 25;

    /* =========================================
       TRANSICIÓN SUAVE DENTRO DE LOS 4 SEGUNDOS
       ========================================= */

    setTimeout(() => {
        startMainFade();
    }, 3000);

    setTimeout(() => {
        enterMainSite();

        setTimeout(() => {
            clearInterval(a1Interval);
        }, 500);
    }, 4000);
}

      return;
    }

    // Bucle A1 (26 → 31)
    blunt.style.backgroundImage =
      `url("${a1Frames[loopFrame].src}")`;

    loopFrame++;

    if (loopFrame > 30) {
      loopFrame = 25;
    }

  }, a1FrameDuration);
}

  function animateBlunt(now) {
    if (now - lastFrameTime >= 100) {
      bluntFrame++;

      if (bluntFrame > 11) {
        bluntFrame = 0;
      }

      /*
       * Cuando llegamos al momento elegido de la caída,
       * mostramos pixil-frame-1 y pasamos inmediatamente
       * a BB14 desde esa misma posición.
       */
      if (bluntFrame === 1 && now - fallStartTime >= transitionTime) {
        blunt.style.backgroundImage =
          'url("./pixil-frame-1.png")';

        startBBSequence();
        return;
      }

      blunt.style.backgroundImage =
        `url("${bluntFrames[bluntFrame].src}")`;

      lastFrameTime = now;
    }

    bluntAnimation = requestAnimationFrame(animateBlunt);
  }

  /*
   * La caída CSS dura 10 segundos.
   * Entramos a BB aproximadamente a la mitad del recorrido.
   */
  const fallStartTime = performance.now();
  const transitionTime = 5000;

  bluntAnimation = requestAnimationFrame(animateBlunt);
}

/* =========================================
   IMPACTO
   ========================================= */
function createImpact() {
  impact.style.opacity = "1";
  impactFlash.animate(
    [
      { opacity: 0 },
      { opacity: 0.9 },
      { opacity: 0 }
    ],
    { duration: 280, easing: "ease-out" }
  );
  intro.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: "translate(-10px, 5px)" },
      { transform: "translate(10px, -6px)" },
      { transform: "translate(-8px, -5px)" },
      { transform: "translate(7px, 6px)" },
      { transform: "translate(-5px, -3px)" },
      { transform: "translate(4px, 2px)" },
      { transform: "translate(0, 0)" }
    ],
    { duration: 450, easing: "linear" }
  );
  introBackground.animate(
  [
    { background: "#000" },
    { background: "#FFFFFF" },
    { background: "#FFFFFF" },
    { background: "#FFFFFF" }
  ],
  { duration: 500, fill: "forwards", easing: "ease-out" }
);

   splashBrand.style.visibility = "visible";

setTimeout(() => {
    splashName.style.opacity = "1";
}, 1500);

setTimeout(() => {
    splashYear.style.opacity = "1";
}, 2500);
   
}

/* =========================================
   JUGO / PARTÍCULAS
   ========================================= */
function createJuice() {
  const juices = document.querySelectorAll(".juice");
  juices.forEach((juice, index) => {
    const directions = [
      [-55, -35],
      [55, -25],
      [-70, 35],
      [65, 45],
      [15, -65]
    ];
    const [x, y] = directions[index];
    juice.animate(
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(0.3)" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1.3)" },
        {
          opacity: 0.9,
          transform: `translate(calc(-50% + \({x}px), calc(-50% +\){y}px)) scale(0.65)`
        }
      ],
      {
        duration: 850 + index * 80,
        easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
        fill: "forwards"
      }
    );
  });
}

/* =========================================
   ENTRADA AL SITIO
   ========================================= */
function startMainFade() {
  /* El main ya empieza a existir debajo del intro */
  mainSite.style.visibility = "visible";
  mainSite.style.opacity = "0";

  /* El sitio principal aparece durante el último segundo */
  mainSite.animate(
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    {
      duration: 1000,
      easing: "ease-in-out",
      fill: "forwards"
    }
  );

  /* El intro desaparece exactamente durante ese mismo segundo */
  intro.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: 1000,
      easing: "ease-in-out",
      fill: "forwards"
    }
  );
}

function enterMainSite() {
  /* Aquí ya terminó el segundo de transición */
     localStorage.setItem(
    ENTRY_MEMORY_KEY,
    String(Date.now())
  );
   
  intro.style.display = "none";

  mainSite.style.visibility = "visible";
  mainSite.style.opacity = "1";

  document.body.style.overflow = "auto";

  if (spotifyController) {
    spotifyController.play().catch(() => {});
  }
}

/* =========================================
   ENTRADA DIRECTA SI YA ENTRÓ HACE MENOS DE 24 H
   ========================================= */

if (returningVisitor) {
  intro.style.display = "none";

  mainSite.style.visibility = "visible";
  mainSite.style.opacity = "1";

  document.body.style.overflow = "auto";
}

/* =========================================
   REPLAY — VOLVER AL INTRO
   ========================================= */

const replayButton = document.getElementById("replay-button");

if (replayButton) {
  replayButton.addEventListener("click", () => {

     spotifyReplayBlocked = true;

     if (spotifyController) {
  spotifyController.pause();
}
     
    mainSite.style.visibility = "hidden";
    mainSite.style.opacity = "0";

    intro.style.display = "flex";
    intro.style.visibility = "visible";
    intro.style.opacity = "1";

    document.body.style.overflow = "hidden";
  });
}
/* =========================================
   DESTELLO ARCOÍRIS PIXELADO
   ========================================= */
function animateRainbowShine() {
  if (!shineReady) return;
  const now = performance.now();
  const cycle = 10000;
  const duration = 1700;
  const elapsed = (now - shineStart) % cycle;

  shineCtx.clearRect(0, 0, shineCanvas.width, shineCanvas.height);

  if (elapsed < duration) {
    const progress = elapsed / duration;
    drawRainbowShine(progress);
  }
  requestAnimationFrame(animateRainbowShine);
}

function drawRainbowShine(progress) {
  const img = shineImages[frame];
  if (!img) return;

  const w = shineCanvas.width;
  const h = shineCanvas.height;
  shineCtx.clearRect(0, 0, w, h);

  /* POSICIÓN DEL BAÑO DE LUZ IZQUIERDA → DERECHA */
  const centerX = -w * 0.35 + (w * 1.7) * progress;
  const centerY = h * 0.5;
  const radiusX = w * 0.28;
  const radiusY = h * 0.75;
  const pixel = 3;

  /* COLORES QUE VAN APARECIENDO */
  const colors = [
    "#ff3b9d",
    "#ff7a24",
    "#ffd21f",
    "#39d353",
    "#00d9ff",
    "#3867ff",
    "#a855f7"
  ];

  /* POSICIÓN DEL CICLO DE COLOR */
  const colorFlow = progress * 7;

  /* DIBUJAR EL BAÑO DE LUZ */
  for (let y = 0; y < h; y += pixel) {
    for (let x = 0; x < w; x += pixel) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      const distance = dx * dx + dy * dy;

      if (distance > 1) continue;

      /* INTENSIDAD DEL HALO */
      const intensity = 1 - distance;

      /* CADA ZONA DE LA LUZ TIENE UN MOMENTO DIFERENTE DEL CICLO DE COLOR. */
      const localPosition = (x - centerX) / radiusX;
      const colorPosition = colorFlow + localPosition * 5.2;

      /* ÍNDICE DEL COLOR NORMALIZADO PARA EVITAR HUECOS */
      const colorIndex =
        ((Math.floor(colorPosition) % colors.length) + colors.length) %
        colors.length;
      const color = colors[colorIndex];

      /* TRANSICIÓN ENTRE COLORES SIN LLEGAR A CERO */
      const colorPhase = ((colorPosition % 1) + 1) % 1;
      const colorIntensity = 0.25 + Math.sin(colorPhase * Math.PI) * 0.25;

      /* INTENSIDAD FINAL */
      shineCtx.globalAlpha = colorIntensity * (0.04 + intensity * 0.14);
      shineCtx.fillStyle = color;
      shineCtx.fillRect(x, y, pixel + 1, pixel + 1);
    }
  }

  shineCtx.globalAlpha = 1;

  /* RECORTAR A LA SILUETA DE LA FRESA */
  shineCtx.globalCompositeOperation = "destination-in";
  shineCtx.drawImage(img, 0, 0, w, h);
  shineCtx.globalCompositeOperation = "source-over";
}

/* =========================================
   GALAGA STYLE STARFIELD
   ========================================= */
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");
starCtx.imageSmoothingEnabled = false;

const stars = [];

function resizeStarfield() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  stars.length = 0;

  const amount = Math.floor((starCanvas.width * starCanvas.height) / 9000);

  for (let i = 0; i < amount; i++) {
    stars.push({
      x: Math.floor(Math.random() * starCanvas.width),
      y: Math.floor(Math.random() * starCanvas.height),
      size: Math.random() < 0.88 ? 1 : 2,
      speed:
        Math.random() < 0.75
          ? 0.18 + Math.random() * 0.18
          : 0.4 + Math.random() * 0.3,
      brightness:
        Math.random() < 0.85
          ? 0.45 + Math.random() * 0.3
          : 0.8 + Math.random() * 0.2
    });
  }
}

let starfieldPaused = false;

function animateStarfield() {
  if (starfieldPaused) {
    requestAnimationFrame(animateStarfield);
    return;
  }

  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  for (const star of stars) {
    star.y += star.speed;
    if (star.y > starCanvas.height) {
      star.y = -2;
      star.x = Math.floor(Math.random() * starCanvas.width);
    }
    starCtx.globalAlpha = star.brightness;
    starCtx.fillStyle = "#FFFFFF";
    starCtx.fillRect(
      Math.floor(star.x),
      Math.floor(star.y),
      star.size,
      star.size
    );
  }

  starCtx.globalAlpha = 1;
  requestAnimationFrame(animateStarfield);
}

resizeStarfield();
animateStarfield();
window.addEventListener("resize", resizeStarfield);

/* =========================================
   BOOT SEQUENCE MEMORY
   ========================================= */
if (!localStorage.getItem("fresaBootSeen")) {
  localStorage.setItem("fresaBootSeen", "true");
}

/* =========================================
   BARRIDO OCASIONAL DE COLORES
   ========================================= */
const colorWave = document.getElementById("color-wave");

function triggerColorWave() {
  colorWave.classList.remove("active");
  void colorWave.offsetWidth;
  colorWave.classList.add("active");

  // Quitar active cuando termine la animación
  setTimeout(() => {
    colorWave.classList.remove("active");
  }, 2500);
}

/* Primera aparición después de 3 segundos */
setTimeout(() => {
  triggerColorWave();
  setInterval(() => {
    triggerColorWave();
  }, 70000);
}, 60000);
