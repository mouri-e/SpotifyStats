function TopArtistsNavBar(
{ currentPathName, hideArtistsCurrentlyOnScreenAndUpdate}:
        { currentPathName: string; hideArtistsCurrentlyOnScreenAndUpdate: (dataTimeFrame: string) => void; }) {
    return (
        <>
            <h1 className="text-center">Your Top Artists</h1>

            <div className="text-center mb-3">
                <a href="#/TopArtistsShortTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopArtistsShortTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideArtistsCurrentlyOnScreenAndUpdate("short_term")}
                        disabled={currentPathName.includes("TopArtistsShortTerm")}>
                        Short Term (4 Weeks)
                    </button>
                </a>
                <a href="#/TopArtistsMediumTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopArtistsMediumTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideArtistsCurrentlyOnScreenAndUpdate("medium_term")}
                        disabled={currentPathName.includes("TopArtistsMediumTerm")}>
                        Medium Term (6 Months)
                    </button>
                </a>
                <a href="#/TopArtistsLongTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopArtistsLongTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideArtistsCurrentlyOnScreenAndUpdate("long_term")}
                        disabled={currentPathName.includes("TopArtistsLongTerm")}>
                        Long Term (1 Year)
                    </button>
                </a>
            </div>
        </>
    );
}

export default TopArtistsNavBar;