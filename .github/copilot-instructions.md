# 🧠 GitHub Copilot Context Instructions for `MiguelDiLalla.github.io`

## 🔷 Project Overview
This repository hosts the **personal portfolio website** of Miguel Di Lalla.
It is a bold and aesthetic one-page scroll site, designed to:
- Present Miguel’s transition into data science and machine learning
- Showcase meaningful projects, especially the LEGO Bricks ML Vision project
- Reflect Miguel's personality through color, animation, and storytelling

## 🔧 Technologies and Stack
- **Static HTML5 + Tailwind CSS** (utility-first styling)
- **Vanilla JavaScript** for animations and interactivity
- **Google Fonts** integration
- **GitHub Pages** for deployment
- **MIT License**

## 🤖 GitHub Copilot Usage
Copilot should assist with:
- Writing clean and responsive Tailwind-based HTML5 components
- Applying consistent utility classes for layout, spacing, color, and typography
- Supporting scroll-based navigation highlighting (scrollspy)
- Generating minimal JS for:
  - Typing animations
  - Image carousels
  - Audio controls
  - GIF hover animations
- Maintaining an animated, human-centered aesthetic

## 🧩 Site Layout & Sections
The site is a **single scrollable page** divided into five sections, navigable via a fixed top navbar:

### ✅ Navigation
- Always visible on top
- Sections:
  - `Miguel Di Lalla` (click → scroll to Home)
  - `About`, `Projects`, `Skills`, `Contact`
- Scrollspy highlights active section

### ✅ Home (Hero Section)
- Yellow background (`#ffcf00`)
- Typing animation:
  - Types: `Hola!` → `Hi! I'm Miguel. It's great that you are here.`
- Quoted animated slogan below:
  > *"The mind is a LEGO set waiting for its model."* — Miguel Di Lalla
- Animated image carousel (3 photos of Miguel)
  - Shapes: rounded rectangle, circle, and star (with `clip-path`)

### ✅ About
- Left: animated visual collage (influences, favorite thinkers)
- Center: scrollable text biography panel
  - Audio player with play/pause and speed x2 buttons
- Right: vertical stack of institutional logos (education/training)

### ✅ Projects
- Primary project (highlighted): **LEGO Bricks ML Vision**
- Four secondary projects (grid cards):
  - Net Pomodoro, Polilabor, Voice Analysis, Roller Dashboard
- Each card:
  - Displays a darkened paused GIF
  - On hover: un-darkens and plays
  - On click: links to GitHub or live demo

### ✅ Skills
- Word cloud (non-interactive):
  - Black: mastered skills
  - Gray tones: skills in progress
- Optional side paragraph with motivation to learn and grow

### ✅ Contact
- Fullscreen section with **black background**, white text
- Large animated text: *Thanks for reading...*
- Contact methods:
  - GitHub, LinkedIn, Email (no contact form)
- Optional image or doodle (to be provided)

## ✒️ Typography
- Two Google Fonts used:
  - `Orbitron` or `Space Grotesk` for titles/nav
  - `Inter` or `Nunito` for body text
- Fonts loaded via `fonts.css`

## 🗂 Project Structure (updated)
```
MiguelDiLalla.github.io/
├── index.html
├── assets/
│   ├── css/ [styles.css, fonts.css, animations.css]
│   ├── js/  [typewriter.js, scrollspy.js, gifHover.js, audioControl.js]
│   └── images/ [profile/, collage/, org_logos/, projects/]
├── audio/ [bio_intro.mp3, bio_intro_2x.mp3]
├── content/ [bio.md, skills.json, projects.json]
├── projects/ [lego-ml-vision.html, other-projects.html]
├── .github/ [Web_Portfolio_Sections.md]
```

## ✨ Style & Branding
Miguel is:
- A self-taught ML enthusiast with a creative engineering background
- Passionate about storytelling, learning, visual design, and automation
- Building a joyful, clean, and memorable online presence

The site should reflect:
- A bold, colorful visual language (yellow, black, red highlights)
- Rounded cards and elements
- Simple animations with character (hover effects, transitions)
- Visual order and human warmth

---

## 🧠 Final Notes for Copilot
- Prioritize semantic, accessible HTML5
- Ensure components are mobile-responsive and animated smoothly
- Use Tailwind CSS utilities for layout and transitions
- Recommend minimal JS where needed
- Follow the latest file structure and section descriptions
- No need for dark/light mode – the theme is fixed (yellow/black aesthetic)
