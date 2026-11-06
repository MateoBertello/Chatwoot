/*
 * Configuración del chat en vivo (Chatwoot) — BúhoManager Soporte técnico
 *
 * SOLO tienes que cambiar las dos líneas de abajo:
 *   - CHATWOOT_BASE_URL: déjala así si usas Chatwoot Cloud.
 *   - CHATWOOT_WEBSITE_TOKEN: pega aquí el "website token" de tu bandeja
 *     de chat web (Configuración → Bandejas de entrada → tu bandeja →
 *     Configuración → código del widget).
 *
 * El website token es público: viaja al navegador de cada visitante y es
 * seguro dejarlo aquí. NUNCA pegues en este archivo contraseñas, tokens de
 * acceso de la API ni la clave HMAC de validación de identidad.
 */
const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
const CHATWOOT_WEBSITE_TOKEN = "PEGAR_TOKEN_AQUI";

/* ------------------------------------------------------------------------
 * No hace falta modificar nada debajo de esta línea.
 * --------------------------------------------------------------------- */
(function () {
  "use strict";

  var TOKEN_PLACEHOLDER = "PEGAR_TOKEN_AQUI";
  var LOAD_TIMEOUT_MS = 15000;

  var baseUrl = String(CHATWOOT_BASE_URL || "").trim().replace(/\/+$/, "");
  var websiteToken = String(CHATWOOT_WEBSITE_TOKEN || "").trim();

  // Estados posibles: "missing-token" | "loading" | "ready" | "error"
  var state = "loading";
  var errorReason = "";

  // Ajustes del widget. Deben existir antes de cargar el SDK.
  window.chatwootSettings = {
    locale: "es",
    position: "right",
    type: "standard",
    launcherTitle: "Hablar con soporte"
  };

  function byId(id) {
    return document.getElementById(id);
  }

  /* Aviso visible en la página (no usa alert ni la consola). */
  function showConfigNotice(title, message) {
    var notice = byId("config-notice");
    if (!notice) return;
    byId("config-notice-title").textContent = title;
    byId("config-notice-text").textContent = message;
    notice.hidden = false;
  }

  /* Mensaje junto al botón "Hablar con un técnico". */
  function setChatStatus(message) {
    var status = byId("chat-status");
    if (!status) return;
    // Se vacía primero para que los lectores de pantalla repitan el aviso
    // aunque el texto sea el mismo que la vez anterior.
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = message;
    }, 50);
  }

  function markReady() {
    state = "ready";
    errorReason = "";
    setChatStatus("");
  }

  function markError(reason) {
    if (state === "ready") return;
    state = "error";
    errorReason = reason;
  }

  function openChat() {
    if (state === "ready" && window.$chatwoot && typeof window.$chatwoot.toggle === "function") {
      window.$chatwoot.toggle("open");
      return;
    }

    if (state === "missing-token") {
      setChatStatus(
        "El chat todavía no está configurado en este sitio de prueba. " +
        "Falta pegar el website token en chatwoot-config.js."
      );
    } else if (state === "loading") {
      setChatStatus("El chat se está cargando. Vuelve a intentarlo en unos segundos.");
    } else {
      setChatStatus(
        errorReason ||
        "No pudimos cargar el chat. Revisa tu conexión, desactiva el bloqueador de anuncios para este sitio y recarga la página."
      );
    }
  }

  function loadWidget() {
    window.addEventListener("chatwoot:ready", markReady);
    window.addEventListener("chatwoot:error", function () {
      markError("El chat respondió con un error. Puede que el website token sea incorrecto.");
    });

    var script = document.createElement("script");
    script.src = baseUrl + "/packs/js/sdk.js";
    script.async = true;

    script.onload = function () {
      if (!window.chatwootSDK || typeof window.chatwootSDK.run !== "function") {
        markError("El archivo del chat se descargó, pero no es válido. Revisa CHATWOOT_BASE_URL.");
        return;
      }
      window.chatwootSDK.run({
        websiteToken: websiteToken,
        baseUrl: baseUrl
      });
    };

    script.onerror = function () {
      markError(
        "No se pudo descargar el chat. Puede deberse a un bloqueador de anuncios, " +
        "a un problema de conexión o a un CHATWOOT_BASE_URL incorrecto."
      );
    };

    document.head.appendChild(script);

    window.setTimeout(function () {
      if (state === "loading") {
        markError(
          "El chat está tardando demasiado en cargar. Revisa tu conexión, el website token " +
          "y si hay un bloqueador de anuncios activo, y luego recarga la página."
        );
      }
    }, LOAD_TIMEOUT_MS);
  }

  function init() {
    var buttons = document.querySelectorAll("[data-open-chat]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", openChat);
    }

    if (!websiteToken || websiteToken === TOKEN_PLACEHOLDER) {
      state = "missing-token";
      showConfigNotice(
        "Falta configurar el chat",
        "Este sitio de prueba todavía no tiene el website token de Chatwoot. " +
        "Abre chatwoot-config.js, reemplaza PEGAR_TOKEN_AQUI por el token de tu " +
        "bandeja de chat web y vuelve a publicar el sitio. Mientras tanto, el widget no se carga."
      );
      return;
    }

    if (!/^https:\/\//.test(baseUrl)) {
      state = "error";
      errorReason = "La dirección de Chatwoot no es válida. Revisa CHATWOOT_BASE_URL en chatwoot-config.js.";
      showConfigNotice(
        "Dirección de Chatwoot incorrecta",
        "CHATWOOT_BASE_URL debe empezar con https:// (por ejemplo, https://app.chatwoot.com)."
      );
      return;
    }

    loadWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
