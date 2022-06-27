import {useAuth} from "../services/auth";
import {useState} from "react";
import sendReq from "../services/sendReq";
import toast from "react-hot-toast";

function Domains() {
    const auth = useAuth()
    const [domain, setDomain] = useState(auth.user.domain)
    const [newDomain, setNewDomain] = useState(domain !== 'is-trolli.ng' ? domain.slice(0, -13) : '')
    const [isValid, setIsValid] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const onDomainInput = (e) => {
        let newSubdomain = e.target.value
        let allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('')
        let filtered = ''
        for (let character of newSubdomain) {
            if (allowed.includes(character)) {
                filtered = `${filtered}${character}`
            }
        }
        setNewDomain(filtered)
        if (domain === filtered) setIsValid(false)
        else if (filtered.length === 0) setIsValid(false)
        else if (filtered.length > 20) setIsValid(false)
        else setIsValid(true)
    }

    const saveDomain = () => {
        if (!isValid) return;
        setIsSaving(true)
        sendReq('/api/user/domains', {method: 'POST', data: {subdomain: newDomain}})
            .then(() => {
                setIsSaving(false)
                setIsValid(false)

                toast.success((
                    <b>Saved domain settings!</b>
                ))
                auth.reloadData().then()
                setDomain(newDomain)
            })
            .catch(() => {
                setIsSaving(false)
            })
    }

    return (
        <div className="content">
            <h1>Your Domain Settings</h1>
            <div className="flex justify-start mb-2">
                <div className="max-w-3xl">
                    <input type="text"
                           className="form-control inline-block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           placeholder="Subdomain" value={newDomain} onChange={onDomainInput} maxLength="20" />
                    <span
                        className="inline-block px-3 py-1.5 -translate-x-0.5 text-base font-normal text-gray-700 bg-gray-200 bg-clip-padding border border-solid border-gray-300 rounded-r">.is-trolli.ng</span>
                </div>
            </div>
            <button className="bg-green-300 px-4 py-2 rounded-md mb-3 disabled:opacity-75 disabled:bg-gray-300"
                    disabled={!isValid || isSaving} onClick={saveDomain}>Save
            </button>
            <p>More options will be available in the future!</p>
        </div>
    )
}

export default Domains;
