import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
    const navigate = useNavigate()
    const { speciality } = useParams()
    const { doctors } = useContext(AppContext)
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const specialities = [...new Set(doctors.map(doc => doc.speciality))];


    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        } else {
            setFilterDoc(doctors)
        }
    }
    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* ---LEFT SIDE--- */}
                <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
                <div className={` flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {
                        specialities.map((item) => (
                            <p onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item ? "bg-indigo-100 text-black" : ""}`}>{item}</p>
                        ))
                    }
                </div>

                {/* ---RIGHT SIDE ---- */}
                <div className='w-full grid grid-cols-(--grid-cols-auto) gap-4 gap-y-6'>
                    {
                        filterDoc.map((item, index) => (
                            <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500'>
                                <img src={item.image} alt="" className='bg-blue-50' />
                                <div className='p-4 '>
                                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                    </div>
                                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Doctors