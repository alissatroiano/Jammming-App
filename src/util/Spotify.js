import CONFIG from './config';

const client_id = CONFIG.clientId;
// eslint-disable-next-line
const auth_url = 'https://accounts.spotify.com/authorize';
const redirect_uri = CONFIG.redirectURI;
let accessToken;

const Spotify = 
{
	getAccessToken(){
		if (accessToken){
			return accessToken;
		}

	    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
	    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
	    if (accessTokenMatch && expiresInMatch) {
	      accessToken = accessTokenMatch[1];
	      const expiresIn = Number(expiresInMatch[1]);
	      window.setTimeout(() => accessToken = '', expiresIn * 1000);
	      window.history.pushState('Access Token', null, '/');
	      return accessToken;
	    } else {
	      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
	      window.location = accessUrl;
	    }
	},
  
  
	previewSample(id){
		const accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			return jsonResponse.preview_url;
		})
  },
  
	search(term){
		const accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			return jsonResponse.tracks.items.map(track => ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri,
				image: track.album.images[2].url
			}));
		})
  },
  
	savePlaylist(playlistName, trackURIs){
		if (!playlistName || !trackURIs.length){
			return;
		}

		const accessToken = Spotify.getAccessToken();
		const headers = {
			Authorization: `Bearer ${accessToken}`
		}
		let userID;
		return fetch('https://api.spotify.com/v1/me', { headers: headers }
		).then(response => {
			return response.json();
		}).then(jsonResponse => {
			userID = jsonResponse.id;
			return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					name: playlistName
				})
			});
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			const playlistID = jsonResponse.id;
			return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					uris: trackURIs
				})
			});
		});
	}
};

export default Spotify;