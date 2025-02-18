function Loading() {
    return (
        <div className="d-flex-col flex-1-1 w-full h-full">
            <div className="flex-auto"/>
            <div className="flex-initial">
                <div className="mx-auto w-fit">
                    <div className="spinner-border animate-spin inline-block w-6 h-6 border rounded-full text-gray-800"
                         role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-gray-800 text-3xl"> Loading...</span>
                </div>
            </div>
            <div className="flex-auto"/>
        </div>
    )
}

export default Loading;
