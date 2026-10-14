/* =========================================================================
   EL LIBRO DE LA VIDA — Carta interactiva para Maivy
   script.js — Optimizado para 60fps, interacciones 3D y efectos de scroll
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  crearPapelPicado();
  crearPetalos();
  crearDestellos();
  iniciarBarraProgreso();
  iniciarBotonEsquivo();
  iniciarSobreCarta();
  iniciarGaleria();
  iniciarLoteria3D();
  iniciarAltarVelas();
  iniciarPromesas();
  iniciarReveladoScroll();
  iniciarLightbox();
  iniciarContador();
  iniciarMusica();

  window.addEventListener(
    "resize",
    debounce(() => {
      crearPapelPicado();
    }, 250),
    { passive: true }
  );

  /* -----------------------------------------------------------------------
     1. BANNER DE PAPEL PICADO
     ----------------------------------------------------------------------- */
  function crearPapelPicado() {
    const contenedor = document.getElementById("papelPicado");
    if (!contenedor) return;

    contenedor
      .querySelectorAll(".bandera")
      .forEach((bandera) => bandera.remove());

    const anchoBandera = 38;
    const cantidad = Math.ceil(window.innerWidth / anchoBandera) + 2;

    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < cantidad; i++) {
      const bandera = document.createElement("span");
      bandera.className = "bandera";
      fragmento.appendChild(bandera);
    }
    contenedor.appendChild(fragmento);
  }

  /* -----------------------------------------------------------------------
     2. PÉTALOS DE CEMPASÚCHIL Y DESTELLOS (Optimizado para GPU)
     ----------------------------------------------------------------------- */
  function crearPetalos() {
    const contenedor = document.getElementById("petalos");
    if (!contenedor || prefiereMenosMovimiento) return;

    const cantidad = window.innerWidth < 420 ? 8 : 12;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < cantidad; i++) {
      const petalo = document.createElement("span");
      petalo.className = "petalo";

      const izquierda = Math.random() * 100;
      const duracion = 10 + Math.random() * 7;
      const retraso = Math.random() * -duracion;
      const deriva = Math.round(Math.random() * 110 - 55);
      const tamano = 10 + Math.random() * 8;

      petalo.style.left = `${izquierda}%`;
      petalo.style.width = `${tamano}px`;
      petalo.style.height = `${tamano}px`;
      petalo.style.animationDuration = `${duracion}s`;
      petalo.style.animationDelay = `${retraso}s`;
      petalo.style.setProperty("--deriva", `${deriva}px`);

      fragmento.appendChild(petalo);
    }
    contenedor.appendChild(fragmento);
  }

  function crearDestellos() {
    const contenedor = document.getElementById("destellos");
    if (!contenedor || prefiereMenosMovimiento) return;

    const cantidad = window.innerWidth < 420 ? 10 : 16;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < cantidad; i++) {
      const destello = document.createElement("span");
      destello.className = "destello";

      const tamano = 2 + Math.random() * 3;
      destello.style.width = `${tamano}px`;
      destello.style.height = `${tamano}px`;
      destello.style.left = `${Math.random() * 100}%`;
      destello.style.top = `${Math.random() * 100}%`;
      destello.style.animationDuration = `${2.4 + Math.random() * 2.5}s`;
      destello.style.animationDelay = `${Math.random() * -4}s`;

      fragmento.appendChild(destello);
    }
    contenedor.appendChild(fragmento);
  }

  /* -----------------------------------------------------------------------
     3. EXPLOSIÓN DE CORAZONES Y FLORES DE CEMPASÚCHIL
     ----------------------------------------------------------------------- */
  function lanzarExplosionAmor(x, y) {
    if (prefiereMenosMovimiento) return;
    const simbolos = ["🩵", "🌼", "✨", "🕯️", "💖"];
    const total = 16;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const span = document.createElement("span");
      span.className = "particula-amor";
      span.textContent = simbolos[i % simbolos.length];

      const angulo = (Math.PI * 2 * i) / total + (Math.random() * 0.4 - 0.2);
      const distancia = 60 + Math.random() * 90;
      const tx = Math.cos(angulo) * distancia;
      const ty = Math.sin(angulo) * distancia - 30;
      const rot = Math.round(Math.random() * 90 - 45);

      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.setProperty("--tx", `${tx}px`);
      span.style.setProperty("--ty", `${ty}px`);
      span.style.setProperty("--rot", `${rot}deg`);

      fragmento.appendChild(span);
      setTimeout(() => span.remove(), 1200);
    }
    document.body.appendChild(fragmento);
  }

  /* -----------------------------------------------------------------------
     4. BARRA DE PROGRESO DE LECTURA CON REQUESTANIMATIONFRAME
     ----------------------------------------------------------------------- */
  function iniciarBarraProgreso() {
    const barra = document.getElementById("barraProgreso");
    if (!barra) return;

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollTotal =
              document.documentElement.scrollHeight - window.innerHeight;
            const progreso =
              scrollTotal > 0 ? Math.min(window.scrollY / scrollTotal, 1) : 0;
            barra.style.transform = `scaleX(${progreso})`;
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* -----------------------------------------------------------------------
     5. BOTÓN "NO" ESQUIVO Y BOTÓN "SÍ" CON AUDIO Y PARTÍCULAS (index.html)
     ----------------------------------------------------------------------- */
  function iniciarBotonEsquivo() {
    const btnNo = document.getElementById("btnNo");
    const btnSi = document.getElementById("btnSi");
    const audioInicio = document.getElementById("cancion");
    if (!btnNo || !btnSi) return;

    const mensajes = [
      "No",
      "¿Segura, Maivy? 🥺",
      "¡Casi me alcanzas!",
      "Inténtalo de nuevo ✨",
      "El destino dice que Sí 🩵",
      "¡Ese botón no vale!",
      "Mejor toca el Sí 🌼",
    ];

    let intentos = 0;

    function moverBoton(evento) {
      if (evento) evento.preventDefault();

      if (!btnNo.classList.contains("en-fuga")) {
        btnNo.classList.add("en-fuga");
      }

      const rect = btnNo.getBoundingClientRect();
      const ancho = rect.width || 160;
      const alto = rect.height || 56;
      const margen = 18;
      const margenSuperior = 80;

      const maxX = Math.max(window.innerWidth - ancho - margen, margen);
      const maxY = Math.max(window.innerHeight - alto - margen, margenSuperior);

      const x = margen + Math.random() * (maxX - margen);
      const y = margenSuperior + Math.random() * (maxY - margenSuperior);

      btnNo.style.left = `${x}px`;
      btnNo.style.top = `${y}px`;

      intentos++;
      const indiceMensaje = Math.min(intentos, mensajes.length - 1);
      btnNo.textContent = mensajes[indiceMensaje];

      const escala = Math.min(1 + intentos * 0.03, 1.22);
      btnSi.style.transform = `scale(${escala})`;

      if (navigator.vibrate) navigator.vibrate(12);
    }

    btnNo.addEventListener("touchstart", moverBoton, { passive: false });
    btnNo.addEventListener("mouseenter", moverBoton);
    btnNo.addEventListener("click", moverBoton);

    btnSi.addEventListener("click", (e) => {
      const rect = btnSi.getBoundingClientRect();
      lanzarExplosionAmor(
        e.clientX || rect.left + rect.width / 2,
        e.clientY || rect.top + rect.height / 2
      );

      if (audioInicio) {
        audioInicio.play().catch(() => {});
      }

      btnSi.innerHTML = "<span>¡Sabía que dirías que sí! 🩵</span>";
      btnSi.style.transform = "scale(1.1)";

      setTimeout(() => {
        window.location.href = "carta.html?play=true";
      }, 1300);
    });
  }

  /* -----------------------------------------------------------------------
     6. APERTURA DEL SOBRE (carta.html)
     ----------------------------------------------------------------------- */
  function iniciarSobreCarta() {
    const sobre = document.getElementById("sobreCarta");
    const boton = document.getElementById("botonSobre");
    if (!sobre || !boton) return;

    boton.addEventListener("click", (e) => {
      if (sobre.classList.contains("abierto")) return;

      const rect = boton.getBoundingClientRect();
      lanzarExplosionAmor(
        e.clientX || rect.left + rect.width / 2,
        e.clientY || rect.top + rect.height / 2
      );

      sobre.classList.add("abierto");
      if (navigator.vibrate) navigator.vibrate(15);

      setTimeout(() => {
        sobre.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    });
  }

  /* -----------------------------------------------------------------------
     7. CARTAS DE LOTERÍA CON GIRO 3D
     ----------------------------------------------------------------------- */
  function iniciarLoteria3D() {
    const cartas = document.querySelectorAll(".carta-loteria");
    cartas.forEach((carta) => {
      const alternar = () => {
        carta.classList.toggle("volteada");
        if (navigator.vibrate) navigator.vibrate(10);
      };
      carta.addEventListener("click", alternar);
      carta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          alternar();
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     8. ALTAR DE LAS VELAS INTERACTIVO
     ----------------------------------------------------------------------- */
  function iniciarAltarVelas() {
    const velas = document.querySelectorAll(".vela-item");
    const mensaje = document.getElementById("velaMensaje");
    if (velas.length === 0 || !mensaje) return;

    velas.forEach((vela) => {
      vela.addEventListener("click", (e) => {
        vela.classList.add("encendida");
        const etiqueta = vela.querySelector(".vela-etiqueta");
        if (etiqueta) etiqueta.textContent = "✨ Encendida ✨";

        const rect = vela.getBoundingClientRect();
        lanzarExplosionAmor(rect.left + rect.width / 2, rect.top + 20);

        const deseo = vela.getAttribute("data-deseo");
        const encendidas = document.querySelectorAll(".vela-item.encendida").length;

        if (encendidas === velas.length) {
          mensaje.innerHTML = `🕯️ <strong>¡Todas las velas brillan por nosotros!</strong><br>“${deseo}” 🩵`;
        } else {
          mensaje.textContent = `🕯️ “${deseo}”`;
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     9. PROMESAS INTERACTIVAS
     ----------------------------------------------------------------------- */
  function iniciarPromesas() {
    const promesas = document.querySelectorAll(".promesa-item");
    const juramento = document.getElementById("juramentoFinal");
    if (promesas.length === 0) return;

    promesas.forEach((item) => {
      const sellar = (e) => {
        item.classList.toggle("sellada");
        const icono = item.querySelector(".promesa-check");
        if (icono) {
          icono.textContent = item.classList.contains("sellada") ? "🩵" : "🕯️";
        }

        const totalSelladas = document.querySelectorAll(".promesa-item.sellada").length;
        if (juramento && totalSelladas === promesas.length) {
          juramento.classList.add("visible");
          const rect = item.getBoundingClientRect();
          lanzarExplosionAmor(
            e.clientX || rect.left + rect.width / 2,
            e.clientY || rect.top
          );
        }
      };

      item.addEventListener("click", sellar);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sellar(e);
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     10. GALERÍA CON SCROLL SNAP Y BOTONES
     ----------------------------------------------------------------------- */
  function iniciarGaleria() {
    const galeria = document.getElementById("galeria");
    const contenedorPuntos = document.getElementById("galeriaPuntos");
    const btnIzq = document.getElementById("btnGaleriaIzq");
    const btnDer = document.getElementById("btnGaleriaDer");
    if (!galeria || !contenedorPuntos) return;

    function obtenerItemsVisibles() {
      return Array.from(galeria.querySelectorAll(".galeria__item")).filter(
        (item) => document.body.contains(item)
      );
    }

    function reconstruirPuntos() {
      contenedorPuntos.innerHTML = "";
      const items = obtenerItemsVisibles();
      items.forEach((_, i) => {
        const punto = document.createElement("span");
        punto.className = "punto" + (i === 0 ? " activo" : "");
        contenedorPuntos.appendChild(punto);
      });
    }

    reconstruirPuntos();
    setTimeout(reconstruirPuntos, 600);

    if (btnIzq) {
      btnIzq.addEventListener("click", () => {
        galeria.scrollBy({ left: -260, behavior: "smooth" });
      });
    }
    if (btnDer) {
      btnDer.addEventListener("click", () => {
        galeria.scrollBy({ left: 260, behavior: "smooth" });
      });
    }

    let ticking = false;
    galeria.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const items = obtenerItemsVisibles();
            const puntos = Array.from(contenedorPuntos.children);
            const centroGaleria = galeria.scrollLeft + galeria.clientWidth / 2;
            let indiceCercano = 0;
            let distanciaMinima = Infinity;

            items.forEach((item, i) => {
              const centroItem = item.offsetLeft + item.clientWidth / 2;
              const distancia = Math.abs(centroGaleria - centroItem);
              if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                indiceCercano = i;
              }
            });

            puntos.forEach((p, i) =>
              p.classList.toggle("activo", i === indiceCercano)
            );
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* -----------------------------------------------------------------------
     11. VISOR LIGHTBOX (AMPLIAR FOTOS AL TOCARLAS)
     ----------------------------------------------------------------------- */
  function iniciarLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const btnCerrar = document.getElementById("lightboxCerrar");
    if (!lightbox || !lightboxImg) return;

    const selectoresFotos =
      ".galeria__item img, .cinta-foto img, .polaroid-scroll__marco img";

    document.addEventListener("click", (e) => {
      const img = e.target.closest(selectoresFotos);
      if (!img) return;

      const src = img.getAttribute("src");
      if (!src) return;

      const contenedor = img.closest("figure, .polaroid-scroll__marco, .cinta-foto");
      const textoCaption =
        contenedor?.querySelector("figcaption, .polaroid-scroll__caption")
          ?.textContent || "Maivy & Mattias 🩵";

      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = textoCaption;
      lightbox.classList.add("activo");
      lightbox.setAttribute("aria-hidden", "false");
    });

    function cerrar() {
      lightbox.classList.remove("activo");
      lightbox.setAttribute("aria-hidden", "true");
    }

    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrar();
    });
  }

  /* -----------------------------------------------------------------------
     12. REVELADO SUAVE AL HACER SCROLL (IntersectionObserver)
     ----------------------------------------------------------------------- */
  function iniciarReveladoScroll() {
    const elementos = document.querySelectorAll(".revelar-scroll");
    if (elementos.length === 0) return;

    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("visible");
              observador.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.18 }
      );
      elementos.forEach((el) => observador.observe(el));
    } else {
      elementos.forEach((el) => el.classList.add("visible"));
    }
  }

  /* -----------------------------------------------------------------------
     13. CONTADOR EN TIEMPO REAL CON SEGUNDOS
     ----------------------------------------------------------------------- */
  function iniciarContador() {
    const contDias = document.getElementById("contDias");
    const contHoras = document.getElementById("contHoras");
    const contMin = document.getElementById("contMin");
    const contSeg = document.getElementById("contSeg");
    if (!contDias || !contHoras || !contMin) return;

    const fechaInicio = new Date("2026-07-22T21:17:00");

    function actualizar() {
      const ahora = new Date();
      let diferencia = Math.max(0, Math.abs(ahora - fechaInicio));

      const dias = Math.floor(diferencia / 86400000);
      diferencia -= dias * 86400000;
      const horas = Math.floor(diferencia / 3600000);
      diferencia -= horas * 3600000;
      const minutos = Math.floor(diferencia / 60000);
      diferencia -= minutos * 60000;
      const segundos = Math.floor(diferencia / 1000);

      contDias.textContent = dias;
      contHoras.textContent = String(horas).padStart(2, "0");
      contMin.textContent = String(minutos).padStart(2, "0");
      if (contSeg) contSeg.textContent = String(segundos).padStart(2, "0");
    }

    actualizar();
    setInterval(actualizar, 1000);
  }

  /* -----------------------------------------------------------------------
     14. MÚSICA DE FONDO (SOPORTA ?play=true DESDE INDEX.HTML)
     ----------------------------------------------------------------------- */
  function iniciarMusica() {
    const audio = document.getElementById("audioFondo");
    const boton = document.getElementById("btnMusica");
    const aviso = document.getElementById("avisoMusica");
    if (!audio || !boton) return;

    let sonando = false;
    let avisoTimeout;

    function actualizarEstadoBoton(activo) {
      sonando = activo;
      boton.classList.toggle("sonando", activo);
      boton.setAttribute("aria-pressed", String(activo));
      boton.setAttribute(
        "aria-label",
        activo ? "Pausar música" : "Reproducir música"
      );
    }

    function mostrarAviso() {
      if (!aviso) return;
      aviso.classList.add("visible");
      clearTimeout(avisoTimeout);
      avisoTimeout = setTimeout(() => aviso.classList.remove("visible"), 4000);
    }

    async function intentarReproducir() {
      try {
        await audio.play();
        actualizarEstadoBoton(true);
      } catch (err) {
        mostrarAviso();
      }
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("play") === "true") {
      intentarReproducir();
      // Si el navegador móvil pide un toque en la página nueva, arranca al primer toque
      const desbloquearAlToque = () => {
        if (!sonando) intentarReproducir();
        document.removeEventListener("click", desbloquearAlToque);
      };
      document.addEventListener("click", desbloquearAlToque, { once: true });
    }

    boton.addEventListener("click", async () => {
      if (!sonando) {
        await intentarReproducir();
      } else {
        audio.pause();
        actualizarEstadoBoton(false);
      }
    });
  }

  /* -----------------------------------------------------------------------
     UTILIDAD: DEBOUNCE
     ----------------------------------------------------------------------- */
  function debounce(fn, espera) {
    let temporizador;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => fn(...args), espera);
    };
  }
});