# wildsite.co — static site

Open `index.html` in a browser. Deploy by copying this whole folder to GitHub Pages (or any static host).

## Structure (mirrors erin-marie.com)
- `index.html` — homepage
- `websites.html` — website packages & rates (Refresh, Simple, Standard, Premium, Wildsite Club)
- `portfolio.html` — card rail + case-study decks (click a card)
- `design-by-hour.html` — hourly design blocks (Stripe links)
- `flower-art-ai.html` — Flower Art ($39 Stripe link)
- `wildreamers.html` / `wildreamers-sign-up.html` — Goals + Gratitude meeting (GHL form)
- `book-a-consult.html` — GHL booking widget
- `styles.css` — all site styles · `script.js` — portfolio rail · `stars.css` / `stars.js` — floating & popping stars · `casestudy.css` / `casestudy.js` — case-study decks (scoped under `.cs-root`)
- `assets/` — images, logos, case-study media (`assets/case-studies/<project>/`)
- `_previous/` — retired files

## Editing
- Header menu and footer are repeated in every page; change them in each file (or search/replace).
- Stars: edit `COLORS` and `HOVER_SELECTOR` at the top of `stars.js`.
- Case studies: each deck is a `<template id="deck-…">` at the bottom of `portfolio.html`; a card opens its deck via `data-deck="…"`.
