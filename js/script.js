/* =========================================================================
   EL LIBRO DE LA VIDA — Carta interactiva
   script.js — interacciones y lógica táctil
   Este mismo archivo se usa en index.html y carta.html; cada bloque
   comprueba que sus elementos existan antes de actuar.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  crearPapelPicado();
  crearPetalos();
  iniciarBotonEsquivo();
  iniciarGaleria();
  iniciarRevelado();
  iniciarContador();
  iniciarMusica();

  window.addEventListener(
    "resize",
    debounce(() => {
      crearPapelPicado();
    }, 250)
  );

  /* -----------------------------------------------------------------------
     1. BANNER DE PAPEL PICADO
     Genera tantas "banderitas" como quepan en el ancho de pantalla, para
     que el patrón siempre se vea completo sin desbordar el celular.
     ----------------------------------------------------------------------- */
  function crearPapelPicado() {
    const contenedor = document.getElementById("papelPicado");
    if (!contenedor) return;

    contenedor
      .querySelectorAll(".bandera")
      .forEach((bandera) => bandera.remove());

    const anchoBandera = 40; // ancho + separación aproximada en px
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
     2. PÉTALOS DE CEMPASÚCHIL CAYENDO
     ----------------------------------------------------------------------- */
  function crearPetalos() {
    const contenedor = document.getElementById("petalos");
    if (!contenedor || prefiereMenosMovimiento) return;

    const cantidad = window.innerWidth < 380 ? 8 : 12;
    const fragmento = document.createDocumentFragment();

    for (let i = 0; i < cantidad; i++) {
      const petalo = document.createElement("span");
      petalo.className = "petalo";

      const izquierda = Math.random() * 100;
      const duracion = 9 + Math.random() * 8;
      const retraso = Math.random() * -duracion;
      const deriva = Math.round(Math.random() * 120 - 60);
      const tamano = 10 + Math.random() * 10;

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

  /* -----------------------------------------------------------------------
     3. BOTÓN "NO" IMPOSIBLE DE PRESIONAR (solo existe en index.html)
     En móviles no hay :hover, así que usamos "touchstart": el botón se
     mueve en el instante en que el dedo lo toca, antes de completarse
     el toque. También responde a mouseenter para escritorio.
     ----------------------------------------------------------------------- */
  function iniciarBotonEsquivo() {
    const btnNo = document.getElementById("btnNo");
    const btnSi = document.getElementById("btnSi");
    if (!btnNo || !btnSi) return;

    const mensajes = [
      "No",
      "¿Segura/o?",
      "Casi",
      "Inténtalo de nuevo",
      "No me alcanzas",
      "¡Eso no cuenta!",
      "Mejor toca el Sí",
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
      const margen = 16;
      const margenSuperior = 90; // evita tapar el título

      const maxX = Math.max(window.innerWidth - ancho - margen, margen);
      const maxY = Math.max(window.innerHeight - alto - margen, margenSuperior);

      const x = margen + Math.random() * (maxX - margen);
      const y = margenSuperior + Math.random() * (maxY - margenSuperior);

      btnNo.style.left = `${x}px`;
      btnNo.style.top = `${y}px`;

      intentos++;
      const indiceMensaje = Math.min(intentos - 1, mensajes.length - 1);
      btnNo.textContent = mensajes[indiceMensaje];

      // El botón "Sí" crece un poco cada intento, como invitación juguetona
      const escala = Math.min(1 + intentos * 0.025, 1.2);
      btnSi.style.transform = `scale(${escala})`;

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(12);
      }
    }

    // Evento táctil principal: se activa apenas el dedo toca la pantalla
    btnNo.addEventListener("touchstart", moverBoton, { passive: false });
    // Alternativa para dispositivos con mouse (no existe "touch" en desktop)
    btnNo.addEventListener("mouseenter", moverBoton);
    // Salvaguarda: si por algún motivo se llega a hacer click, también huye
    btnNo.addEventListener("click", moverBoton);

    btnSi.addEventListener("click", () => {

      // Hacemos que el botón cambie visualmente para que sepa que lo presionó
      btnSi.textContent = "¡Sabía que dirías que sí! 💛";
      btnSi.style.transform = "scale(1.1)";

      // Esperamos 1.5 segundos para que escuche la música antes de cambiar de página
      setTimeout(() => {
        // Le pasamos un parámetro (?play=true) a la siguiente página
        window.location.href = "carta.html?play=true";
      }, 1500);
    });
  }

  /* -----------------------------------------------------------------------
     4. GALERÍA CON SCROLL SNAP (solo existe en carta.html)
     Puntos indicadores + animación de aparición al hacer scroll.
     ----------------------------------------------------------------------- */
  function iniciarGaleria() {
    const galeria = document.getElementById("galeria");
    const contenedorPuntos = document.getElementById("galeriaPuntos");
    if (!galeria || !contenedorPuntos) return;

    const items = Array.from(galeria.querySelectorAll(".galeria__item"));
    if (items.length === 0) return;

    // Crear puntos indicadores
    items.forEach((_, i) => {
      const punto = document.createElement("span");
      punto.className = "punto" + (i === 0 ? " activo" : "");
      contenedorPuntos.appendChild(punto);
    });
    const puntos = Array.from(contenedorPuntos.children);

    // Aparición suave de cada foto al entrar en pantalla
    if ("IntersectionObserver" in window) {
      const observadorAparicion = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("visible");
              observadorAparicion.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      items.forEach((item) => observadorAparicion.observe(item));
    } else {
      items.forEach((item) => item.classList.add("visible"));
    }

    // Sincroniza el punto activo con la foto centrada al deslizar
    galeria.addEventListener(
      "scroll",
      debounce(() => {
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
      }, 80)
    );
  }

  /* -----------------------------------------------------------------------
     5. APARICIÓN SUAVE DE LA LOTERÍA, EL CONTADOR Y LAS PROMESAS
     (solo existe en carta.html)
     ----------------------------------------------------------------------- */
  function iniciarRevelado() {
    const elementos = document.querySelectorAll(
      ".carta-loteria, .contador__bloque, .lista-promesas"
    );
    if (elementos.length === 0) return;

    elementos.forEach((el) => el.classList.add("revelar"));

    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada, i) => {
            if (entrada.isIntersecting) {
              setTimeout(() => entrada.target.classList.add("visible"), i * 60);
              observador.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      elementos.forEach((el) => observador.observe(el));
    } else {
      elementos.forEach((el) => el.classList.add("visible"));
    }
  }

  /* -----------------------------------------------------------------------
     6. CONTADOR DE TIEMPO JUNTOS (solo existe en carta.html)
     ----------------------------------------------------------------------- */
  function iniciarContador() {
    const contDias = document.getElementById("contDias");
    const contHoras = document.getElementById("contHoras");
    const contMin = document.getElementById("contMin");
    if (!contDias || !contHoras || !contMin) return;

    // 📌 Fecha en que empezaron (02/07/26)
    const fechaInicio = new Date("2026-07-02T00:00:00");

    function actualizar() {
      const ahora = new Date();
      let diferencia = Math.max(0, ahora - fechaInicio);

      const dias = Math.floor(diferencia / 86400000);
      diferencia -= dias * 86400000;
      const horas = Math.floor(diferencia / 3600000);
      diferencia -= horas * 3600000;
      const minutos = Math.floor(diferencia / 60000);

      contDias.textContent = dias;
      contHoras.textContent = String(horas).padStart(2, "0");
      contMin.textContent = String(minutos).padStart(2, "0");
    }

    actualizar();
    setInterval(actualizar, 30000);
  }

  /* -----------------------------------------------------------------------
     7. BOTÓN DE MÚSICA DISCRETO (solo existe en carta.html)
     ----------------------------------------------------------------------- */
  function iniciarMusica() {
    const audio = document.getElementById("audioFondo");
    const boton = document.getElementById("btnMusica");
    const aviso = document.getElementById("avisoMusica");
    if (!audio || !boton) return;

    let sonando = false;
    let avisoTimeout;

    function mostrarAviso() {
      if (!aviso) return;
      aviso.classList.add("visible");
      clearTimeout(avisoTimeout);
      avisoTimeout = setTimeout(() => aviso.classList.remove("visible"), 3800);
    }

    boton.addEventListener("click", async () => {
      if (!sonando) {
        try {
          await audio.play();
          sonando = true;
          boton.classList.add("sonando");
          boton.setAttribute("aria-pressed", "true");
          boton.setAttribute("aria-label", "Pausar música");
        } catch (error) {
          mostrarAviso();
        }
      } else {
        audio.pause();
        sonando = false;
        boton.classList.remove("sonando");
        boton.setAttribute("aria-pressed", "false");
        boton.setAttribute("aria-label", "Reproducir música");
      }
    });

    audio.addEventListener("error", mostrarAviso);
  }

  /* -----------------------------------------------------------------------
     UTILIDAD: debounce simple para eventos de scroll / resize
     ----------------------------------------------------------------------- */
  function debounce(fn, espera) {
    let temporizador;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => fn(...args), espera);
    };
  }

  
});
