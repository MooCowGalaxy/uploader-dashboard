function Donate() {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="content">
                    <h1>Donate to uploader.tech</h1>
                    <p className="mb-2">While the service is completely free to use, there are still costs associated with keeping the servers online.</p>
                    <p>By donating, you are:</p>
                    <ul className="mb-4">
                        <li>- Keeping the service online for everyone</li>
                        <li>- Motivating developers to give even more love and work to this project</li>
                    </ul>
                    <p>You also get some cool benefits!</p>
                    <ul className="mb-4">
                        <li>- A donator role in the Discord server</li>
                        <li>- For monthly donors: increased storage and upload limits</li>
                    </ul>
                    <p className="mb-2">All donations are greatly appreciated!</p>
                    <a href="https://ko-fi.com/moocow" className="underline text-blue-500">Direct link to Ko-Fi</a>
                </div>
                <div className="content">
                    <iframe src='https://ko-fi.com/moocow/?hidefeed=true&widget=true&embed=true&preview=true' style={{border: 'none', width: '100%', padding: '4px', background: 'inherit'}} height='712' title='moocow'/>
                </div>
            </div>
        </div>
    )
}

export default Donate;
