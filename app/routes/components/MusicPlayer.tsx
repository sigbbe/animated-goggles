import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useRef, useState } from "react";
import defaultImageSrc from "~/assets/default-album-artwork.png";
import type { Song } from "~/models/filter.server";
import { fancyTimeFormat } from '~/utils';
import type { FormCompoenentProps } from './MapQuestionToComponent';
import QuestionForm from './QuestionForm';

const startTime = {
	played: 0,
	duration: 0
};

function MusicPlayer({ question, body, next }: FormCompoenentProps<Song>) {
	const audioElement = useRef<HTMLAudioElement>(null);
	const intervals = new Set<NodeJS.Timer>();
	const [isPlaying, _setIsPlaying] = useState(false);
	const [time, setTime] = useState(startTime);
	const [song, _setSong] = useState(body);
	const setSong = (song: Song) => {
		clearAllIntervals();
		_setSong(song);
	};
	const setIsPlaying = (isPlaying: boolean) => {
		clearAllIntervals();
		if (isPlaying) {
			audioElement.current?.play();
		} else {
			audioElement.current?.pause();
		}
		_setIsPlaying(isPlaying);
	};
	const clearAllIntervals = () => {
		intervals.forEach(clearInterval);
	};
	if (song.id !== body.id) {
		setSong(body);
		setIsPlaying(false);
		setTime(startTime);
	}
	const cleanUpIfEnded = () => {
		const { current } = audioElement;
		if (current?.ended) {
			setTime(startTime);
			setIsPlaying(false);
			intervals.forEach(clearInterval);
		}
	};
	const getTime = (audio: HTMLAudioElement) => {
		return {
			played: audio.currentTime,
			duration: audio.duration
		};
	};
	const togglePlay = () => {
		const { current } = audioElement;
		if (!current) return;
		if (isPlaying) {
			setIsPlaying(false);
		} else {
			setIsPlaying(true);
			const interval = setInterval(() => {
				const time = getTime(current);
				setTime(time);
				cleanUpIfEnded();
			}, 1000);
			intervals.add(interval);
		}
	};
	return (
		<QuestionForm question={ question } next={ next }>
			<div className="w-3/4 m-auto rounded shadow-2xl">
				<audio src={ body.src } ref={ audioElement } />
				<PlayerDetails song={ body } />
				<PlayerControls
					song={ body }
					isPlaying={ isPlaying }
					togglePlay={ togglePlay }
					timePlayed={ time.played }
					duration={ time.duration }
				/>
			</div>
		</QuestionForm>
	);
}

function PlayerDetails({ song }: { song: Song; }) {
	const didNotLoad = song.src === null || song.src === undefined;
	return (
		<>
			<div className="relative text-center text-yellow-50">
				<img
					className={ `${didNotLoad && "blur-sm"} max-h-96 w-full rounded-t object-scale-down` }
					src={ song.img_src ?? defaultImageSrc }
					alt={ "title" }
				/>
				{ didNotLoad && <p className="text-2xl text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2">Could not load song</p> }
			</div>
			{/* nice looking text for title of the song */ }
			<h3 className="mt-4 text-center font-sans text-2xl">{ song.artists?.join(", ") }</h3>
			<h4 className="text-center text-gray-600 font-sans text-md">{ song.name }</h4>
		</ >
	);
}

interface PlayerControlsPropsI {
	togglePlay: () => void;
	isPlaying: boolean;
	song: Song;
	timePlayed: number;
	duration: number;
}

function PlayerControls({ togglePlay, isPlaying, song, timePlayed, duration }: PlayerControlsPropsI) {
	const percentPlayed = duration === 0 ? 0 : (timePlayed / duration) * 100;
	const didNotLoad = song.src === null || song.src === undefined;
	return (
		<div className="my-3 pb-3">
			<span className="w-full flex justify-center flex-row align-middle">
				<p className="text-gray-500 dark:text-gray-400">{ fancyTimeFormat(timePlayed) }</p>
				<div className="h-1 mx-3 my-auto w-3/4 bg-neutral-200 dark:bg-neutral-600">
					<div className="h-1 bg-blue-500 rounded" style={ { width: `${percentPlayed}%` } }></div>
				</div>
				<p className="text-gray-500 dark:text-gray-400">{ fancyTimeFormat(duration - timePlayed) }</p>
			</span>
			{ !didNotLoad &&
				<button
					onClick={ togglePlay }
					className="mb-3 mx-auto rounded-full p-2 flex play-btn bg-gray-300 hover:bg-gray-400 text-gray-800">
					{ isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon /> }
				</button>
			}
		</div>
	);
}

export default MusicPlayer;