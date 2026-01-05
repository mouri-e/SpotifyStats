
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopTracksNavBar from './TopTracksNavBar.tsx';
import { useSpotifyAuth } from "../../SpotifyAuth/SpotifyAuthContext.tsx";
import { UserTopTracks } from "../../Interfaces.tsx";

export default function SpotifyTopTracks() {
    
    //changes based on the tab being viewed
    const [topTracks, setTopTracks] = useState<UserTopTracks[] | undefined>(undefined);

    //gets stored until browser refresh in order to limit the number of fetches and load time
    const [topTracksShort, setTopTracksShort] = useState<UserTopTracks[] | undefined>(undefined);
    const [topTracksMedium, setTopTracksMedium] = useState<UserTopTracks[] | undefined>(undefined);
    const [topTracksLong, setTopTracksLong] = useState<UserTopTracks[] | undefined>(undefined);
    const location = useLocation();
    const currentPathName = location.hash;

    const { accessToken } = useSpotifyAuth();

    useEffect(() => {
        // No token is provided
        if (!accessToken) return; 
        loadTracks("short_term");
    }, [accessToken]);
    
    const fetchTopTracks = async (token: string, offset: number, dataTimeFrame: string): Promise<UserTopTracks> => {
        const result = await fetch("https://api.spotify.com/v1/me/top/tracks?" +
            "time_range=" + dataTimeFrame + "&limit=50&offset=" + offset, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        return await result.json();
    }

    const hideTracksCurrentlyOnScreenAndUpdate = async (dataTimeFrame: string) => {
        setTopTracks(undefined);
        loadTracks(dataTimeFrame);
    }
        
    const loadTracks = async (dataTimeFrame: string) => {
        //wait until you have an actual token
        if (!accessToken) return;

        //pull from stored data if the fetch requests were already sent
        switch (dataTimeFrame) {
            case "short_term":
                if (topTracksShort) {
                    setTopTracks(topTracksShort);
                    return;
                }
                break;
            case "medium_term":
                if (topTracksMedium) {
                    setTopTracks(topTracksMedium);
                    return;
                }
                break;
            case "long_term":
                if (topTracksLong) {
                    setTopTracks(topTracksLong);
                    return;
                }
                break;
        }

        //if you haven't fetched the data, do so and store it
        const results: UserTopTracks[] = [];
        
        for (let i = 0; i < 4; i++) {
            const data = await fetchTopTracks(accessToken, i * 50, dataTimeFrame);
            results.push(data);
        }

        switch (dataTimeFrame) {
            case "short_term":
                setTopTracksShort(results);
                break;
            case "medium_term":
                setTopTracksMedium(results);
                break;
            case "long_term":
                setTopTracksLong(results);
                break;
        }
        
        setTopTracks(results);
        
    };

    if (!topTracks) {
        return (
            <>
                <TopTracksNavBar
                    currentPathName={currentPathName}
                    hideTracksCurrentlyOnScreenAndUpdate={hideTracksCurrentlyOnScreenAndUpdate}>
                </TopTracksNavBar>
                <div className="text-center">
                    <div className="loader d-inline-block"></div>
                    <h1 className="d-inline-block ps-3"> Loading</h1>
                </div>
            </>
        );
    }
    return (
        <>
            <div id="topTracks">
                <TopTracksNavBar
                    currentPathName={currentPathName}
                    hideTracksCurrentlyOnScreenAndUpdate={hideTracksCurrentlyOnScreenAndUpdate}>
                </TopTracksNavBar>
                    

                <div className="container border border-4 spotifyGreenBorder rounded">
                    <div className="row align-items-center">
                        <h3 className="col-1 text-center pt-4 pb-3">Rank</h3>
                        <h3 className="col-5 text-center pt-4 pb-3">Track Name</h3>
                        <h3 className="col-4 text-center pt-4 pb-3">Artists</h3>
                        <h3 className="col-2 text-center pt-4 pb-3">Cover Art</h3>
                    </div>

                    {topTracks && topTracks.map((UserTopTracks, offsetNumber) => (
                        UserTopTracks.items.map((trackObject, trackNumber) => (
                        <div key={trackObject.id} className="row align-items-center border-top spotifyGreenBorder border-4">
                            <h4 className="col-1 text-center pt-3 pb-3">#{offsetNumber * 50 + trackNumber + 1}</h4>
                            <h4 className="col-5 text-center pt-3 pb-3">{trackObject.name}</h4>
                            <h4 className="col-4 text-center pt-3 pb-3">
                                {trackObject.artists.map(artist => artist.name).join(', ')}
                            </h4>
                            <div className="col-2 pt-3 pb-3 text-center">
                                <img className="albumCover rounded" src={trackObject.album.images[0]?.url}></img>
                            </div>
                            
                        </div>
                    ))
                    ))}
                </div>
            </div>
        </>
    );
}


