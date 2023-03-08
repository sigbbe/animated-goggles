import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { fetchNewSpotifyToken } from "./spotify";

const SPOTIFY_URI = "spotify:track:7xGfFoTpQ2E7fRF5lN10tr";

const PlayCarlyRaeJepsen = () => {
	const device = usePlayerDevice();

	const playCarlyRaeJepsen = () => {
		if (device === null) return;

		fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
			{
				method: "PUT",
				body: JSON.stringify({ uris: [SPOTIFY_URI] }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${fetchNewSpotifyToken()}`,
				},
			},
		);
	};

	if (device === null) return null;

	return <button onClick={ playCarlyRaeJepsen }>Play Carly Rae Jepsen</button>;
};

export default PlayCarlyRaeJepsen;