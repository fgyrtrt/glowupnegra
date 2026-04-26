import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// MANUEL SIFIRLAMA KOMUTU (Tek seferlik çalıştıktan sonra isterseniz kaldırabilirsiniz)
// localStorage.clear();

createRoot(document.getElementById('root')).render(
  <App />
)
