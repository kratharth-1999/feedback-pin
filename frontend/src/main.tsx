import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PinsProvider } from './context/PinsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PinsProvider>
      <App />
    </PinsProvider>
  </StrictMode>,
)
