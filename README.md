# BúhoManager — Soporte técnico (sitio de prueba)

Sitio web estático de prueba para el soporte técnico de BúhoManager, con el
chat en vivo de **Chatwoot Cloud** integrado. Sirve para probar Chatwoot con un
caso realista antes de usarlo con clientes: un visitante abre el chat, escribe su
consulta y ve la respuesta del técnico, que contesta desde Chatwoot.

Está hecho solo con HTML, CSS y JavaScript. No necesita instalar nada ni
compilar nada: se publica tal cual en GitHub Pages.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La página: encabezado, botón para hablar con un técnico, datos útiles, preguntas frecuentes y pie de página. |
| `styles.css` | El diseño (colores, tipografía, adaptación a celular y computadora). |
| `chatwoot-config.js` | La configuración del chat. **Es el único archivo que tienes que editar.** |
| `README.md` | Esta guía. |

> **Sobre la seguridad:** el *website token* de Chatwoot es público (lo recibe el
> navegador de cada visitante), por eso puede ir en el código. **Nunca** pongas en
> estos archivos contraseñas, tokens de acceso de la API de Chatwoot ni la clave
> HMAC de validación de identidad. Esta versión no usa `setUser` ni validación de
> identidad.

---

## Guía paso a paso

Los nombres de los menús de Chatwoot pueden variar un poco según el idioma de tu
cuenta. Entre paréntesis va el nombre en inglés.

### 1. Crear la bandeja de chat web en Chatwoot y copiar el website token

1. Entra a <https://app.chatwoot.com> con tu cuenta.
2. En el menú de la izquierda, ve a **Ajustes** (*Settings*) → **Bandejas de entrada** (*Inboxes*).
3. Haz clic en **Añadir bandeja de entrada** (*Add Inbox*) y elige **Sitio web** (*Website*).
4. Completa los datos:
   - **Nombre del sitio web:** por ejemplo, `BúhoManager Soporte (prueba)`.
   - **Dominio del sitio web:** por ahora puedes poner `localhost`. Lo cambiarás en el paso 5.
   - **Título y mensaje de bienvenida:** opcionales, por ejemplo "¡Hola! ¿En qué podemos ayudarte?".
5. Haz clic en **Crear bandeja de entrada**.
6. Elige los agentes (técnicos) que van a responder en esta bandeja y continúa.
7. Chatwoot te mostrará un bloque de código. Busca la línea que dice
   `websiteToken: '...'` y **copia solo el texto que está entre comillas**.
   Es una cadena de letras y números, parecida a `aBcD1234eFgH5678iJkL`.

¿Ya cerraste esa pantalla? No pasa nada: ve a **Ajustes → Bandejas de entrada**,
haz clic en el ícono de engranaje de tu bandeja y abre la pestaña **Configuración**
(*Configuration*). Ahí está el mismo código con el token.

### 2. Pegar el token en `chatwoot-config.js`

1. Abre el archivo `chatwoot-config.js`. Puedes hacerlo directamente en GitHub:
   entra al repositorio, haz clic en el archivo y luego en el ícono del lápiz
   (**Edit this file**).
2. Al principio del archivo verás estas dos líneas:

   ```js
   const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
   const CHATWOOT_WEBSITE_TOKEN = "PEGAR_TOKEN_AQUI";
   ```

3. Reemplaza `PEGAR_TOKEN_AQUI` por el token que copiaste. **Deja las comillas.**
   Debería quedar así (con tu token):

   ```js
   const CHATWOOT_WEBSITE_TOKEN = "aBcD1234eFgH5678iJkL";
   ```

4. No cambies `CHATWOOT_BASE_URL` si usas Chatwoot Cloud.
5. Guarda el archivo. En GitHub, haz clic en **Commit changes**.

Mientras el token siga siendo `PEGAR_TOKEN_AQUI`, la página **no carga el chat** y
muestra un aviso amarillo que dice "Falta configurar el chat". Es normal.

### 3. Probar el sitio en tu computadora

