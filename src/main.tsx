import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { useLibraryStore } from './store/useLibraryStore'

// Expose store globally for automated headless E2E verification
if (typeof window !== 'undefined') {
  (window as any).useLibraryStore = useLibraryStore;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
