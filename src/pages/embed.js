import Loading from "../components/loading";
import {useEffect, useState} from "react";
import sendReq from "../services/sendReq";
import {useAuth} from "../services/auth";
import toast from "react-hot-toast";

function Embed() {
    const auth = useAuth()
    const [dataLoaded, setDataLoaded] = useState(false)
    const [original, setOriginal] = useState({})
    const [siteName, setSiteName] = useState(null)
    const [siteTitle, setSiteTitle] = useState(null)
    const [siteDescription, setSiteDescription] = useState(null)
    const [embedColor, setEmbedColor] = useState(null)
    const [embedEnabled, setEmbedEnabled] = useState(null)
    const [buttonStatus, setButtonStatus] = useState(0)
    // 0: N/A - 1: saving

    useEffect(() => {
        sendReq('/api/user/embed')
            .then(res => {
                const data = res.data.data
                setSiteName(data.embedSiteName)
                setSiteTitle(data.embedSiteTitle)
                setSiteDescription(data.embedSiteDescription)
                setEmbedColor(data.embedColor)
                setEmbedEnabled(data.embedEnabled)
                setOriginal(data)
                setDataLoaded(true)
            })
            .catch()
    }, [])

    if (!dataLoaded) {
        return (
            <div>
                <Loading/>
            </div>
        )
    }

    function getError() {
        if (siteName.length > 255) return 'Site name must be 255 characters or less.'
        if (siteTitle.length > 255) return 'Embed title must be 255 characters or less.'
        if (siteDescription.length > 500) return 'Embed description must be 500 characters or less.'
        if (embedEnabled && siteTitle === '') return 'There must be a title for the embed to display.'
        return null
    }
    function setPlaceholders(text) {
        let newText = text.replaceAll('[date]', new Date().toUTCString().split(' ').slice(0, 4).join(' '))
        newText = newText.replaceAll('[datetime]', new Date().toUTCString())
        newText = newText.replaceAll('[filesize]', '2.66 MB')
        newText = newText.replaceAll('[name]', 'aBcD1234.png')
        newText = newText.replaceAll('[dimensions]', '256 x 256')
        return newText
    }
    function embedHasChanges() {
        if (original.embedEnabled !== embedEnabled) return true
        if (original.embedSiteName !== siteName) return true
        if (original.embedSiteTitle !== siteTitle) return true
        if (original.embedSiteDescription !== siteDescription) return true
        return original.embedColor !== embedColor;
    }
    const onSaveClick = () => {
        if (getError()) return;
        if (!embedHasChanges()) return;
        setButtonStatus(1)
        const data = {
            name: siteName,
            title: siteTitle,
            description: siteDescription,
            color: embedColor,
            enabled: embedEnabled
        }
        sendReq('/api/user/embed', {method: 'POST', data}).then(() => {
            setButtonStatus(0)
            setOriginal({
                embedSiteName: siteName,
                embedSiteTitle: siteTitle,
                embedSiteDescription: siteDescription,
                embedColor,
                embedEnabled
            })
            toast.success((
                <p>
                    <b>Saved embed settings!</b>
                </p>
            ))
        }).catch(() => {
            setButtonStatus(0)
        })
    }

    const error = getError()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="content">
                <h1 className="mb-2">Embed Builder</h1>
                <div className="flex justify-start mb-2">
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox" role="switch" checked={embedEnabled} onChange={e => setEmbedEnabled(e.target.checked)} />
                            <label className="form-check-label inline-block text-gray-800"
                                   htmlFor="page-embed-embed-toggle">Enable embeds</label>
                    </div>
                </div>
                <div className="accordion mb-4" id="placeholder-accordion">
                    <div className="accordion-item bg-white border border-gray-200">
                        <h2 className="accordion-header mb-0" id="placeholder-accordion-heading">
                            <button
                                className="accordion-button relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
                                type="button" data-bs-toggle="collapse" data-bs-target="#placeholder-accordion-content"
                                aria-expanded="true" aria-controls="placeholder-accordion-content">
                                Placeholders
                            </button>
                        </h2>
                        <div id="placeholder-accordion-content" className="accordion-collapse collapse show"
                             aria-labelledby="placeholder-accordion-heading" data-bs-parent="#placeholder-accordion">
                            <div className="accordion-body py-4 px-5">
                                <code>[date]</code> - Displays the UTC date when the image was uploaded.<br />
                                <code>[datetime]</code> - Displays the UTC date and time when the image was
                                uploaded.<br />
                                <code>[filesize]</code> - Displays a human-readable format of the image size.<br />
                                <code>[name]</code> - Displays the name of the image.<br />
                                <code>[dimensions]</code> - Displays the dimensions of the image.
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-start">
                        <div className="mb-3 w-full">
                            <label htmlFor="page-embed-input-site-name"
                                   className="form-label inline-block mb-1 text-gray-700 font-semibold">Site
                                Name</label>
                            <input type="text"
                                   className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   value={siteName}
                                   onInput={e => setSiteName(e.target.value)} placeholder="Site name"/>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="mb-3 w-full">
                            <label htmlFor="page-embed-input-title"
                                   className="form-label inline-block mb-1 text-gray-700 font-semibold">Site
                                Title</label>
                            <input type="text"
                                   className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   value={siteTitle}
                                   onInput={e => setSiteTitle(e.target.value)} placeholder="Site title"/>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="mb-3 w-full">
                            <label htmlFor="page-embed-input-description"
                                   className="form-label inline-block mb-1 text-gray-700 font-semibold">Site
                                Description</label>
                            <input type="text"
                                   className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   value={siteDescription}
                                   onInput={e => setSiteDescription(e.target.value)} placeholder="Site description"/>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="mb-5 w-full">
                            <label htmlFor="page-embed-input-color"
                                   className="form-label inline-block mb-1 text-gray-700 font-semibold">Embed
                                Color</label>
                            <input type="color"
                                   className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   value={embedColor}
                                   onInput={e => setEmbedColor(e.target.value)} placeholder="Embed color"/>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button id="page-embed-save"
                                className="px-4 py-2 bg-green-400 rounded-md disabled:opacity-75 disabled:bg-gray-300"
                                disabled={!embedHasChanges() && buttonStatus === 0}
                                onClick={onSaveClick}>Save Changes
                        </button>
                    </div>
                </div>
            </div>
            <div className="content">
                <h1 className="mb-2">Embed Preview</h1>
                <div className="discord-embed-container p-5 inline-flex w-full">
                    <div className="discord-embed-profile pr-3 flex-initial">
                        <img className="rounded-full w-12 h-12" src={auth.data.avatar ? `https://cdn.discordapp.com/avatars/${auth.data.id}/${auth.data.avatar}.png?size=64` : ''} alt="" />
                    </div>
                    <div className="discord-embed-content flex-1 max-w-full">
                        <div className="discord-embed-username select-none">
                            <h1 className="text-white font-semibold inline mr-1">{auth.data.username}</h1>
                            <p className="text-gray-400 text-xs inline">Today at {new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        <p className="text-sky-500 hover:underline">{`https://${auth.user.domain}/${auth.user.settings.linkType === 0 ? 'aBcD1234.png' : ''}`}</p>
                        <div className={`discord-embed-preview ${embedEnabled ? '' : 'hidden'}`}>
                            <div>
                                <span className="discord-embed-site-name">{setPlaceholders(siteName)}</span>
                            </div>
                            <div>
                                <span className="discord-embed-site-title">{setPlaceholders(siteTitle)}</span>
                            </div>
                            <div>
                                <span className="discord-embed-site-description">{setPlaceholders(siteDescription)}</span>
                            </div>
                            <div>
                                <img src="https://uploader.tech/static/img/SXL.png" alt=""
                                     className="max-h-28 sm:max-h-36 md:max-h-48 xl:max-h-64 object-contain w-auto max-w-full" />
                            </div>
                        </div>
                        <div className={`max-w-3xl ${embedEnabled ? 'hidden' : ''}`}>
                            <img src="https://uploader.tech/static/img/SXL.png" alt="" className="max-h-28 sm:max-h-36 md:max-h-48 xl:max-h-64 object-contain w-auto max-w-full" />
                        </div>
                    </div>
                </div>
                <p className="text-red-600">{error}</p>
            </div>
        </div>
    )
}

export default Embed;