Necesitas tener Python instalado (en Mac y Linux suele venir incluido; en
Windows se descarga desde <https://www.python.org>).

1. Descarga el repositorio a tu computadora (en GitHub: botón verde **Code** →
   **Download ZIP**, y descomprímelo).
2. Abre una terminal dentro de la carpeta del proyecto (la que tiene `index.html`).
   - En Windows: abre la carpeta, escribe `cmd` en la barra de direcciones y presiona Enter.
   - En Mac: clic derecho en la carpeta → **Nuevo terminal en la carpeta**.
3. Ejecuta:

   ```bash
   python -m http.server 8000
   ```

   Si en Windows no funciona, prueba con `py -m http.server 8000`.
4. Abre el navegador en <http://localhost:8000>.
5. Deberías ver el botón redondo del chat abajo a la derecha. También puedes
   hacer clic en **Hablar con un técnico** para abrirlo.
6. Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.

### 4. Activar GitHub Pages desde la rama `main`

1. Asegúrate de que los cuatro archivos estén en la rama `main` del repositorio.
2. En GitHub, entra al repositorio y ve a **Settings** → **Pages** (menú de la izquierda).
3. En **Build and deployment** → **Source**, elige **Deploy from a branch**.
4. En **Branch**, elige `main` y la carpeta `/ (root)`. Haz clic en **Save**.
5. Espera de 1 a 5 minutos y recarga esa página. Arriba aparecerá la dirección
   del sitio, que será parecida a:

   ```
   https://mateobertello.github.io/Chatwoot/
   ```

Cada vez que guardes un cambio en `main`, GitHub Pages vuelve a publicar el sitio
solo (tarda unos minutos).

### 5. Actualizar el dominio del sitio en la bandeja de Chatwoot

1. En Chatwoot, ve a **Ajustes → Bandejas de entrada** y haz clic en el engranaje de tu bandeja.
2. En la pestaña **Ajustes** (*Settings*), busca el campo **Dominio del sitio web** (*Website Domain*).
3. Reemplaza `localhost` por el dominio de GitHub Pages, **sin** `https://` y sin
   la parte final de la dirección. Por ejemplo:

   ```
   mateobertello.github.io
   ```

4. Haz clic en **Actualizar** (*Update*).

### 6. Enviar un mensaje de prueba y responderlo desde Chatwoot

1. Abre el sitio publicado en una **ventana de incógnito** (así te ves como un visitante nuevo).
2. Haz clic en **Hablar con un técnico** o en el botón redondo de abajo a la derecha.
3. Escribe un mensaje de prueba, por ejemplo: "Hola, es una prueba: no imprime el ticket".
4. En otra pestaña, entra a Chatwoot y ve a **Conversaciones** (*Conversations*).
   Verás la conversación nueva en tu bandeja.
5. Ábrela, escribe una respuesta y envíala.
6. Vuelve a la ventana del sitio: la respuesta del técnico aparece en el chat
   en pocos segundos.
7. Cuando termines, marca la conversación como **Resuelta** en Chatwoot.

### 7. Problemas comunes

**El widget no aparece**

- ¿Ves el aviso amarillo "Falta configurar el chat"? Entonces el token sigue
  siendo `PEGAR_TOKEN_AQUI`. Repite el paso 2.
- Comprueba que el token esté **entre comillas** y sin espacios de más.
- Haz clic en **Hablar con un técnico**: la página te mostrará un mensaje que
  indica qué está pasando (se está cargando, no se pudo descargar, etc.).
- Si abriste `index.html` con doble clic, usa en su lugar el servidor local del paso 3.
- Recuerda que GitHub Pages tarda unos minutos en publicar cada cambio.

**El token es incorrecto**

- El botón del chat puede no aparecer, o aparecer y no funcionar.
- Vuelve a copiar el token desde **Ajustes → Bandejas de entrada → engranaje →
  Configuración** y compáralo letra por letra. Copia solo lo que está entre
  comillas después de `websiteToken:`.
- Asegúrate de usar el token de una bandeja de tipo **Sitio web**, no un token de
  acceso de tu perfil (ese es secreto y **no** debe ir en el sitio).

**Hay un bloqueador de anuncios**

- Algunos bloqueadores (uBlock Origin, AdBlock, Brave, etc.) bloquean los chats de soporte.
- Desactívalo solo para este sitio o pruébalo en otro navegador o en una ventana
  de incógnito sin extensiones.
- Si la página dice "No se pudo descargar el chat", casi siempre es por esto o
  por un problema de conexión.

**La página quedó en caché (ves una versión vieja)**

- Fuerza la recarga: `Ctrl + F5` en Windows o `Cmd + Shift + R` en Mac.
- O ábrela en una ventana de incógnito.
- GitHub Pages puede mostrar la versión anterior durante hasta 10 minutos después
  de un cambio.

**El chat recuerda una conversación vieja**

- Chatwoot guarda la conversación en el navegador. Para empezar de cero, usa una
  ventana de incógnito nueva o borra los datos del sitio en tu navegador.

---

## Antes de usarlo con clientes

- Reemplaza las preguntas frecuentes de prueba por contenido real.
- Quita las menciones de "sitio de prueba" del pie de página y del sitio.
- Configura en Chatwoot el horario de atención, los mensajes automáticos y los
  agentes de cada turno.
