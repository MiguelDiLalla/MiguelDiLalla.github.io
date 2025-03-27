# 🧾 Miguel Di Lalla - Personal Portfolio Page Specs

Este documento describe la estructura, diseño e interactividad esperada de la página web personal de Miguel Di Lalla, aspirante a Junior Data Scientist. Es una guía integral para el desarrollo del sitio en HTML, CSS y JS puro.

---

## 🧭 Estructura General

- **Scroll vertical único** dividido en 5 secciones:
  - `Home`
  - `About`
  - `Projects`
  - `Skills`
  - `Contact`
- **Barra de navegación fija** en la parte superior:
  - Contiene: Nombre "Miguel Di Lalla" (lleva a Home) + enlaces ancla a las 4 secciones restantes.
  - El título de la sección visible debe estar **resaltado**.

---

## 🏠 HOME

- **Texto animado tipo máquina de escribir**:
  - “Hola!” → “Hi! I'm Miguel. It's great that you are here.”
- **Cita animada estilo quote:**
  > _"The mind is a LEGO set waiting for its model."_  
  > — Miguel Di Lalla, Aspiring Junior Data Scientist
- **Fotos personales**:
  - 3 imágenes intercambiables con animación suave.
  - Formas distintas: rectángulo, círculo, estrella (bordes redondeados, `clip-path`).

---

## 👤 ABOUT

- **Izquierda:** animación con collage visual de influencias y referentes personales.
- **Centro:** panel scrollable con biografía:
  - Incluye controles para:
    - ▶️ Play / ⏸ Pause
    - ⏩ x2 velocidad
  - Implementado con `<audio>` y JS (`audioControl.js`).
- **Derecha:** columna vertical con logos `.png` de organizaciones educativas (ordenados con flex).

---

## 🧩 PROJECTS

- **Panel principal** para el proyecto: `LEGO ML Vision`.
- **Cuatro mini paneles** adicionales:
  - `Net Pomodoro`, `Polilabor`, `Speech Analysis`, `Roller Parks Dashboard`
- **Cada panel**:
  - GIF en pausa + filtro oscuro
  - Al hacer hover: se remueve el filtro + se reproduce el GIF
  - Al hacer clic: abre enlace a repositorio o demo
- Estilos: transiciones suaves con `hover`, `opacity`, y JS (`gifHover.js`).

---

## 🛠 SKILLS

- **Word cloud visual**:
  - 🖤 Habilidades actuales en color negro
  - ⚪ Intereses futuros en tonos de gris
- Pequeño párrafo motivacional a un lado o debajo

---

## 📬 CONTACT

- **Fondo negro**, texto blanco.
- **Texto central grande animado**:
  > _Thanks for reading..._
- Links: GitHub, LinkedIn, Email
- Posible imagen o ilustración decorativa futura.

---

## ✒️ Tipografía

- Dos fuentes recomendadas (Google Fonts):
  - **Títulos:** `Orbitron` o `Space Grotesk`
  - **Texto:** `Inter` o `Nunito`

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Inter&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Inter', sans-serif; }
  h1, h2, nav { font-family: 'Orbitron', sans-serif; }
</style>
```

---

## 🔧 Interactividad y Soporte

| Interacción                         | Soporte en HTML/CSS/JS puro | Observaciones |
|------------------------------------|-------------------------------|---------------|
| Hero typing animation              | ✅                            | Ya implementado. |
| Scrollspy para navbar              | ✅                            | Con `IntersectionObserver`. |
| Carrusel visual en About/Home      | ✅                            | Con `setInterval`, `opacity`. |
| Reproducción de GIF en hover       | ✅                            | Con `hover` y `gifHover.js`. |
| Reproductor de audio + velocidad   | ✅                            | Con `audio` + JS (`audioControl.js`). |
| Word cloud                         | ✅                            | Puede hacerse con CSS grid/flex o SVG. |
| Bordes redondeados globales        | ✅                            | Tailwind `rounded-*` o CSS clásico. |

---

## 📁 Estructura de Carpetas

```bash
MiguelDiLalla.github.io/
├── index.html
├── assets/
│   ├── css/ [styles.css, fonts.css, animations.css]
│   ├── js/  [typewriter.js, scrollspy.js, gifHover.js, audioControl.js]
│   └── images/ [profile/, collage/, org_logos/, projects/]
├── audio/ [bio_intro.mp3, bio_intro_2x.mp3]
├── projects/ [lego-ml-vision.html, other-projects.html]
├── content/ [bio.md, skills.json, projects.json]
├── .github/ [Web_Portfolio_Sections.md]
```

Este archivo funciona como especificación oficial del proyecto. Se puede actualizar a medida que nuevas funcionalidades o secciones sean agregadas.
