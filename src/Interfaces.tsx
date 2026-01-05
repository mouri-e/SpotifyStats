export interface Image {
    url: string;
    height: number;
    width: number;
}

/* User Profile Interfaces */
export interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls: { spotify: string };
    followers: { href: string; total: number };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

/* Top Tracks Interfaces */
export interface UserTopTracks {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: TrackObject[];
}

export interface TrackObject { //rtbe
    album: AlbumObject;
    artists: SimplifiedArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    }
    external_urls: {spotify: string};
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: {external_urls: {spotify: string;}}
    restrictions: {reason: string;}
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;      
}

export interface AlbumObject {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {spotify: string};
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {reason: string}
    type: string;
    uri: string;
    artists: SimplifiedArtistObject[];
}

export interface SimplifiedArtistObject {
    external_urls: {spotify: string};
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

/* Top Artists Interfaces */
export interface UserTopArtists {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: ArtistObject[];
}

export interface ArtistObject {
    external_urls: {spotify: string};
    followers: {
          href: string;
          total: number
        };
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;     
}

/* Recently Played Interfaces */
export interface RecentlyPlayedTracks {
    href: string;
    limit: number;
    next: string;
    cursors: {
        after: string;
        before: string;
    };
    items: PlayHistoryObject[];
}

export interface PlayHistoryObject {
    track: TrackObject;
    played_at: string;
    context: PlayHistoryContext;
}

interface PlayHistoryContext {
    type: string;
    href: string;
    external_urls: { spotify: string; }
    uri: string;
}

export interface SpotifyAccessTokenRefreshResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}