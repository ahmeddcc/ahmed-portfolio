import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataContext.jsx'

// استعادة المسار الأصلي عند الدخول المباشر (SPA fallback)
const redirect = sessionStorage.redirect;
if (redirect) {
  sessionStorage.removeItem('redirect');
  const url = new URL(redirect);
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
