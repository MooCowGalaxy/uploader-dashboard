import {BrowserRouter} from 'react-router-dom';
import './App.css';
import Headers from "./components/headers";
import {AuthProvider} from "./services/auth";
import Navbar from "./components/navbar";
import Container from "./components/container";
import {useEffect, useRef, useState} from "react";
import {Toaster} from 'react-hot-toast'
import OutsideAlerter from "./components/outsideAlerter";

function App() {
    const [modalData, setModalData] = useState({});
    // {title, description, iconColor, iconSVG, buttons, closable: boolean, visible: boolean, updated: Date}
    const modal = useRef(null)

    useEffect(() => {
        modal.current.addEventListener('transitionend', () => {
            if (!modal.current.classList.contains('visible')) {
                modal.current.style.zIndex = -100
            }
        }, true)
        modal.current.addEventListener('transitionrun', () => {
            if (modal.current.classList.contains('visible')) {
                modal.current.style.zIndex = 20
            }
        })
    }, [modal])

    const onOutsideClick = () => {
        setModalData(data => {
            if (data.closable) data.visible = false
            return {...data}
        })
    }

    return (
        <>
            <Headers/>
            <BrowserRouter>
                <AuthProvider>
                    <Navbar/>
                    <Container setModalData={setModalData} />
                </AuthProvider>
            </BrowserRouter>
            <div id="modal" ref={modal}
                 className={`custom-modal d-flex-col justify-between fixed top-0 left-0 w-screen h-screen ${modalData.visible ? 'visible' : ''}`}
                 style={{'zIndex': -100}}>
                <div/>
                <div className="modal-container px-3">
                    <OutsideAlerter onOutsideClick={onOutsideClick} className="mx-auto w-fit">
                        <div className="container max-w-2xl shadow-lg">
                            <div className="bg-white px-5 pt-4 pb-3 rounded-tl-lg rounded-tr-lg d-flex-row">
                                <div className="mr-3 flex-initial">
                                    <div className={`h-12 w-12 p-2 rounded-full ${modalData.iconColor}`}>
                                        {modalData.iconSVG}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="font-semibold text-lg text-black">{modalData.title}</h1>
                                    <p className="text-base text-gray-600">{modalData.description}</p>
                                </div>
                            </div>
                            <div className="bg-neutral-200 px-5 py-3 rounded-bl-lg rounded-br-lg flex justify-between">
                                <div/>
                                <div className="d-flex-row grid gap-3">
                                    {modalData.buttons}
                                </div>
                            </div>
                        </div>
                    </OutsideAlerter>
                </div>
                <div/>
            </div>
            <Toaster position="top-right" reverseOrder={false}/>
        </>
    );
}

export default App;
