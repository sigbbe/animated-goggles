
import type { Song, SpotifyTrack } from "./filter.server";

type SpotifyId = {
	client_id: string;
	client_secret: string;
};

let accessToken: string | undefined = undefined;
async function getAccessToken({ client_id, client_secret }: SpotifyId) {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			"Authorization": `Basic ${Buffer.from(client_id + ':' + client_secret).toString("base64")} `,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: 'grant_type=client_credentials'
	});
	const data = await response.json();
	const { access_token } = data;
	if (response.status === 200 && access_token !== undefined && access_token !== null) {
		accessToken = access_token;
	}
};

async function fetchTrack({ track_id }: SpotifyTrack): Promise<any> {
	return fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		}
	});
}

export async function getTrack({ track_id }: SpotifyTrack): Promise<Song | null> {
	if (!accessToken) {
		await getAccessToken({
			client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
			client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? ""
		});
	}
	const response = await fetchTrack({ track_id });
	const track = await response.json();
	return parseTrack(track);
}


function parseTrack(data: any): Song | null {
	const artists = data?.artists?.map(({ name }: { name: string; }) => name);
	const { name } = data;
	const img_src = data?.album?.images?.find(({ width }: { width: number; }) => width === 640).url;
	const src = data?.preview_url;
	return { artists, name, img_src, src };
}