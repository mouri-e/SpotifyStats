import NavBar from './NavBar.tsx';
import { SpotifyAuthProvider } from './SpotifyAuth/SpotifyAuthContext.tsx';
import SpotifyAuthenticationSetup from './SpotifyAuth/SpotifyAuthentication.tsx';
import SpotifyTopItems from './ListeningData/TopItems.tsx';
import SpotifyUserProfile from './UserProfile/UserProfile.tsx';

function App() {
  
  return (
    <SpotifyAuthProvider>
      <NavBar></NavBar>
      <div className="container-fluid mt-3">
        <SpotifyAuthenticationSetup></SpotifyAuthenticationSetup>
        <SpotifyUserProfile></SpotifyUserProfile>
        
        <SpotifyTopItems></SpotifyTopItems>
        <div className="mb-5"></div>
      </div>
    </SpotifyAuthProvider>
    )
}

export default App
