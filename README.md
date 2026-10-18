# Helawey Car Rental — Frontend

The frontend is organized into small browser JavaScript modules while preserving the Arabic-first interface, English toggle, booking flow, admin panel, and Google Apps Script API contract.

## Project structure

This repository's deployment root is the repository root (there is no `frontend/` subdirectory).

```text
index.html
package.json
tailwind.config.js
tailwind.input.css
public/
  hellawy-car-logo.png
  tailwind.css
src/
  app.js
  assets/site.css
  components/booking/booking.js
  components/cars/carCatalog.js
  components/common/feedback.js
  components/common/site.js
  context/app-state.js
  i18n/translations.js
  pages/admin/admin.js
  services/api.js
  services/storage.js
  utils/calculatePrice.js
```

## Rebuild the CSS

Run these commands from the repository root:

```bash
npm install
npm run build:css
```

The equivalent Tailwind CLI command is:

```bash
npx tailwindcss -c ./tailwind.config.js -i ./tailwind.input.css -o ./public/tailwind.css --minify
```

## Hosting

Use the repository root as the static site's root directory. The page loads assets from `public/` and scripts from `src/` through relative paths. The Apps Script URL remains configured in `src/context/app-state.js`.
