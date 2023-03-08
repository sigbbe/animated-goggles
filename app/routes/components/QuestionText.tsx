import type { BaseQuestion, Explenation } from "~/models/filter.server";

export function QuestionText({ question }: { question: BaseQuestion["question"]; }) {
	return (
		<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
			{ question }
		</label>
	);
}

export function QuestionTitle({ question }: { question: BaseQuestion["title"]; }) {
	return (
		<h1 className="mb-10 bottom-9 text-center text-sm font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">{ question }</h1>
	);
}

export function QuestionImage({ image }: { image: Explenation["img"]; }) {
	return (
		<div className="mb-10 bottom-9 text-center text-sm font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
			<img
				src={ image }
				alt=""
				className="m-auto flex"
			/>
		</div>
	);
}