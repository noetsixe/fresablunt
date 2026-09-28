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

let started = false;
let frame = 1;
let direction = 1;


/* =========================================
   ANIMACIÓN IDLE DE LA FRESA
========================================= */

function animateStrawberry() {

    if (started) return;

    strawberryImage.style.backgroundImage =
        `url("./strawberry_0${frame}.png")`;

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
