import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Sidebar from "./sidebar";
import Home from "../pages/home";
import User from "../pages/user";
import Embed from "../pages/embed";
import Gallery from "../pages/gallery";
import Donate from "../pages/donate";
import Domains from "../pages/domains";
import Rules from "../pages/rules";
import {useEffect, useState} from "react";

const titleMapping = {
    '': 'Home',
    '/user': 'User Settings',
    '/embed': 'Embed Settings',
    '/gallery': 'Image Gallery',
    '/domains': 'Domains',
    '/donate': 'Donate',
    '/rules': 'Rules'
}

function Container({setModalData}) {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 640)
    const [title, setTitle] = useState(titleMapping[window.location.pathname.slice(10)])
    const location = useLocation();

    useEffect(() => {
        setTitle(titleMapping[location.pathname.slice(10)])
    }, [location])

    return (
        <div className="w-full text-black flex-1-1 d-flex-row relative">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div id="container" className="p-5 bg-white">
                <div className="relative flex-initial">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="absolute rounded-md p-2 border border-slate-700 inline-block hover-cursor"
                            id="toggle-sidebar-button">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                    <div className="flex justify-center">
                        <h1 className="text-3xl font-semibold mb-5" id="page-title">{title}</h1>
                    </div>
                    <div id="content-container" className="flex-1 relative">
                        <Routes>
                            <Route path='/dashboard' element={<Home/>}/>
                            <Route path='/dashboard/user'
                                   element={<User setModalData={setModalData}/>}/>
                            <Route path='/dashboard/embed' element={<Embed/>}/>
                            <Route path='/dashboard/gallery' element={<Gallery/>}/>
                            <Route path='/dashboard/domains' element={<Domains setModalData={setModalData} />}/>
                            <Route path='/dashboard/donate' element={<Donate/>}/>
                            <Route path='/dashboard/rules' element={<Rules/>}/>
                            <Route path='/*' element={<Navigate to="/dashboard"/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Container;
