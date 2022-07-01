import {useAuth} from "../services/auth";
import {useEffect, useRef, useState} from "react";
import sendReq from "../services/sendReq";
import toast from "react-hot-toast";
import OutsideAlerter from "../components/outsideAlerter";

function Domains({setModalData}) {
    const auth = useAuth()
    const [userDomain, setUserDomain] = useState(auth.user.domain.split('.').length === 3 ? auth.user.domain.split('.').slice(1).join('.') : auth.user.domain)
    const [newUserDomain, setNewUserDomain] = useState(userDomain)
    const [subdomain, setSubdomain] = useState(auth.user.domain.split('.').length === 3 ? auth.user.domain.split('.')[0] : '')
    const [newSubdomain, setNewSubdomain] = useState(subdomain)

    const [addDomain, setAddDomain] = useState('')

    const [publicDomainList, setPublicDomainList] = useState(null)
    const [domainList, setDomainList] = useState(null)
    const [openedContextMenu, setOpenedContextMenu] = useState(0)
    const [isSaving, setIsSaving] = useState(false)

    const [modal2Data, setModal2Data] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalInputValid, setIsModalInputValid] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [modalState, setModalState] = useState(0)
    // 0: enter domain, 1: show nameservers
    const modal2 = useRef(null)
    const regexp = /^([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[-a-zA-Z0-9]{2,20}$/

    useEffect(() => {
        sendReq('/api/domains')
            .then(res => {
                setPublicDomainList(res.data.domains)
            })
            .catch()
    }, [])
    useEffect(() => {
        sendReq('/api/domains/self')
            .then(res => {
                setDomainList(res.data.domains)
            })
            .catch()
    }, [])

    const isValid = () => {
        if (subdomain === newSubdomain && userDomain === newUserDomain) return false
        else return subdomain.length <= 20;
    }

    const onDomainInput = (e) => {
        let newSubdomain = e.target.value
        let allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-'.split('')
        let filtered = ''
        for (let character of newSubdomain) {
            if (allowed.includes(character)) {
                filtered = `${filtered}${character}`
            }
        }
        setNewSubdomain(filtered.split('').join(''))
    }

    const saveDomain = () => {
        if (!isValid()) return;
        setIsSaving(true)
        sendReq('/api/user/domains/domain', {method: 'POST', data: {domain: newUserDomain, subdomain: newSubdomain}})
            .then(() => {
                setIsSaving(false)

                toast.success((
                    <b>Saved domain settings!</b>
                ))
                auth.reloadData().then()
                setUserDomain(newUserDomain)
                setSubdomain(newSubdomain)
            })
            .catch(() => {
                setIsSaving(false)
            })
    }
    const onToggleDomain = (id) => {
        const domains = domainList.filter(e => e.id === id)
        if (domains.length === 0) return;
        const domain = domains[0]

        const onModalButton1Click = () => {
            setModalData(data => {
                data.visible = false
                return {...data}
            })
            setTimeout(() => {
                setModalData({})
            }, 500)
        }
        const onModalButton2Click = () => {
            setModalData(data => {
                data.closable = false
                return {...data}
            })
            document.getElementById('modal-button-1').disabled = true
            document.getElementById('modal-button-2').disabled = true
            document.getElementById('modal-button-2').innerText = 'Updating...'
            sendReq('/api/domains/self/visibility', {method: 'POST', data: {domainId: domain.id, public: false}})
                .then(() => {
                    const button2 = document.getElementById('modal-button-2')
                    button2.innerText = 'Updated'
                    button2.classList.remove('bg-red-400')
                    button2.classList.add('bg-green-400')
                    setDomainList(list => {
                        let newList = []
                        for (let d of list) {
                            if (d.id === domain.id) {
                                d.public = false
                            }
                            newList.push(d)
                        }
                        return newList
                    })
                    setTimeout(() => {
                        setModalData(data => {
                            data.closable = true
                            data.visible = false
                            return {...data}
                        })
                        setTimeout(() => {
                            setModalData({})
                        }, 500)
                    }, 1500)
                }).catch(() => {
                    setModalData(data => {
                        data.closable = true
                        data.visible = false
                        return {...data}
                    })
                    setTimeout(() => {
                        setModalData({})
                    }, 500)
                })
        }

        if (domain.public) {
            setOpenedContextMenu(0)
            setModalData({
                title: 'Are you sure?',
                description: 'If you change the domain to a private domain, all other users that are using this domain will be reset to the default domain.',
                iconColor: 'bg-red-100',
                iconSVG: <svg key="modalSVG" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>,
                buttons: <>
                    <button key={1} id="modal-button-1" onClick={onModalButton1Click}
                            className="px-3 py-2 rounded-lg font-semibold bg-slate-200 disabled:opacity-75">Cancel
                    </button>
                    <button key={2} id="modal-button-2" onClick={onModalButton2Click}
                            className="px-3 py-2 rounded-lg bg-red-400 disabled:opacity-75">Confirm
                    </button>
                </>,
                closable: true,
                visible: true,
                updated: Date.now()
            })
        } else {
            sendReq('/api/domains/self/visibility', {method: 'POST', data: {domainId: domain.id, public: true}})
                .then(() => {
                    setDomainList(list => {
                        let newList = []
                        for (let d of list) {
                            if (d.id === domain.id) {
                                d.public = true
                            }
                            newList.push(d)
                        }
                        return newList
                    })
                    toast.success((
                        <b>Set domain to public!</b>
                    ))
                    setOpenedContextMenu(0)
                }).catch()
        }
    }
    const onDeleteDomain = (id) => {
        const domains = domainList.filter(e => e.id === id)
        if (domains.length === 0) return;
        const domain = domains[0]

        const onModalButton1Click = () => {
            setModalData(data => {
                data.visible = false
                return {...data}
            })
            setTimeout(() => {
                setModalData({})
            }, 500)
        }
        const onModalButton2Click = () => {
            setModalData(data => {
                data.closable = false
                return {...data}
            })
            document.getElementById('modal-button-1').disabled = true
            document.getElementById('modal-button-2').disabled = true
            document.getElementById('modal-button-2').innerText = 'Deleting...'
            sendReq('/api/user/domains/delete', {method: 'POST', data: {domainId: domain.id}})
                .then(() => {
                    const button2 = document.getElementById('modal-button-2')
                    button2.innerText = 'Deleted'
                    button2.classList.remove('bg-red-400')
                    button2.classList.add('bg-green-400')
                    setDomainList(list => {
                        let newList = []
                        for (let d of list) {
                            if (d.id !== domain.id) newList.push(d)
                        }
                        return newList
                    })
                    setTimeout(() => {
                        setModalData(data => {
                            data.closable = true
                            data.visible = false
                            return {...data}
                        })
                        setTimeout(() => {
                            setModalData({})
                        }, 500)
                    }, 1500)
                }).catch(() => {
                setModalData(data => {
                    data.closable = true
                    data.visible = false
                    return {...data}
                })
                setTimeout(() => {
                    setModalData({})
                }, 500)
            })
        }

        setOpenedContextMenu(0)
        setModalData({
            title: 'Are you sure?',
            description: `This action is irreversible. Once you remove this domain from Uploader, you${domain.public ? ' (and anyone else using your domain)' : ''} will not be able to use the domain. However, you will be able to add the domain back later.`,
            iconColor: 'bg-red-100',
            iconSVG: <svg key="modalSVG" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>,
            buttons: <>
                <button key={1} id="modal-button-1" onClick={onModalButton1Click}
                        className="px-3 py-2 rounded-lg font-semibold bg-slate-200 disabled:opacity-75">Cancel
                </button>
                <button key={2} id="modal-button-2" onClick={onModalButton2Click}
                        className="px-3 py-2 rounded-lg bg-red-400 disabled:opacity-75">Confirm
                </button>
            </>,
            closable: true,
            visible: true,
            updated: Date.now()
        })
    }

    const ownedDomains = []
    if (domainList !== null) {
        for (let domain of domainList) {
            let status = ['INACTIVE', 'PENDING_NS', 'ACTIVE'].indexOf(domain.status)
            ownedDomains.push((
                <div key={domain.id} className="mb-2 rounded-md bg-white dark:bg-slate-900 px-4 py-2 flex justify-between">
                    <div>
                        <h1 className="font-semibold">{domain.domain}</h1>
                        <p>Status: <b className={['text-gray-600', 'text-yellow-600', 'text-green-600'][status]}>{domain.status !== 'PENDING_NS' ? (domain.status[0] + domain.status.slice(1).toLowerCase()) : 'Pending Nameservers'}</b></p>
                        <p>Visibility: <b className={domain.public ? 'text-green-600' : 'text-red-600'}>{domain.public ? 'Public' : 'Not public'}</b></p>
                    </div>
                    <div className="h-min my-auto relative">
                        <button onClick={() => setOpenedContextMenu(domain.id)}>
                            Actions&nbsp;
                            <i className={`bi bi-chevron-${openedContextMenu === domain.id ? 'up' : 'down'}`} />
                        </button>
                        <OutsideAlerter onOutsideClick={() => setOpenedContextMenu(0)}
                                        className={`origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white z-50 ${openedContextMenu === domain.id ? '' : 'hidden'}`}>
                            <button className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 no-transition font-semibold" role="menuitem"
                                    tabIndex="-1" onClick={() => onToggleDomain(domain.id)}>Toggle visibility</button>
                            <button className="w-full block px-4 py-2 text-sm text-red-600 hover:bg-gray-300 no-transition font-semibold" role="menuitem"
                                    tabIndex="-1" onClick={() => onDeleteDomain(domain.id)}>Remove domain</button>
                        </OutsideAlerter>
                    </div>
                </div>
            ))
        }
    }
    const setNewDomain = (id) => {
        const domains = publicDomainList.filter(e => e.id === id)
        if (domains.length === 0) return;
        const domain = domains[0]
        if (domain.domain === newUserDomain) return;
        setNewUserDomain(domain.domain)
        onDomainInput({target: {value: newSubdomain}})
        toast.success(
            <p>
                <b>Changed domain!</b> Click on Save Changes to use your new domain.
            </p>,
            {duration: 4000}
        )
    }

    const publicDomains = []
    if (publicDomainList !== null) {
        for (let domain of publicDomainList) {
            publicDomains.push((
                <tr className="bg-gray-100 dark:bg-inherit border-b dark:border-gray-600/75" key={`domain-row-${domain.id}`}>
                    <td className="px-4 py-2 whitespace-nowrap text-md font-semibold text-gray-900 dark:text-gray-200">{domain.id}</td>
                    <td className="text-md text-gray-900 dark:text-gray-200 font-normal px-4 py-2 whitespace-nowrap">
                        {domain.domain}
                    </td>
                    <td className="text-md text-gray-900 dark:text-gray-200 font-normal px-4 py-2 whitespace-nowrap">
                        {domain.ownerId}
                    </td>
                    <td className="text-md text-gray-900 font-semibold px-4 py-2 whitespace-nowrap">
                        <button
                            className="bg-green-400 text-white dark:text-black px-4 py-1 rounded-md disabled:opacity-75 disabled:bg-gray-300 disabled:text-gray-500 no-transition"
                            disabled={domain.domain === newUserDomain} onClick={() => setNewDomain(domain.id)}>Use Domain
                        </button>
                    </td>
                </tr>
            ))
        }
    }

    const domainAdd = (e) => {
        setAddDomain(e.target.value)
        setIsModalInputValid(regexp.test(e.target.value))
    }

    const addNewDomain = () => {
        setIsModalOpen(true)
        setModalState(0)
    }

    useEffect(() => {
        modal2.current.addEventListener('transitionend', () => {
            if (!modal2.current.classList.contains('visible')) {
                modal2.current.style.zIndex = -100
            }
        }, true)
        modal2.current.addEventListener('transitionrun', () => {
            if (modal2.current.classList.contains('visible')) {
                modal2.current.style.zIndex = 20
            }
        })
    }, [modal2])

    const onOutside2Click = () => {
        if (!isModalLoading) setIsModalOpen(false)
    }

    const onNewDomain = () => {
        if (!regexp.test(addDomain)) return;
        setIsModalLoading(true)
        sendReq('/api/user/domains/create', {method: 'POST', data: {domain: addDomain}})
            .then(res => {
                setIsModalLoading(false)
                const originalNS = []
                let i = 0;
                for (let NS of res.data.originalNS) {
                    originalNS.push((
                        <p key={`old-${i}`}><code>{NS}</code></p>
                    ))
                    i++
                }
                const newNS = []
                i = 0
                for (let NS of res.data.newNS) {
                    newNS.push((
                        <p key={`new-${i}`}><code>{NS}</code></p>
                    ))
                    i++
                }
                setModal2Data({originalNS, newNS})
                setModalState(1)
            }).catch(() => {
                setIsModalLoading(false)
        })
    }

    return (
        <div>
            <div key="your-domains" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="content">
                    <h1 className={domainList !== null ? 'mb-2' : ''}>Your Domains</h1>
                    {domainList !== null ? ownedDomains : <p>You don't own any custom domains.</p>}
                    <button onClick={addNewDomain} className="bg-sky-500 px-4 py-1 rounded-md font-semibold text-white disabled:opacity-75 disabled:bg-gray-300 disabled:text-gray-600">
                        Add New Domain
                    </button>
                </div>
                <div className="content">
                    <h1 className="mb-2">Your Domain Settings</h1>
                    <div className="flex justify-start mb-2">
                        <div className="max-w-3xl">
                            <input type="text"
                                   className="form-control inline-block px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-400 bg-white dark:bg-slate-900 bg-clip-padding border border-solid border-gray-300 dark:border-gray-600 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   placeholder="Subdomain" value={newSubdomain} onChange={onDomainInput} maxLength="20"/>
                            <span
                                className="inline-block px-3 py-1.5 -translate-x-0.5 text-base font-normal text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 bg-clip-padding border border-solid border-gray-300 dark:border-gray-600 rounded-r">.{newUserDomain}</span>
                        </div>
                    </div>
                    <button className="bg-green-400 px-4 py-2 mb-3 text-white font-semibold dark:text-black rounded-md disabled:opacity-75 disabled:bg-gray-300 disabled:text-gray-500"
                            disabled={!isValid() || isSaving} onClick={saveDomain}>Save
                    </button>
                    <p>Leave the subdomain blank to use no subdomain.</p>
                </div>
            </div>
            <div key="available-domains" className="content">
                <h1>Available Domains</h1>
                <p>Below, you can find all available domains for use.</p>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-white dark:bg-gray-800 border-b">
                                        <tr>
                                            <th scope="col"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-200 px-4 py-2 text-left">
                                                ID
                                            </th>
                                            <th scope="col"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-200 px-4 py-2 text-left">
                                                Domain
                                            </th>
                                            <th scope="col"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-200 px-4 py-2 text-left">
                                                Owner ID
                                            </th>
                                            <th scope="col"
                                                className="text-sm font-medium text-gray-900 dark:text-gray-200 px-4 py-2 text-left">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publicDomains}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div key="modal-2" id="modal-2" ref={modal2}
                 className={`custom-modal d-flex-col justify-between fixed top-0 left-0 w-screen h-screen ${isModalOpen ? 'visible' : ''}`}
                 style={{'zIndex': -100}}>
                <div/>
                <div className="px-3 modal-container">
                    <OutsideAlerter onOutsideClick={onOutside2Click} className="mx-auto w-fit">
                        <div className="container max-w-2xl shadow-lg">
                            <div className="bg-white px-5 pt-4 pb-3 rounded-tl-lg rounded-tr-lg d-flex-row">
                                <div className="mr-3 flex-initial">
                                    <div className={`h-12 w-12 p-2 rounded-full ${modalState === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
                                        {modalState === 0 ? <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24"
                                                                 stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none"
                                                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 key="text-header" className="font-semibold text-lg text-black">Custom Domains</h1>
                                    {modalState === 0 ? <>
                                            <p className="mb-2">With custom domains, you can use your own domain as an image host! To use your domain, you will need to change the nameservers of the domain.</p>
                                            <div className="flex justify-start">
                                                <div className="mb-3 w-full">
                                                    <label htmlFor="page-embed-input-description"
                                                           className="form-label inline-block mb-1 text-gray-700 font-semibold">Domain</label>
                                                    <input type="text" maxLength={200}
                                                           className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                           value={addDomain}
                                                           onInput={domainAdd} placeholder="Domain"/>
                                                </div>
                                            </div>
                                        </> : <>
                                            <p key="text-0" className="mb-4">Great! Your domain has been added to our systems and is pending confirmation. There is one last step before you can use your domain with us!</p>
                                            <div key="text-1" className="mb-2">
                                                <p key="old">Remove these nameservers:</p>
                                                {modal2Data.originalNS}
                                            </div>
                                            <div key="text-2" className="mb-4">
                                                <p key="new">... and add these nameservers:</p>
                                                {modal2Data.newNS}
                                            </div>
                                            <p key="text-3">It may take up to 24 hours after you set these nameservers for your domain to be confirmed. If the domain is not confirmed after three days, it will automatically be deleted from our system.</p>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="bg-neutral-200 px-5 py-3 rounded-bl-lg rounded-br-lg flex justify-between">
                                <div/>
                                <div className="d-flex-row grid gap-3">
                                    {modalState === 0 ? <>
                                        <button key={1} id="modal-2-button-1" onClick={() => setIsModalOpen(false)}
                                                disabled={isModalLoading} className="px-3 py-2 rounded-lg font-semibold disabled:opacity-75">Cancel
                                        </button>
                                        <button key={2} id="modal-2-button-2" onClick={onNewDomain}
                                                disabled={!isModalInputValid || isModalLoading} className="px-3 py-2 rounded-lg bg-sky-400 text-white font-semibold disabled:opacity-75 disabled:bg-gray-300 disabled:text-gray-600">Add
                                        </button>
                                    </> : <button key={3} onClick={() => setIsModalOpen(false)} className="px-3 py-2 rounded-lg bg-green-400 text-white font-semibold">
                                        Done
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </OutsideAlerter>
                </div>
                <div/>
            </div>
        </div>
    )
}

export default Domains;
