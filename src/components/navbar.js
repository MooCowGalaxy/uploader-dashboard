import {useAuth} from "../services/auth";
import {useState} from "react";
import OutsideAlerter from "./outsideAlerter";

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(window.localStorage.getItem('dark') !== undefined ? window.localStorage.getItem('dark') === 'true' : undefined)
    const auth = useAuth()

    if (darkMode === undefined) {
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                window.localStorage.setItem('dark', 'true')
                setDarkMode(true)
            } else {
                window.localStorage.setItem('dark', 'false')
                setDarkMode(false)
            }
        } else {
            window.localStorage.setItem('dark', 'false')
            setDarkMode(false)
        }
    }
    if (darkMode !== undefined) {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            document.documentElement.classList.add('dark-background')
        } else {
            document.documentElement.classList.remove('dark')
            document.documentElement.classList.remove('dark-background')
        }
    }

    const onDarkModeClick = () => {
        if (darkMode) {
            window.localStorage.setItem('dark', 'false')
            setDarkMode(false)
        } else {
            window.localStorage.setItem('dark', 'true')
            setDarkMode(true)
        }
    }

    const onDropdownClick = () => {
        setDropdownOpen(!dropdownOpen)
    }
    const onOutsideClick = () => {
        setDropdownOpen(false)
    }

    return (
        <nav className="bg-gray-800 sticky top-0 z-50 flex-none">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex justify-start items-stretch">
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/" className="text-3xl font-bold select-none"><span
                                className="gradient bg-text-gradient-logo">Uploader</span></a>
                        </div>
                    </div>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="ml-3 relative">
                            <button id="navbar-dark" className="rounded-full mr-2 align-middle inline-block no-transition" onClick={onDarkModeClick}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="block text-white h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    {darkMode ?
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /> :
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    }
                                </svg>
                            </button>
                            <button className="text-white align-middle inline-block" id="navbar-dropdown" onClick={onDropdownClick}>
                                {auth.data.username}<span id="discriminator" className={auth.data.discriminator === '0' ? 'hidden' : ''}>#{auth.data.discriminator}</span>&nbsp;
                                <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`}
                                   id="navbar-dropdown-icon"/>
                            </button>
                            <OutsideAlerter onOutsideClick={onOutsideClick} id="n-dropdown"
                                            className={`origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white ${dropdownOpen ? '' : 'hidden'}`}>
                                <a href="/auth/logout"
                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300" role="menuitem"
                                   tabIndex="-1" id="user-menu-item-2">Sign out</a>
                            </OutsideAlerter>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
