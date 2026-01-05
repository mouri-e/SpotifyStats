import { useLocation } from "react-router-dom";
import spotifyLogo from './assets/SpotifyLogo.png';
import { useSpotifyAuth } from "./SpotifyAuth/SpotifyAuthContext";

export default function NavBar() {
    const location = useLocation();
    const currentPathName = location.hash;
    const { profileName } = useSpotifyAuth();
    
    return (
        <nav className="navbar navbar-expand-lg sticky-top border-bottom border-2 spotifyGreenBorder spotifyNavBarBackground">
            <div className="container-fluid">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item me-3 pt-2">
                            <img src={spotifyLogo} style={{ width: '25px', height: '25px' }} 
                            alt="Spotify logo" className="mb-1" /> {profileName}'s Spotify Stats
                        </li>
                        <li className="nav-item me-3">
                            <a className={`nav-link ${currentPathName.includes("TopTracks") ? "disabled spotifyGreenLinkDisabled" : "spotifyGreenText"}`}
                                href="#/TopTracksShortTerm">Top Tracks</a>
                        </li>
                        <li className="nav-item me-3">
                                <a className={`nav-link ${currentPathName.includes("TopArtists") ? "disabled spotifyGreenLinkDisabled" : "spotifyGreenText"}`}
                                href="#/TopArtistsShortTerm">Top Artists</a>
                        </li>
                        <li className="nav-item me-3">
                            <a className={`nav-link spotifyGreenText ${currentPathName.includes("RecentlyPlayed") ? "disabled spotifyGreenLinkDisabled" : "spotifyGreenText"}`}
                                href="#/RecentlyPlayed">Recently Played</a>
                        </li>
                    </ul>
            </div>
        </nav>
    );
}


