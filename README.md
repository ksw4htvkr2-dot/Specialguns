# KK Specialguns – Website

Aktueller Stand mit Startseite, Produkten, Kontakt, Logo, 15 Produktfotos und Scrollanimationen.
Statische Website aus HTML, CSS und JavaScript. Keine Installation oder Build-Schritte nötig.

## GitHub und Vercel

1. ZIP entpacken und den gesamten Inhalt dieses Ordners in dein GitHub-Repository hochladen. `index.html`, `style.css`, `app.js`, `vercel.json` und die Ordner `assets`, `produkte`, `kontakt` müssen direkt im Hauptverzeichnis des Repositorys liegen. Die ZIP selbst nicht hochladen.
2. In Vercel ein neues Projekt anlegen und das GitHub-Repository importieren.
3. Framework Preset: **Other**. Root Directory: Hauptverzeichnis. Build Command: leer. Output Directory: **.**. Diese Einstellungen sind in `vercel.json` vorbereitet.
4. Deploy starten.

## Bearbeiten

- Startseite: `index.html`
- Produkte: `produkte/index.html`
- Kontakt: `kontakt/index.html`
- Gestaltung: `style.css`
- Filter und Animationen: `app.js`
- Logo und Fotos: `assets/`

Das Kontaktformular öffnet das E-Mail-Programm des Besuchers. Ein eigener Versandserver ist nicht enthalten.
Die Produktbilder sind KI-generierte Platzhalter. Google Maps und Google Fonts benötigen Internetzugang.

Vercel-Dokumentation: https://vercel.com/docs/builds/configure-a-build
