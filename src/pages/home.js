import {useAuth} from "../services/auth";
import {useEffect, useState} from "react";
import sendReq from "../services/sendReq";
import baseUrl from "../vars";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    elements: {
        point: {
            radius: 0
        }
    },
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        title: {
            display: true,
            text: 'Uploader Statistics'
        }
    },
    stacked: false,
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
                drawOnChartArea: true
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false
            }
        },
        y2: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
                drawOnChartArea: false
            }
        }
    },
    responsive: true,
    maintainAspectRatio: false
}

function Home() {
    const auth = useAuth()
    const [globalStats, setGlobalStats] = useState({})
    const [statData, setStatData] = useState(null)

    useEffect(() => {
        sendReq(baseUrl + '/api/stats').then(res => {
            const data = res.data
            setGlobalStats(data)
        })
    }, [])
    useEffect(() => {
        sendReq(baseUrl + '/api/stats/history').then(res => {
            const data = res.data
            let times = []
            let users = []
            let bytes = []
            let images = []
            for (let row of data) {
                times.push(new Date(parseInt(row.timestamp) * 1000).toString().split(' ').slice(1, 5).join(' '))
                users.push(row.users)
                bytes.push(Math.round(row.bytesUsed / 10000) / 100)
                images.push(row.imagesUploaded)
            }
            setStatData({
                labels: times,
                datasets: [{
                    label: 'Storage used (MB)',
                    data: bytes,
                    borderColor: '#4287f5',
                    fill: false,
                    yAxisID: 'y'
                }, {
                    label: 'Images uploaded',
                    data: images,
                    borderColor: '#c9ae02',
                    fill: false,
                    yAxisID: 'y1'
                }, {
                    label: 'Users',
                    data: users,
                    borderColor: '#c22000',
                    fill: false,
                    yAxisID: 'y2'
                }]
            })
        })
    }, [])

    return (
        <div>
            <div className="content">
                <h1>MotD</h1>
                <h2>moo moo</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="content">
                    <h1>Your Stats</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="rounded-md bg-lime-200 bg-opacity-50 py-2 px-3 border-l-4 border-l-lime-400"
                             id="page-home-self-images">
                            <p><b className="font-semibold text-lime-600">{auth.user.uploadCount}</b> images uploaded
                            </p>
                        </div>
                        <div className="rounded-md bg-cyan-100 bg-opacity-50 py-2 px-3 border-l-4 border-l-cyan-300"
                             id="page-home-self-storage">
                            <p><b className="font-semibold text-cyan-600">{auth.user.bytesHuman}</b> storage used</p>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <h1>Global Stats</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        <div className="rounded-md bg-lime-200 bg-opacity-50 py-2 px-3 border-l-4 border-l-lime-400"
                             id="page-home-global-images">
                            {globalStats !== {} ?
                                <p><b className="font-semibold text-lime-600">{globalStats.fileCount}</b> images
                                    uploaded</p> : <p className="text-loading"/>}
                        </div>
                        <div className="rounded-md bg-cyan-100 bg-opacity-50 py-2 px-3 border-l-4 border-l-cyan-300"
                             id="page-home-global-storage">
                            {globalStats !== {} ?
                                <p><b className="font-semibold text-cyan-600">{globalStats.dataUsed}</b> storage used
                                </p> : <p className="text-loading"/>}
                        </div>
                        <div
                            className="rounded-md bg-blue-100 md:col-span-2 xl:col-span-1 bg-opacity-50 py-2 px-3 border-l-4 border-l-blue-400"
                            id="page-home-global-users">
                            {globalStats !== {} ?
                                <p><b className="font-semibold text-blue-600">{globalStats.userCount}</b> users
                                    registered</p> : <p className="text-loading"/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="content">
                    <h1 className="mb-2">Quickstart Guide</h1>
                    <p className="mb-2">Note: This guide is meant for users on Windows using ShareX.</p>
                    <div className="grid grid-cols-1 gap-3" id="page-home-quickstart">
                        <div className="list-item">
                            <p>1.</p>
                            <div>Download and install ShareX <a href="https://getsharex.com" className="link"
                                                                target="_blank" rel="noopener noreferrer">here</a> if
                                you don't have it installed yet.
                            </div>
                        </div>
                        <div className="list-item">
                            <p>2.</p>
                            <div>Download your generated ShareX config <a href="/api/config/sharex" className="link"
                                                                          target="_blank"
                                                                          rel="noopener noreferrer">here</a> and open
                                it. Click "yes" to make Uploader the default custom uploader.
                            </div>
                        </div>
                        <div className="list-item">
                            <p>3.</p>
                            <div>Open the ShareX app. Click on <code>After capture tasks</code> on the left and
                                enable <code>Copy image to clipboard</code>, <code>Save image to file</code> and <code>Upload
                                    image to host</code>.
                            </div>
                        </div>
                        <div className="list-item">
                            <p>4.</p>
                            <div>Click on <code>After upload tasks</code> on the left and enable <code>Copy URL to
                                clipboard</code>.
                            </div>
                        </div>
                        <div className="list-item">
                            <p>5.</p>
                            <div>Done! You can now start sharing screenshots through Uploader. You can also customize
                                your Uploader experience by changing <a href="/dashboard/embed"
                                                                        className="link">embed</a> or <a
                                    href="/dashboard/domains" className="link">domain</a> settings.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content d-flex-col">
                    <h1 className="flex-initial">Statistics</h1>
                    <div className="max-h-full flex-1">
                        {statData !== null ?
                            <Line className="w-full h-full" data={statData} options={chartOptions} type="line"/> :
                            <div className="w-full h-full div-loading"/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
