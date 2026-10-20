import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { AppContextProvider } from './context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_c2V0LW1hY2F3LTgwMjEuY2xlcmsuYWNjb3VudHMuZGV2JA';

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AppContextProvider>
        <Toaster />
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>
)
