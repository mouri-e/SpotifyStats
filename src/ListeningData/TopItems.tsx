import { useLocation } from "react-router-dom";
import SpotifyTopArtists from "./TopArtists/TopArtists";
import SpotifyTopTracks from "./TopTracks/TopTracks";
import RecentlyPlayed from "./RecentlyPlayed";

export default function SpotifyTopItems() {
    const location = useLocation();
    const currentPathName = location.hash;
    
    if (currentPathName.includes("TopTracks")) {
        return (<SpotifyTopTracks></SpotifyTopTracks>);
    }
    else if(currentPathName.includes("TopArtists")) {
        return (<SpotifyTopArtists></SpotifyTopArtists>);
    }
    else if(currentPathName.includes("RecentlyPlayed")) {
        return (<RecentlyPlayed></RecentlyPlayed>);
    }
    else {
        return;
    }
}


