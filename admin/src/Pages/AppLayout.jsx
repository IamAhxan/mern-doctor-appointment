import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AppLayout = () => {
    const notify = () => toast("Wow so easy!");
    return (
        <div className=''>
            <Navbar />


            <main className='flex items-start'>
                <Sidebar />
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout