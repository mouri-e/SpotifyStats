import { createContext, useContext, useEffect, useState } from "react";

interface SpotifyAuthContextType {
    accessToken: string | null;
    profileName: string | null;
    setProfileName: (name: string | null) => void;
    //GPT
    refreshToken: string | null;
    expirationTime: number | null;
    setAuthData: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number
    ) => void;
    refreshAccessToken: () => Promise<string | null>;
}

const clientID = 'e54e374cf6c04c77b2a0135aa5f94ab7';

const SpotifyAuthContext = createContext<SpotifyAuthContextType>({
    accessToken: null,
    profileName: null,
    setProfileName: () => { },
    //GPT
    refreshToken: null,
    expirationTime: null,
    setAuthData: () => {},
    refreshAccessToken: async () => null,
    
});

export const SpotifyAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [profileName, setProfileName] = useState<string | null>(null);

    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expirationTime, setExpirationTime] = useState<number | null>(null);

    const setAuthData = (
        newAccessToken: string,
        newRefreshToken: string,
        expiresIn: number
    ) =>
    {
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setExpirationTime(Date.now() + (expiresIn * 1000));
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        if (!refreshToken) return null;

        const params = new URLSearchParams();
        params.append("client_id", clientID);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);

        const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        const data = await result.json();

        if (!data.access_token) return null;
    
        setAccessToken(data.access_token);
        setExpirationTime(Date.now() + data.expires_in * 1000);

        return data.access_token;
    };

    /* Refresh the spotify access token before it expires */
    useEffect(() => {
        
        if (!expirationTime) return;

        const timeout = expirationTime - Date.now() - 60000;
        
        if (timeout <= 0) return;

        const autoRefreshToken = setTimeout(() => { refreshAccessToken();}, timeout);

        return () => clearTimeout(autoRefreshToken);
    }, [expirationTime]);
    
    return (
        <SpotifyAuthContext.Provider value={{
            accessToken,
            profileName,
            setProfileName,
            refreshToken,
            expirationTime,
            setAuthData,
            refreshAccessToken}}>
            {children}
        </SpotifyAuthContext.Provider>
    );
};

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);