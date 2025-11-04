import { createBrowserRouter } from "react-router-dom";
import Home from "./src/pages/Home.jsx";
import Doctors from "./src/pages/Doctors.jsx";
import Login from "./src/pages/Login.jsx";
import About from "./src/pages/About.jsx";
import Contact from "./src/pages/Contact.jsx";
import MyProfile from "./src/pages/MyProfile.jsx";
import MyAppointments from "./src/pages/MyAppointments.jsx";
import Appointment from "./src/pages/Appointment.jsx";
import AppLayout from "./src/pages/AppLayout.jsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [

            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/doctors",
                element: <Doctors />,
            },
            {
                path: "/doctors/:speciality",
                element: <Doctors />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/my-profile",
                element: <MyProfile />,
            },
            {
                path: "/my-appointments",
                element: <MyAppointments />,
            },
            {
                path: "/appointment/:docId",
                element: <Appointment />,
            },
        ]
    }
]) 