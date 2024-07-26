import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 7.10
import { NotificationContextProvider } from './NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
)