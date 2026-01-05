import { useEffect } from "react";
import { useSpotifyAuth } from "../SpotifyAuth/SpotifyAuthContext";
import { UserProfile } from "../Interfaces";

function SpotifyUserProfile() {
    const { accessToken, setProfileName } = useSpotifyAuth();
    
    useEffect(() => {
        //wait until you have an actual token
        if (!accessToken) return;

        const fetchProfileData:() => Promise<boolean> = async () => {
            
            const profileData = await fetchProfile(accessToken);
            if (profileData !== undefined) {
                setProfileName(profileData.display_name);
                return true;
            }
            return false;
        }
        fetchProfileData();
    }, [accessToken]);

    return null;
}

async function fetchProfile(token: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return await result.json(); 
}

export default SpotifyUserProfile;