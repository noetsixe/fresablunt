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

let started = false;


/* =========================================
   CLICK EN LA FRESA
========================================= */

strawberry.addEventListener("click", () => {

    if (started) return;

    started = true;

    /* Evita volver a pulsarla */
    strawberry.style.pointerEvents = "none";

    /* Detiene el pequeño temblor */
    strawberry.style.animation = "none";

    /* Inicia la caída del blunt */
    dropBlunt();

});


/* =========================================
   CAÍDA DEL BLUNT
========================================= */

function dropBlunt() {

    blunt.style.opacity = "1";

    /*
        El blunt empieza arriba de la pantalla
        y cae atravesando exactamente el centro.
    */

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

    /*
        El impacto ocurre cuando el blunt
        atraviesa la fresa.
    */

    setTimeout(() => {

        createImpact();

    }, 650);

}


/* =========================================
   IMPACTO
========================================= */

function createImpact() {

    /* Activa el impacto */
    impact.style.opacity = "1";

    /* Flash rojo */
    impactFlash.animate(
        [
            {
                opacity: 0
            },
            {
                opacity: 0.9
            },
            {
                opacity: 0
            }
        ],
        {
            duration: 280,
            easing: "ease-out"
        }
    );


    /* =====================================
       VIBRACIÓN DE TODA LA PANTALLA
    ====================================== */

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


    /* =====================================
       CAMBIO DE COLOR DEL FONDO
    ====================================== */

    introBackground.animate(
        [
            {
                background: "#000"
            },
            {
                background: "#ff1744"
            },
            {
                background: "#8b001f"
            },
            {
                background: "#450010"
            }
        ],
        {
            duration: 500,
            fill: "forwards",
            easing: "ease-out"
        }
    );


    /* =====================================
       JUGO / SANGRE
    ====================================== */

    createJuice();


    /*
        Después del impacto dejamos la imagen
        unos segundos antes de entrar al sitio.
    */

    setTimeout(() => {

        enterMainSite();

    }, 3000);

}


/* =========================================
   JUGO DE LA FRESA
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
   ENTRADA A LA PÁGINA PRINCIPAL
========================================= */

function enterMainSite() {

    /*
        Cubrimos la escena con negro
        para hacer la transición.
    */

    transition.animate(
        [
            {
                opacity: 0
            },
            {
                opacity: 1
            }
        ],
        {
            duration: 700,
            easing: "ease-in-out",
            fill: "forwards"
        }
    );


    setTimeout(() => {

        /* Ocultamos completamente la intro */
        intro.style.display = "none";

        /* Mostramos la página principal */
        mainSite.style.visibility = "visible";

        mainSite.animate(
            [
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            ],
            {
                duration: 1000,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        mainSite.style.opacity = "1";

        /* Permitimos scroll */
        document.body.style.overflow = "auto";

    }, 750);

}
