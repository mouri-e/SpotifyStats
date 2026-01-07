import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSpotifyAuth } from "./SpotifyAuthContext"; 
import { SpotifyAccessTokenRefreshResponse } from "../Interfaces";

function SpotifyAuthenticationSetup() {
    const { accessToken, setAuthData } = useSpotifyAuth();
    const navigate = useNavigate();

    useEffect(() => {
        //only do the original authentication one time
        if (accessToken) return;

        const fetchSpotifyAccessToken:() => Promise<boolean> = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
    
            if (!code) {
                redirectToAuthCodeFlow(clientId);
                return true;
            } 
            else {
                const tokenVariables = await getAccessToken(clientId, code);
                navigate("#/TopTracksShortTerm", { replace: true });
                
                if (tokenVariables != undefined) {
                    setAuthData(
                        tokenVariables.access_token,
                        tokenVariables.refresh_token,
                        tokenVariables.expires_in
                    );
                    
                }
                if (tokenVariables === undefined) {

                    return false;
                }
                return true;
               
            }
        }
        fetchSpotifyAccessToken();
    }, []);

    return null;
}

async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://mouri-e.github.io/SpotifyStats/#/callback");
    params.append("scope", "user-read-private user-read-email " +
    "user-read-playback-state user-modify-playback-state user-read-currently-playing" +
    " app-remote-control streaming playlist-read-private playlist-read-collaborative user-follow-read" +
    " user-read-playback-position user-top-read user-read-recently-played user-library-read user-read-email"
    );
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getAccessToken(clientId: string, code: string): Promise<SpotifyAccessTokenRefreshResponse> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://mouri-e.github.io/SpotifyStats/#/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    
    return await result.json();
}

const clientId = 'e54e374cf6c04c77b2a0135aa5f94ab7';

export default SpotifyAuthenticationSetup;
