// 🟢 FIXED App.jsx (Acts as the Auth Guard for all its children routes)
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom' // Import Navigate and Outlet
import { AdminContext } from './context/AdminContext'
// Don't import Login here, let the router handle it
// Don't import Sidebar here, let AppLayout handle it

const App = () => {
  const { aToken } = useContext(AdminContext)

  // 1. If NOT logged in, redirect to /login (or show Login page)
  if (!aToken) {
    return <Navigate to="/login" replace />
    // OR if you want Login to be a child component that *doesn't* use AppLayout
    // you would return <Login /> if /login was not a separate route.
  }

  // 2. If logged in, render the protected children routes via Outlet
  return <Outlet />
}

export default App