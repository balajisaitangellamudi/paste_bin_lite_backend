# Pastebin-Lite Frontend

A clean, responsive frontend for the Pastebin-Lite application built with React, Vite, and Bootstrap.

# Features

- ✨ Create text pastes with optional expiry and view limits
- 🔗 Get shareable URLs for pastes
- 👁️ View pastes with proper constraint handling
- 📱 Responsive design works on all devices
- 🎨 Bootstrap 5 UI with icons
- ⚡ Fast development with Vite

# Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Your Pastebin-Lite backend running

# Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

# Running Locally

1. **Start your backend server** (make sure it's running on port 5000 or update `vite.config.js`)

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**

   Navigate to `http://localhost:3000`

## Configuration

### Backend URL

The frontend is configured to proxy API requests to `http://localhost:5000`. If your backend runs on a different port, update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:YOUR_PORT", // Change this
        changeOrigin: true,
      },
    },
  },
});
```

# Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

# Features Implemented

## Create Paste Page (/)

- Text input area with character counter
- Optional TTL (time-to-live) in seconds
- Optional maximum view count
- Form validation
- Success message with shareable URL
- Copy to clipboard functionality

# View Paste Page (/p/:id)

- Displays paste content
- Shows remaining views (if limited)
- Shows expiration time (if set)
- Error handling for expired/missing pastes
- Copy content to clipboard
- Clean monospace formatting

# UI/UX Features

- Responsive Bootstrap design
- Loading states
- Error messages with clear feedback
- Icons from Bootstrap Icons
- Dark navigation bar
- Success alerts with action buttons
- Professional styling

# API Integration Points

The frontend expects these backend endpoints:

- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste data (counts as a view)
- `GET /p/:id` - View paste as HTML (handled by backend)

# Technologies Used

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library

# Development Notes

- The app uses React Router for navigation
- API calls use the native Fetch API
- Bootstrap CDN is used (no local installation needed)
- Vite proxy handles CORS during development
- All forms include validation
- Error states are handled gracefully

# Common Issues

# Backend not reachable

- Ensure your backend is running
- Check the proxy configuration in `vite.config.js`
- Verify the backend port matches the proxy target

# Routes not working

- React Router handles client-side routing
- For production, configure your server to serve `index.html` for all routes

# Styles not loading

- Bootstrap is loaded from CDN in `index.html`
- Custom styles are in `src/App.css`
- Ensure both files are present

## Future Enhancements

- [ ] Syntax highlighting for code pastes
- [ ] Dark mode toggle
- [ ] Paste history (with localStorage)
- [ ] Password protection for pastes
- [ ] Custom short URLs
- [ ] Download paste as file
- [ ] Paste editing before submission
