import React, { useContext } from 'react'

import Login from './Pages/Login'
import { AdminContext } from './context/AdminContext'

const App = () => {
  const { aToken } = useContext(AdminContext)

  return (
    <>
      {aToken ? (
        <div>
          <h1>Welcome Admin!</h1>
        </div>
      ) : (
        <div>
          <Login />
        </div>
      )}
    </>
  )
}

export default App