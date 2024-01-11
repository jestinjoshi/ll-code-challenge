import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/campaigns`)
            .then(res => res.json())
            .then(res => setCampaigns(res.campaigns))
            .catch(e => {
                console.error(e);
                setCampaigns(null);
            })
            .finally(() => setLoading(false))
    }, []);

    return (
        <div className="uk-container">
            <div className="uk-margin-bottom"><label>Campaign List</label></div>
            <table className="uk-table uk-table-divider uk-table-striped">
                <thead>
                    <tr>
                        <th className="campaign-id">ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                        <tr>
                            <td colSpan={2}>Loading...</td>
                        </tr>
                    }
                    {campaigns !== null ?
                        campaigns.map(campaign => (
                            <tr key={campaign.id}>
                                <td>
                                    <Link to={`campaigns/${campaign.id}`}>
                                        {campaign.id}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`campaigns/${campaign.id}`}>
                                        {campaign.name}
                                    </Link>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td colSpan={2}>Error: Could not fetch data from the API</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}