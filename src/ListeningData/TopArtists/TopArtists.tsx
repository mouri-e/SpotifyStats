
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopArtistsNavBar from './TopArtistsNavBar.tsx';
import { useSpotifyAuth } from "../../SpotifyAuth/SpotifyAuthContext.tsx";
import { UserTopArtists } from "../../Interfaces.tsx";

export default function SpotifyTopArtists() {
    
    //changes based on the tab being viewed
    const [topArtists, setTopArtists] = useState<UserTopArtists[] | undefined>(undefined);

    //gets stored until browser refresh in order to limit the number of fetches and load time
    const [topArtistsShort, setTopArtistsShort] = useState<UserTopArtists[] | undefined>(undefined);
    const [topArtistsMedium, setTopArtistsMedium] = useState<UserTopArtists[] | undefined>(undefined);
    const [topArtistsLong, setTopArtistsLong] = useState<UserTopArtists[] | undefined>(undefined);
    const location = useLocation();
    const currentPathName = location.hash;

    const { accessToken } = useSpotifyAuth();

    useEffect(() => {
        // No token is provided
        if (!accessToken) return; 
        loadArtists("short_term");
    }, [accessToken]);
    
    const fetchTopArtists = async (token: string, offset: number, dataTimeFrame: string): Promise<UserTopArtists> => {
        const result = await fetch("https://api.spotify.com/v1/me/top/artists?" +
            "time_range=" + dataTimeFrame + "&limit=50&offset=" + offset, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        return await result.json();
    }

    const hideArtistsCurrentlyOnScreenAndUpdate = async (dataTimeFrame: string) => {
        setTopArtists(undefined);
        loadArtists(dataTimeFrame);
    }
        
    const loadArtists = async (dataTimeFrame: string) => {
        //wait until you have an actual token
        if (!accessToken) return;

        //pull from stored data if the fetch requests were already sent
        switch (dataTimeFrame) {
            case "short_term":
                if (topArtistsShort) {
                    setTopArtists(topArtistsShort);
                    return;
                }
                break;
            case "medium_term":
                if (topArtistsMedium) {
                    setTopArtists(topArtistsMedium);
                    return;
                }
                break;
            case "long_term":
                if (topArtistsLong) {
                    setTopArtists(topArtistsLong);
                    return;
                }
                break;
        }

        //if you haven't fetched the data, do so and store it
        const results: UserTopArtists[] = [];
        
        for (let i = 0; i < 4; i++) {
            const data = await fetchTopArtists(accessToken, i * 50, dataTimeFrame);
            results.push(data);
        }

        switch (dataTimeFrame) {
            case "short_term":
                setTopArtistsShort(results);
                break;
            case "medium_term":
                setTopArtistsMedium(results);
                break;
            case "long_term":
                setTopArtistsLong(results);
                break;
        }
        
        setTopArtists(results);
        
    };

    if (!topArtists) {
        return (
            <>
                <TopArtistsNavBar
                    currentPathName={currentPathName}
                    hideArtistsCurrentlyOnScreenAndUpdate={hideArtistsCurrentlyOnScreenAndUpdate}>
                </TopArtistsNavBar>
                <div className="text-center">
                    <div className="loader d-inline-block"></div>
                    <h1 className="d-inline-block ps-3"> Loading</h1>
                </div>
            </>
        );
    }
    
    return (
        <>
            <div id="topArtists">
                <TopArtistsNavBar
                    currentPathName={currentPathName}
                    hideArtistsCurrentlyOnScreenAndUpdate={hideArtistsCurrentlyOnScreenAndUpdate}>
                </TopArtistsNavBar>
                    

                <div className="container border border-4 spotifyGreenBorder rounded">
                    <div className="row align-items-center">
                        <h3 className="col-2 text-center pt-4 pb-3">Rank</h3>
                        <h3 className="col-8 text-center pt-4 pb-3">Artist</h3>
                        <h3 className="col-2 text-center pt-4 pb-3">Profile Picture</h3>
                    </div>

                    {topArtists && topArtists.map((UserTopArtists, offsetNumber) => (
                        UserTopArtists.items.map((artistObject, artistNumber) => (
                        <div key={artistObject.id} className="row align-items-center border-top spotifyGreenBorder border-4">
                            <h4 className="col-2 text-center pt-3 pb-3">#{offsetNumber * 50 + artistNumber + 1}</h4>
                            <h4 className="col-8 text-center pt-3 pb-3">{artistObject.name}</h4>
                            <div className="col-2 pt-3 pb-3 text-center">
                                <img className="albumCover rounded" src={artistObject.images[0]?.url}></img>
                            </div>
                            
                        </div>
                    ))
                    ))}
                </div>
            </div>
        </>
    );
}


