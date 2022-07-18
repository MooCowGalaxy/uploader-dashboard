import {useEffect, useState} from "react";
import sendReq from "../services/sendReq";
import Image from "../components/image";

function Gallery() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(0)
    const [page, setPage] = useState(1)
    const [isLastPage, setIsLastPage] = useState(false)

    useEffect(() => {
        setLoading(true)
        sendReq(`/api/user/images?page=${page}&sort=${sort}`)
            .then(res => {
                const data = res.data
                setLoading(false)
                if (data.pages.limit <= page) {
                    setIsLastPage(true)
                } else {
                    setIsLastPage(false)
                }
                setImages(newImages => {
                    return [...newImages, ...data.data]
                })
            }).catch()
    }, [page, sort])

    const onLoadMore = () => {
        setPage(page => page + 1)
    }

    const onSort = () => {
        setImages([])
        setSort(parseInt(document.getElementById('sort').value))
        setPage(1)
    }

    const deleteImage = (fileId) => {
        setImages(im => {
            return im.filter(item => item.fileId !== fileId)
        })
    }

    const imageContent = []
    for (let image of images) {
        imageContent.push((
            <Image key={`i-${image.fileId}`} image={image} del={deleteImage}/>
        ))
    }

    return (
        <div>
            <div className="content d-flex-row">
                <div className="mb-3 xl:w-96">
                    <label htmlFor="sort">Sort by:</label>
                    <select id="sort" onChange={onSort} value={sort}
                            className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 dark:text-gray-400 bg-white dark:bg-slate-900 bg-clip-padding bg-no-repeat border border-solid border-gray-300 dark:border-gray-700 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                        <option value="0">Date (new to old)</option>
                        <option value="1">Date (old to new)</option>
                        <option value="2">File name (A-Z)</option>
                        <option value="3">File name (Z-A)</option>
                        <option value="4">File size (small to large)</option>
                        <option value="5">File size (large to small)</option>
                    </select>
                </div>
            </div>
            <div key="gallery" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {imageContent.length > 0 ? imageContent : (loading ? '' : 'No images.')}
            </div>
            <button className={`bg-gray-200 px-4 py-2 rounded-md disabled:opacity-75 ${isLastPage ? 'hidden' : ''}`}
                    onClick={onLoadMore} disabled={loading}>{loading ? 'Loading...' : 'Load More'}</button>
        </div>
    )
}

export default Gallery;
