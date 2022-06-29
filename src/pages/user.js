import {useAuth} from "../services/auth";
import {useRef, useState} from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import sendReq from "../services/sendReq";
import toast from "react-hot-toast";

function User({setModalData}) {
    const auth = useAuth()
    const [apiKeyViewable, setApiKeyViewable] = useState(false)
    const [apiKeyCopied, setApiKeyCopied] = useState(false)
    const [linkTypeChanged, setLinkTypeChanged] = useState(false)
    const [linkType, setLinkType] = useState(auth.user.settings.linkType.toString())
    const [linkTypeState, setLinkTypeState] = useState(0)
    // 0: N/A - 1: saving
    const apiKey = useRef(null)
    const copyApiKey = useRef(null)

    const path = apiKeyViewable ? <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </>
        : <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>

    const onApiKeyCopy = () => {
        setApiKeyCopied(true)
        setTimeout(() => setApiKeyCopied(false), 1000)
    }

    const regenerateKey = () => {
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
            document.getElementById('modal-button-2').innerText = 'Regenerating...'
            sendReq('/api/user/regenerate', {method: 'POST'})
                .then(() => {
                    const button2 = document.getElementById('modal-button-2')
                    button2.innerText = 'Regenerated'
                    button2.classList.remove('bg-red-400')
                    button2.classList.add('bg-green-400')
                    auth.reloadData().then()
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

        const baseData = {
            title: 'Are you sure?',
            description: 'If you regenerate your API key, you will need to re-download your configs. Only proceed if you know what you are doing.',
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
                        className="px-3 py-2 rounded-lg bg-red-400 disabled:opacity-75">Regenerate
                </button>
            </>,
            closable: true,
            visible: true,
            updated: Date.now()
        }

        setModalData(baseData)
    }

    const onChange = () => {
        const val = parseInt(document.getElementById('select').value)
        if (val !== auth.user.settings.linkType) {
            setLinkTypeChanged(true)
        } else {
            setLinkTypeChanged(false)
        }
        setLinkType(val.toString())
    }
    const saveLinkType = () => {
        const val = parseInt(document.getElementById('select').value)
        setLinkTypeState(1)
        sendReq('/api/user/link', {method: 'POST', data: {type: val}})
            .then(() => {
                setLinkTypeState(0)
                setLinkTypeChanged(false)
                auth.reloadData().then()
                toast.success((
                    <p>
                        <b>Saved link type!</b>
                    </p>
                ))
            })
            .catch(() => {
                setLinkTypeState(0)
            })
    }

    const percentageStorage = auth.user.bytesUsed / (auth.user.storageQuota * 1000 * 1000 * 1000)
    const color = percentageStorage >= 0.9 ? 'text-red-500' :
        (percentageStorage >= 0.7 ? 'text-yellow-600' : 'text-green-500')

    const roundedPercentage = Math.round(percentageStorage * 10000) / 100

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="content">
                        <h1 className="mb-2">Profile</h1>
                        <div className="d-flex-row mb-5">
                            <div className="flex-initial">
                                <img className="rounded-full w-12 h-12 mr-3"
                                     src={auth.data.avatar ? `https://cdn.discordapp.com/avatars/${auth.data.id}/${auth.data.avatar}.png?size=64` : 'https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png'}
                                     alt=""/>
                            </div>
                            <div className="flex-1-1 my-auto">
                                <p className="text-xl text-gray-500"><b className="text-black">{auth.data.username}</b>#{auth.data.discriminator}</p>
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-lg">Storage: <b className="font-semibold">{auth.user.bytesHuman}</b> / <b className="font-semibold">{auth.user.storageQuota} GB</b> (<b className={`font-semibold ${color}`}>{roundedPercentage}%</b>)</p>
                            <div className="w-full bg-gray-300 h-0.5">
                                <div className="bg-blue-600 h-0.5" style={{width: `${roundedPercentage}%`}} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-lg">Upload limit: {auth.user.uploadLimit} MB</p>
                        </div>
                        <div>
                            <p className="text-lg">Role: <b className="font-semibold">{auth.user.type[0]}{auth.user.type.slice(1).toLowerCase()}</b></p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="content">
                        <h1 className="mb-2">API Key</h1>
                        <div className="rounded border border-gray-300 px-4 py-2.5 mb-2 relative">
                            <p ref={apiKey}>{apiKeyViewable ? auth.user.apiKey : '*********************'}</p>
                            <div className="absolute right-4 top-2.5">
                                <CopyToClipboard text={auth.user.apiKey} onCopy={onApiKeyCopy}>
                                    <button disabled={apiKeyCopied}
                                            className={`mr-1 ${apiKeyCopied ? 'text-green-500' : ''}`} ref={copyApiKey}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                        </svg>
                                    </button>
                                </CopyToClipboard>
                                <button onClick={() => {
                                    setApiKeyViewable(!apiKeyViewable)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        {path}
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mb-10">
                            <button onClick={regenerateKey}
                                    className="inline-block px-3 py-1 bg-red-200 hover:bg-red-300 rounded-md float-right">
                                Regenerate
                            </button>
                        </div>
                    </div>
                    <div className="content">
                        <h1 className="mb-2">ShareX Config</h1>
                        <a className="inline-block px-4 py-2 bg-sky-500 text-white rounded-md" href="/api/config/sharex" target="_blank"
                           rel="noopener noreferrer">Download</a>
                    </div>
                    <div className="content">
                        <h1 className="mb-2">Link Type</h1>
                        <label htmlFor="page-user-link-type">Set link type</label>
                        <select id="select" onChange={onChange} value={linkType}
                                className="form-select appearance-none block w-max pr-10 px-3 py-1.5 mb-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                            <option value="0" id="0" className="type">Normal URL </option>
                            <option value="1" id="1" className="type">Emoji URL</option>
                            <option value="2" id="2" className="type">Invisible URL</option>
                        </select>
                        <button onClick={saveLinkType} disabled={(!linkTypeChanged) || linkTypeState !== 0}
                                className="px-4 py-2 bg-green-300 rounded-md disabled:opacity-75 disabled:bg-gray-300">{linkTypeState === 1 ? <>
                            <div
                                className="spinner-border animate-spin inline-block w-4 h-4 border rounded-full text-gray-800"
                                role="status">
                                <span className="visually-hidden">Saving...</span>
                            </div>
                            <span
                                className="text-gray-800"> Saving...</span></> : (linkTypeState === 2 ? 'Saved!' : 'Save')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;
