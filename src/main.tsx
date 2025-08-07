import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from './lib/sentry'
import './lib/analytics'

// Khởi tạo Sentry trước khi render ứng dụng
initSentry();

createRoot(document.getElementById("root")!).render(
  <App />
);
