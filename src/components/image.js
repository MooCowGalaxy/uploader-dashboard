import humanReadableBytes from "../services/humanReadableBytes";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import toast from "react-hot-toast";
import {useState} from "react";
import sendReq from "../services/sendReq";
import {useAuth} from "../services/auth";

function Image({image, del}) {
    const { user } = useAuth()
    const [deleteState, setDeleteState] = useState(0)

    const domain = image.domain

    const onCopyLink = () => {
        toast.success((
            <p>
                <b>Copied link to clipboard!</b>
            </p>
        ))
    }

    const onDelete = () => {
        setDeleteState(1)
        sendReq(`/api/user/image/delete/${image.fileId}`, {method: 'POST'})
            .then(() => {
                setDeleteState(0)
                toast.success((
                    <p>
                        <b>Deleted image.</b>
                    </p>
                ))
                del(image.fileId)
            }).catch(console.log)
    }

    return (
        <div className="content">
            <p className="text-center font-bold">{image.fileId}.{image.extension}</p>
            <p className="text-center font-semibold mb-2">Original: {image.originalName}</p>
            <img src={`https://cdn.uploader.tech/${user.settings.userId}/${image.fileId}.${image.extension}`} alt=""
                 className="mx-auto w-auto max-w-full max-h-40 mb-3 rounded-md object-contain"/>
            <p className="mb-3 text-center">{new Date(parseInt(image.timestamp)).toLocaleString()}<br/>{humanReadableBytes(parseInt(image.size))} -
                viewed {image.viewCount} time{image.viewCount === 1 ? '' : 's'}</p>
            <div className="flex justify-center">
                <div className="inline-block mx-auto text-center">
                    <CopyToClipboard text={`https://${domain}/${image.alias}`} onCopy={onCopyLink}>
                        <button className="bg-sky-600 rounded-md pl-3 px-4 py-2 text-white mb-1 mx-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -translate-y-0.5 inline"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                            </svg>
                            &nbsp;
                            Copy Link
                        </button>
                    </CopyToClipboard>
                    <a href={`https://cdn.uploader.tech/${user.settings.userId}/${image.fileId}.${image.extension}?download`} target="_blank" rel="noopener noreferrer">
                        <button className="bg-green-600 rounded-md pl-3 px-4 py-2 text-white mb-1 mx-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -translate-y-0.5 inline"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            &nbsp;
                            Download
                        </button>
                    </a>
                    <button className="bg-red-600 rounded-md pl-3 px-4 py-2 text-white mb-1 disabled:opacity-75 mx-0.5"
                            onClick={onDelete} disabled={deleteState === 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 -translate-y-0.5 inline"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        &nbsp;
                        {deleteState === 1 ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Image;
