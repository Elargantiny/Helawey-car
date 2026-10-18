# Helawey Car Rental — Frontend

The frontend is organized into small files while preserving the existing Arabic-first interface, English toggle, booking flow, admin panel, and Google Apps Script API contract. The original app uses browser JavaScript, so this structure keeps it framework-free instead of introducing a React rewrite that could change working behavior.

## Project structure

```text
frontend/
├── index.html                     # Page markup and stylesheet/script references
├── package.json                   # Rebuild command for Tailwind CSS
├── tailwind.config.js             # Content scan and RTL/LTR variants
├── tailwind.input.css             # Tailwind build input
├── public/
│   ├── hellawy-car-logo.png       # Site logo
│   └── tailwind.css               # Generated, minified styles
└── src/
    ├── app.js                     # Event wiring and startup
    ├── assets/site.css            # Site-specific CSS
    ├── components/
    │   ├── booking/booking.js      # Booking steps, payment, submit, WhatsApp
    │   ├── cars/carCatalog.js     # Car list and loading skeletons
    │   └── common/
    │       ├── feedback.js         # Toasts and modal helpers
    │       └── site.js             # Public settings and contact links
    ├── context/app-state.js       # App configuration and shared state
    ├── i18n/translations.js       # Arabic/English dictionary
    ├── pages/admin/admin.js       # Admin dashboard and management screens
    ├── services/
    │   ├── api.js                 # Apps Script requests and synchronization
    │   └── storage.js             # Local cache and browser storage
    └── utils/calculatePrice.js   # Dates, phone normalization, totals, conflicts
```

## Rebuild the CSS

Run these commands from the `frontend` directory:

```bash
npm install
npm run build:css
```

The equivalent Tailwind CLI command is:

```bash
npx tailwindcss -c ./tailwind.config.js -i ./tailwind.input.css -o ./public/tailwind.css --minify
```

## Hosting

Use `frontend` as the static site's root directory. Include `index.html`, `public/`, and `src/` in the deployment so the relative script and asset links resolve. The Apps Script URL remains configured in `src/context/app-state.js`.
