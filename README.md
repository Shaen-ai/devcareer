# DevCareer.am — Anonymous IT Salary Collection (MVP)

Stage 1 data-collection app for building Armenia's first transparent IT salary database.

## Stack

- **React 18** (JavaScript) via **Vite**
- **Tailwind CSS** (CDN — no build step for styles)
- **No router** — single-page layout
- **No backend required** — submissions POST to a configurable endpoint with localStorage fallback

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Configuration

Create a `.env` file (see `.env.example`):

```env
VITE_SUBMIT_URL=https://your-api.example.com/submit
```

- If `VITE_SUBMIT_URL` is not set or the request fails, submissions are saved to `localStorage` under `devcareer_submissions_queue`.
- A hidden admin panel lets you retry queued submissions or export them as JSON.

## Submission Payload

```json
{
  "role": "Backend",
  "level": "Senior",
  "experienceYears": 5,
  "salaryAmount": 800000,
  "location": "Yerevan",
  "companyName": "Optional Corp",
  "techTags": ["Docker", "K8s", "AWS"],
  "claimToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Features

- **SEO**: Full meta tags, OpenGraph, Twitter Card, JSON-LD (Organization + WebSite) in `public/index.html`
- **Claim token**: UUID generated client-side; shown after submit with copy button
- **Spam prevention**: Honeypot field + 30-second cooldown between submissions
- **Offline resilience**: Failed/offline submissions queued in localStorage with retry & JSON export
- **Accessibility**: ARIA attributes, keyboard navigation, focus management, semantic HTML
- **Validation**: Required-field checks + plausibility (salary > 0, experience 0–40)

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root layout
├── components/
│   ├── Hero.jsx          # Hero section with CTA
│   ├── TrustStrip.jsx    # Trust/privacy bullets
│   ├── HowItWorks.jsx    # 3-step process
│   ├── SubmitForm.jsx    # Salary form + success + queue panel
│   ├── FAQ.jsx           # Accordion FAQ
│   └── Footer.jsx        # Privacy/Terms + links
└── utils/
    ├── validation.js     # Form constants + validateForm()
    ├── uuid.js           # UUID v4 generator
    └── submission.js     # POST, queue, retry, export logic
```

## License

MIT
# devcareer
