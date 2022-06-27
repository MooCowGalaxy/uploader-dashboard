import toast from 'react-hot-toast';
import baseUrl from "../vars";

async function sendReq(url, {method = 'GET', data = {}} = {}) {
    let settings = {
        method,
        credentials: 'include',
        headers: {}
    }
    if (method === 'POST' && Object.keys(data).length > 0) {
        settings.body = JSON.stringify(data)
        settings.headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(url.startsWith('http') ? url : baseUrl + url, settings)
    const error = !res.ok;
    const json = await res.json();

    const result = {
        status: res.status,
        data: json
    }

    if (error) {
        if (result.status === 429) {
            toast.error((
                <p>
                    <b>Request failed: </b>You are currently being ratelimited.
                </p>
            ))
            // createToast({type: 'error', title: 'Request failed', content: 'You are currently being ratelimited.'})
        } else {
            toast.error((
                <p>
                    <b>Request failed: </b>{json.error}
                </p>
            ))
            // createToast({type: 'error', title: 'Request failed', content: json.error})
            console.error(json.error)
        }
        throw result;
    }
    return result;
}

export default sendReq;
