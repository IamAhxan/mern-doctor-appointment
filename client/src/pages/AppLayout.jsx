import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer.jsx'

const AppLayout = () => {
    return (
        <div className='mx-4 sm:mx-[10%]'>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout