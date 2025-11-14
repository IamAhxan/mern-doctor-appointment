import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import routes from './../routes.jsx'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
import { ToastContainer, toast } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <AdminContextProvider>
    <DoctorContextProvider>
      <AppContextProvider>
        <RouterProvider router={routes} />
        <ToastContainer />
      </AppContextProvider>
    </DoctorContextProvider>
  </AdminContextProvider>
)
