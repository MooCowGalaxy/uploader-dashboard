import {discordInvite} from "../vars";
import {Link, useLocation} from "react-router-dom";

function Sidebar({sidebarOpen, setSidebarOpen}) {
    const location = useLocation();
    const path = location.pathname.slice(10)

    const isActive = (p) => {
        return p === path ? 'active' : '';
    }

    const closeSidebarSmall = () => {
        if (window.innerWidth <= 640) setSidebarOpen(false)
    }

    return (
        <>
            <div
                className={`bg-blue-sidebar p-5 w-screen sm:w-60 flex-initial z-10 sm:absolute d-flex-col justify-between ${sidebarOpen ? '' : 'closed'}`}
                id="sidebar">
                <div>
                    <div className="flex justify-between">
                        <h1 className="text-lg font-bold">Dashboard</h1>
                        <button onClick={() => {
                            setSidebarOpen(false)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:hidden" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <hr className="my-2 border-slate-400"/>
                    <Link to="/dashboard">
                        <div className={`sidebar-item ${isActive('')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <p>&nbsp;Home</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/user">
                        <div className={`sidebar-item ${isActive('/user')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <p>&nbsp;User Settings</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/embed">
                        <div className={`sidebar-item ${isActive('/embed')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                            </svg>
                            <p>&nbsp;Embed Settings</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/gallery">
                        <div className={`sidebar-item ${isActive('/gallery')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <p>&nbsp;Image Gallery</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/domains">
                        <div className={`sidebar-item ${isActive('/domains')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                            </svg>
                            <p>&nbsp;Domains</p>
                        </div>
                    </Link>
                    <Link to="/dashboard/donate">
                        <div className={`sidebar-item ${isActive('/donate')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                            <p>&nbsp;Donate</p>
                        </div>
                    </Link>
                    <hr className="my-2 border-slate-400"/>
                    <Link to="/dashboard/rules">
                        <div className={`sidebar-item ${isActive('/rules')}`} onClick={closeSidebarSmall}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p>&nbsp;Rules</p>
                        </div>
                    </Link>
                    <a className="sidebar-item inline-block w-full" href={discordInvite}
                       target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6"
                             viewBox="-2 -2 20 20">
                            <path
                                d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                        </svg>
                        <p>&nbsp;Discord</p>
                    </a>
                </div>
                <div>
                    <p>© 2022 uploader.tech</p>
                </div>
            </div>
            <div id="sidebar-placeholder" className={`hidden sm:inline-block ${sidebarOpen ? '' : 'closed'}`}/>
        </>
    );
}

export default Sidebar;
