import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    const notify = () => toast("Wow so easy!");
    return (
        <div className=''>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout