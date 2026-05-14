<p align="center">
  <img src="public/Logo.png" alt="Portfolio Pulse Logo" width="120" />
</p>

<h1 align="center">Portfolio Pulse — Client</h1>

<p align="center">
  Front-end client for <strong>Portfolio Pulse</strong>, an AI-powered institutional trading analysis platform.
  <br />
  Track trades, run AI rationality analysis, manage your portfolio, and upgrade to Pulse Pro — all in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

---

## Overview

This repository contains the **client-side code** of Portfolio Pulse. The backend API is hosted separately — see the [Backend API](#backend-api) section below.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Icons | Font Awesome Free Solid |
| Fonts | JetBrains Mono · Hanken Grotesk · Inter (Google Fonts) |
| Payments | Stripe (test mode) |
| Linting | ESLint + `eslint-config-next` |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |

---

## Features

- **Authentication** — Register, sign in, forgot/reset password, email verification
- **Dashboard** — Overview of all trades and portfolio performance
- **Trade Management** — Add, view, edit, and delete trades
- **AI Analysis** — Rationality score, sentiment analysis, and structured feedback (Pulse Pro)
- **Profile Management** — Edit personal details, upload avatar, manage subscription
- **Subscription** — Stripe-powered Pulse Pro upgrade with test mode support

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Installation

```bash
git clone <repo-url>
cd client
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://portfolio-pulse-delta.vercel.app/api/v1
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

---

## Backend API

The backend REST API is live at:

```
https://portfolio-pulse-delta.vercel.app/api/v1
```

Server source code: [github.com/Sduttt/portfolio-pulse-server](https://github.com/Sduttt/portfolio-pulse-server)

All client API calls are proxied through Next.js Route Handlers in production to handle cookie forwarding and CORS.

---

## Project Structure

```
app/
├── auth/               # Sign in, register, forgot/reset password
├── dashboard/          # Trade overview
├── profile/            # User profile & subscription management
├── trade/              # Add trade · Trade detail & AI analysis
├── subscription/       # Payment success verification
├── verify-email/       # Email verification landing
├── reset-password/     # Password reset landing
└── components/         # Shared UI components

lib/
├── apiClient.ts        # Axios instance (SSR / CSR aware)
└── api/                # Auth · Trade · Portfolio · Subscription API helpers
```
