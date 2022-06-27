import {useAuth} from "../services/auth";
import {useState} from "react";
import OutsideAlerter from "./outsideAlerter";

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const auth = useAuth()

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
                            <button className="text-white" id="navbar-dropdown" onClick={onDropdownClick}>
                                {auth.data.username}<span id="discriminator">#{auth.data.discriminator}&nbsp;</span>
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
