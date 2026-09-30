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
let frame = 1;
let direction = 1;


/* =========================================
   ANIMACIÓN IDLE DE LA FRESA
========================================= */

function animateStrawberry() {

    if (started) return;

    const sprite = `url("./Fresa${frame}.png")`;

    strawberryImage.style.backgroundImage = sprite;
    strawberryImage.style.setProperty(
        "--strawberry-mask",
        sprite
    );

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

strawberry.addEventListener("click", () => {

    if (started) return;

    started = true;

    strawberry.style.pointerEvents = "none";
    strawberry.style.animation = "none";

    dropBlunt();
});


/* =========================================
   CAÍDA DEL BLUNT
========================================= */

function dropBlunt() {

    blunt.style.opacity = "1";

    blunt.animate(
        [
            {
                top: "-180px",
                transform: "translateX(-50%) rotate(4deg)"
            },

            {
                top: "calc(50% - 115px)",
                transform: "translateX(-50%) rotate(4deg)"
            },

            {
                top: "calc(50% - 20px)",
                transform: "translateX(-50%) rotate(4deg)"
            },

            {
                top: "calc(50% + 60px)",
                transform: "translateX(-50%) rotate(4deg)"
            }
        ],
        {
            duration: 850,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "forwards"
        }
    );

    setTimeout(() => {
        createImpact();
    }, 650);
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
        {
            duration: 280,
            easing: "ease-out"
        }
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
        {
            duration: 450,
            easing: "linear"
        }
    );


    introBackground.animate(
        [
            { background: "#000" },
            { background: "#ff1744" },
            { background: "#8b001f" },
            { background: "#450010" }
        ],
        {
            duration: 500,
            fill: "forwards",
            easing: "ease-out"
        }
    );


    createJuice();


    setTimeout(() => {
        enterMainSite();
    }, 3000);
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
                {
                    opacity: 0,
                    transform: "translate(-50%, -50%) scale(0.3)"
                },
                {
                    opacity: 1,
                    transform: "translate(-50%, -50%) scale(1.3)"
                },
                {
                    opacity: 0.9,
                    transform:
                        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.65)`
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

function enterMainSite() {

    transition.animate(
        [
            { opacity: 0 },
            { opacity: 1 }
        ],
        {
            duration: 700,
            easing: "ease-in-out",
            fill: "forwards"
        }
    );


    setTimeout(() => {

        intro.style.display = "none";

        mainSite.style.visibility = "visible";

        mainSite.animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 1000,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        mainSite.style.opacity = "1";

        document.body.style.overflow = "auto";

    }, 750);
}
/* =========================================
   DESTELLO ARCOÍRIS PIXELADO
========================================= */

function animateRainbowShine() {

    if (!shineReady) return;

    const now = performance.now();

    const cycle = 15000;
const duration = 650;

    const elapsed = (now - shineStart) % cycle;

    shineCtx.clearRect(
        0,
        0,
        shineCanvas.width,
        shineCanvas.height
    );

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

    /*
       POSICIÓN DEL BAÑO DE LUZ
       IZQUIERDA → DERECHA
    */

    const centerX =
        -w * 0.35 +
        (w * 1.7) * progress;

    const centerY = h * 0.5;

    const radiusX = w * 0.28;
    const radiusY = h * 0.75;

    const pixel = 3;


    /*
       COLORES QUE VAN APARECIENDO
    */

    const colors = [
    "#ff3b9d",
    "#ff7a24",
    "#ffd21f",
    "#39d353",
    "#00d9ff",
    "#3867ff",
    "#a855f7"
];


    /*
       POSICIÓN DEL CICLO DE COLOR
    */

    const colorFlow =
    progress * 7;


    /*
       DIBUJAR EL BAÑO DE LUZ
    */

    for (
        let y = 0;
        y < h;
        y += pixel
    ) {

        for (
            let x = 0;
            x < w;
            x += pixel
        ) {

            const dx =
                (x - centerX) / radiusX;

            const dy =
                (y - centerY) / radiusY;

            const distance =
                dx * dx + dy * dy;

            if (distance > 1) continue;


            /*
               INTENSIDAD DEL HALO
            */

            const intensity =
                1 - distance;


            /*
               CADA ZONA DE LA LUZ
               TIENE UN MOMENTO DIFERENTE
               DEL CICLO DE COLOR.
            */

            const localPosition =
    (x - centerX) / radiusX;

const colorPosition =
    colorFlow + localPosition * 2.2;


            const colorIndex =
                Math.floor(colorPosition)
                % colors.length;

            const color =
                colors[colorIndex];


            /*
               CADA COLOR APARECE Y
               DESAPARECE GRADUALMENTE.
            */

            const colorPhase =
                colorPosition % 1;

            const colorIntensity =
                Math.sin(
                    colorPhase * Math.PI
                );


            /*
               INTENSIDAD FINAL
            */

            shineCtx.globalAlpha =
                colorIntensity *
                (
                    0.06 +
                    intensity * 0.34
                );

            shineCtx.fillStyle = color;

            shineCtx.fillRect(
    x,
    y,
    pixel + 1,
    pixel + 1
);
        }
    }


    shineCtx.globalAlpha = 1;


    /*
       RECORTAR A LA SILUETA
       DE LA FRESA
    */

    shineCtx.globalCompositeOperation =
        "destination-in";

    shineCtx.drawImage(
        img,
        0,
        0,
        w,
        h
    );

    shineCtx.globalCompositeOperation =
        "source-over";
}
