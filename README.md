# APS — Fenrir Security Platform

A modern, full-stack cybersecurity scanning platform built with Next.js. Provides real-time penetration testing workflows with a live console, vulnerability tracking, and an enterprise-grade dashboard.

---

## Live Demo

🔗 [View on Vercel](https://fenrir-fizzy.vercel.app/)
🔗 [View Demo](https://drive.google.com/file/d/1ZMpAtlJrVcqSDMiXbs7e3oQ8VRpo5KiL/view?usp=sharing)
---

## Screens

### Screen 1 — Login / Sign-up

A split-layout authentication page with a dark gradient left panel and a white form card on the right.

**Features:**
- Sign-up form: First name, Last name, Email, Password
- Terms & Conditions checkbox
- Toggle between Sign-up and Log in modes
- Social login buttons: Apple, Google, Meta
- Client-side validation with inline field errors
- Toast notifications on success and failure
- Credentials stored in `localStorage` on successful sign-up
- Redirects to `/screens/dashboard` after authentication

---

### Screen 2 — Main Dashboard (Scan List)

A full application layout with a persistent left sidebar and a data-rich main area.

**Sidebar:**
- Navigation: Dashboard, Projects, Scans, Schedule
- Bottom links: Notifications, Settings, Support
- Logout button (clears `localStorage`, redirects to `/`)
- User profile section with initials avatar and role

**Main area:**
- Breadcrumb header with Export Report and Stop Scan actions
- Org-level stats bar: Org, Owner, Total Scans, Scheduled, Rescans, Failed Scans
- Four severity counter cards: Critical, High, Medium, Low — each with trend indicator
- Scan table with columns: Scan Name, Type, Status, Progress, Vulnerability, Last Scan
- Status chips: green (Completed), gray (Scheduled), red (Failed), teal (Running)
- Vulnerability badges: colored squares per severity level
- Toolbar: live search, status filter dropdown, Column toggle, New Scan button
- Row click navigates to the scan detail page

---

### Screen 3 — Active Scan Detail (Live Console)

Uses the same sidebar layout as Screen 2. Shows a real-time view of an active penetration test.

**Top section:**
- Circular SVG progress ring (percentage + "In Progress" label) on the left
- Horizontal step tracker on the right: Spidering → Mapping → Testing → Validating → Reporting
- Active step highlighted in teal with a glow effect
- Metadata row: Scan Type, Targets, Started At, Credentials, Files, Checklists

**Console section (split panel):**
- Left — Live Scan Console with two tabs:
  - **Activity Log**: timestamped terminal output with color-coded inline highlights (URLs in teal, paths in teal, headers in purple, keywords in amber, vulnerabilities in red)
  - **Verification Loops**: focused re-verification log entries
- Right — Finding Log: stacked vulnerability cards each showing severity badge, timestamp, title, endpoint path, and description

**Status bar:**
- Sub-Agents, Parallel Executions, Operations counts
- Per-severity counts: Critical, High, Medium, Low

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Auth | `localStorage` (client-side, no backend) |
| Data | Hardcoded JSON (no external API) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/mdfaizan973/Frontend-Design-FS-.git
cd fs-frontend-challenge
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
---

## Authentication Flow

This project uses `localStorage` as a lightweight client-side auth layer — no backend or database required.

1. User fills the sign-up form on `/`
2. On success, credentials are saved to `localStorage` under the key `aps_user`
3. User is redirected to `/screens/dashboard`
4. On subsequent visits, if `aps_user` exists in storage the login form is shown pre-selected
5. Logging out removes `aps_user` from storage and redirects back to `/`

> **Note:** This is a demo implementation. In production, replace `localStorage` auth with a proper authentication provider (NextAuth, Clerk, Supabase, etc.)

---

## Dark / Light Mode

All three screens support full dark and light themes. The theme state is controlled by a toggle button in the header and sidebar. It reads the system preference on first load via `window.matchMedia("(prefers-color-scheme: dark)")` and applies the `dark` class to `document.documentElement`.

---

## Deployment

The project is deployed on Vercel. To deploy your own instance:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository directly in the [Vercel dashboard](https://vercel.com/dashboard) for automatic deployments on every push to `main`.

---

## License

MIT
