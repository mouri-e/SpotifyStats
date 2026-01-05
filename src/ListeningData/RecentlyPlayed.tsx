import { useEffect, useState } from 'react';
import { useSpotifyAuth } from "../SpotifyAuth/SpotifyAuthContext.tsx";
import { RecentlyPlayedTracks } from '../Interfaces.tsx';
      
export default function RecentlyPlayed() {
    
    //changes based on the tab being viewed
    const [playbackHistory, setPlaybackHistory] = useState<RecentlyPlayedTracks[] | undefined>(undefined);

    const { accessToken } = useSpotifyAuth();

    useEffect(() => {
        // No token is provided
        if (!accessToken) return; 
        loadRecentlyPlayed();
    }, [accessToken]);
    
    const fetchRecentlyPlayed = async (token: string, timestamp: string): Promise<RecentlyPlayedTracks> => {
        const result = await fetch(
            "https://api.spotify.com/v1/me/player/recently-played?limit=50&before=" + timestamp, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        return await result.json();
    }
        
    const loadRecentlyPlayed = async () => {
        //wait until you have an actual token
        if (!accessToken) return;

        //pull from stored data if the fetch requests were already sent
        if (playbackHistory) {
            return;
        }
        
        //if you haven't fetched the data, do so and store it
        const results: RecentlyPlayedTracks[] = [];
        const data = await fetchRecentlyPlayed(accessToken, Date.now().toString());
        results.push(data);
        
        setPlaybackHistory(results);
    };
    

    if (!playbackHistory) {
        return (
            <>
                <h1 className="text-center">Your Recently Played</h1>
                <div className="text-center">
                    <div className="loader d-inline-block"></div>
                    <h1 className="d-inline-block ps-3"> Loading</h1>
                </div>
            </>
        );
    }

    return (
        <>
            <h1 className="text-center">Your Recently Played</h1>
            <div id="recentlyPlayed">
                <div className="container border border-4 spotifyGreenBorder rounded">
                    <div className="row align-items-center">
                        <h3 className="col-3 text-center pt-4 pb-3">Time Played</h3>
                        <h3 className="col-4 text-center pt-4 pb-3">Track Name</h3>
                        <h3 className="col-3 text-center pt-4 pb-3">Artists</h3>
                        <h3 className="col-2 text-center pt-4 pb-3">Cover Art</h3>
                    </div>

                    {playbackHistory && playbackHistory.map((RecentlyPlayedTracks) => (
                        RecentlyPlayedTracks.items.map((playHistoryObject) => (
                        <div key={playHistoryObject.played_at.toString()} className="row align-items-center border-top spotifyGreenBorder border-4">
                            <h5 className="col-3 text-center pt-3 pb-3">{new Date(playHistoryObject.played_at).toLocaleString()}</h5>
                            <h5 className="col-4 text-center pt-3 pb-3">{playHistoryObject.track.name}</h5>
                            <h5 className="col-3 text-center pt-3 pb-3">{playHistoryObject.track.artists.map(artist => artist.name).join(', ')}</h5>
                            <div className="col-2 pt-3 pb-3 text-center">
                                <img className="albumCover rounded" src={playHistoryObject.track.album.images[0]?.url}></img>
                            </div>
                            
                        </div>
                    ))
                    ))}
                </div>
            </div>
        </>
    );
}


