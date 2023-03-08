import type { ReactNode } from "react";
import { useCallback } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";

export function fetchNewSpotifyToken(): string {
	return "BQA0XzNTwCsBYJLVo2V_2vn4p4SFVjKcVaGskbNflLehtwNSOeogTk0IbDI2AnwLtW7YM0B3oKoab4an2yd7TWmorTbIChMRMyOzPyRhbzlH-_rMUuRZQnbeRRwI8zXVZwXnbbyUaYjeOXdAjE6dPeKpgjy0l8A1AIzNt98DbNRoMeX6uUWs4icTFiYEMQc";
}

const MySpotifyPlayer = ({ children }: { children: ReactNode; }) => {
	const getOAuthToken = useCallback((callback: (token: string) => void) => {
		const token = fetchNewSpotifyToken();
		callback(token);
	}, []);
	const WebPlaybackSDKProps = {
		initialDeviceName: "My Spotify App",
		deviceName: "My Spotify App",
		getOAuthToken: getOAuthToken,
		volume: 0.5,
		connectOnInitialized: true,
	};

	return (
		<WebPlaybackSDK { ...WebPlaybackSDKProps }>
			{ children }
		</WebPlaybackSDK>
	);
};

export default MySpotifyPlayer;