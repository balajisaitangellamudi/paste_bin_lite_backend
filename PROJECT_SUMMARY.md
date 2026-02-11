# Pastebin-Lite Frontend

A lightweight, production-ready React frontend for a Pastebin-style application.  
This project focuses on simplicity, clean UI, and reliable integration with a backend API.

---

# Overview

This frontend allows users to:

- Create text pastes
- Set optional expiration time (TTL)
- Limit the number of views
- Share pastes via a unique URL
- View pastes with metadata (remaining views, expiry)
- Copy content or links easily
- Handle all error cases gracefully

The UI is fully responsive and works across desktop, tablet, and mobile devices.

---

# 🛠 Tech Stack

- React 18 – Functional components and hooks
- React Router v6 – Client-side routing
- Vite – Fast development and build tooling
- Bootstrap 5 – Styling via CDN
- Bootstrap Icons – Icon library
- Fetch API – Native HTTP requests

---

# 📄 Pages

# 1. Create Paste (`/`)

- Large textarea for paste content
- Live character counter
- Optional TTL (time-to-live in seconds)
- Optional max views
- Client-side validation
- Loading state during submission
- Success message with generated URL
- Copy URL button
- Create another paste option

---

# 2. View Paste (`/p/:id`)

- Fetches paste content from backend
- Displays:
  - Remaining views (if limited)
  - Expiration date/time (if set)
- Copy content button
- Handles all error states:
  - Paste not found
  - Paste expired
  - View limit exceeded
- Safe content rendering (XSS-protected)

---

# ⚙️ Setup Instructions

# 1. Install Dependencies

```bash
npm install
```
