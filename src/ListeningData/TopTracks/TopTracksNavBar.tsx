function TopTracksNavBar(
{ currentPathName, hideTracksCurrentlyOnScreenAndUpdate}:
        { currentPathName: string; hideTracksCurrentlyOnScreenAndUpdate: (dataTimeFrame: string) => void; }) {
    return (
        <>
            <h1 className="text-center">Your Top Tracks</h1>

            <div className="text-center mb-3">
                <a href="#/TopTracksShortTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopTracksShortTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideTracksCurrentlyOnScreenAndUpdate("short_term")}
                        disabled={currentPathName.includes("TopTracksShortTerm")}>
                        Short Term (4 Weeks)
                    </button>
                </a>
                <a href="#/TopTracksMediumTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopTracksMediumTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideTracksCurrentlyOnScreenAndUpdate("medium_term")}
                        disabled={currentPathName.includes("TopTracksMediumTerm")}>
                        Medium Term (6 Months)
                    </button>
                </a>
                <a href="#/TopTracksLongTerm">
                    <button className={`btn btn-lg me-3 ${currentPathName.includes("TopTracksLongTerm") ? "spotifyGreenButtonSelected" : "spotifyGreenButton"}`}
                        onClick={() => hideTracksCurrentlyOnScreenAndUpdate("long_term")}
                        disabled={currentPathName.includes("TopTracksLongTerm")}>
                        Long Term (1 Year)
                    </button>
                </a>
            </div>
        </>
    );
}

export default TopTracksNavBar;