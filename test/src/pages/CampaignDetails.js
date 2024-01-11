import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Tile from "../components/Tile";
import { BASE_URL } from "../utils/constants";

// Data to be displayed initially on the tiles
const initialCampaignData = {
    totalImpressions: 0,
    totalClicks: 0,
    totalUsers: 0,
    CTR: 0,
    mostRecentCTR: 0,
    mostRecentImpressions: 0,
    mostRecentClicks: 0,
    mostRecentUsers: 0,
};

// Function to calculate CTR
const calculateCTR = (clicks, impressions) => {
    if (impressions === 0) {
        impressions = 1;
    }
    return parseFloat(clicks / impressions * 100).toFixed(2);
};

// Function to fetch campaign data from the API
const getCampaignData = (campaignId, currentNumber) => {
    return fetch(`${BASE_URL}/campaigns/${campaignId}?number=${currentNumber}`)
        .then(res => res.json())
        .then((res => res))
        .catch(e => {
            console.error(e);
            return null;
        });
}

// Function to create tiles data array
const getTilesData = campaignData => {
    return [
        {
            title: 'Total Impressions',
            value: campaignData.totalImpressions,
        },
        {
            title: 'Total Clicks',
            value: campaignData.totalClicks,
        },
        {
            title: 'CTR',
            value: campaignData.CTR,
        },
        {
            title: 'Total Users',
            value: campaignData.totalUsers,
        },
        {
            title: 'Most Recent Impressions',
            value: campaignData.mostRecentImpressions,
        },
        {
            title: 'Most Recent Clicks',
            value: campaignData.mostRecentClicks,
        },
        {
            title: 'Most Recent CTR',
            value: campaignData.mostRecentCTR,
        },
        {
            title: 'Most Recent Users',
            value: campaignData.mostRecentUsers,
        },
    ]
}

export default function CampaignDetails() {
    const { campaignId } = useParams();

    const counterReset = 5;

    const [campaignData, setCampaignData] = useState(initialCampaignData);
    const [currentNumber, setCurrentNumber] = useState(0);
    const [counter, setCounter] = useState(counterReset);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleApiPolling = async () => {
            if (counter > 1) {
                setCounter(prevCounter => prevCounter - 1);
            } else {
                const data = await getCampaignData(campaignId, currentNumber);

                if (data !== null) {
                    const { impressions, clicks, users } = data;

                    // Updating campaign data
                    setCampaignData(prevState => {
                        const totalImpressions = prevState.totalImpressions + impressions;
                        const totalClicks = prevState.totalClicks + clicks;
                        const totalUsers = prevState.totalUsers + users;

                        return {
                            totalImpressions: totalImpressions,
                            totalClicks: totalClicks,
                            totalUsers: totalUsers,
                            CTR: calculateCTR(totalClicks, totalImpressions),
                            mostRecentCTR: calculateCTR(clicks, impressions),
                            mostRecentImpressions: impressions,
                            mostRecentClicks: clicks,
                            mostRecentUsers: users,
                        }
                    })

                    setCurrentNumber(currentNumber + 1);
                    setCounter(counterReset);
                    setLoading(false);
                }
            }
        }

        // this setTimeout handles the counter and api polling
        // when the counter hits 1, it will fetch data from the API the next second
        const apiPollingId = setTimeout(handleApiPolling, 1000);

        return () => {
            clearTimeout(apiPollingId);
        };
    }, [counter]);

    const tiles = getTilesData(campaignData);

    return (
        <div className="uk-container">
            <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom breadcrumb-wrap">
                <div className="breadcrumb">
                    <Link to={'/'}>Campaign List</Link>
                    <label> &gt; Campaign Details (ID: {campaignId})</label>
                </div>
                <div className="uk-text-center uk-text-right@s">
                    <label className="api-fetch">API fetch in {counter} sec{counter > 1 && `s`}</label>
                    <label className="sep">|</label>
                    <label className="current-number">Current Number: <b>{(currentNumber - 1) >= 0 ? currentNumber - 1 : 0}</b></label>
                </div>
            </div>
            <div className="uk-grid-small uk-grid-match uk-child-width-1-4@m uk-child-width-1-2" data-uk-grid>
                {tiles.map(({ title, value }, i) => <Tile key={i} title={title} value={value} />)}
            </div>

            {loading &&
                <div className="loader">
                    <div className="uk-text-center">
                        <div className="uk-margin-bottom">API fetch in {counter} sec{counter > 1 && `s`}</div>
                        <div data-uk-spinner></div>
                    </div>
                </div>
            }
        </div>
    )
}