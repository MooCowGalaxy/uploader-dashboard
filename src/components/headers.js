import {production} from '../vars';

function Headers() {
    return (
        <>
            {production ? <script async defer data-website-id="1b82b7fe-3278-426e-818b-944684654c80" src="https://um.mooi.ng/um.js" /> : null}
        </>
    )
}

export default Headers;
