export default function Tile({ title, value }) {
    return (
        <div>
            <div className="uk-card uk-card-default uk-card-body">
                <p>{title}</p>
                <p className="uk-card-title">{value}</p>
            </div>
        </div>
    )
}