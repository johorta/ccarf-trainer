# CCAR-F Trainer

PWA de estudio para **Claude Certified Architect – Foundations (CCAR-F)**.

## Estado actual

Primera versión funcional con:

- React + TypeScript + Vite.
- Instalación como PWA.
- Preguntas en inglés y explicaciones en español.
- Priorización según el score report.
- Persistencia local del progreso.
- Exportación del progreso en JSON.
- Deploy automático a GitHub Pages.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Publicación

El workflow `.github/workflows/deploy-pages.yml` publica la carpeta `dist` en GitHub Pages después de cada push a `main`.

En GitHub abre **Settings → Pages** y selecciona **GitHub Actions** como fuente. La URL esperada es:

`https://johorta.github.io/ccarf-trainer/`

## Instalar en iPhone

1. Abrir la URL en Safari.
2. Pulsar **Compartir**.
3. Elegir **Agregar a pantalla de inicio**.
