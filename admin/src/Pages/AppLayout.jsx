import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <div className='mx-4 sm:mx-[10%]'>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout