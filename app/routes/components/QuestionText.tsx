import type { Question } from "@prisma/client";

export function QuestionText({ question }: { question: Question["body"]; }) {
	return (
		<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
			{ question }
		</label>
	);
}

export function QuestionTitle({ question }: { question: Question["title"]; }) {
	return (
		<h1 className="bottom-9 text-center mb-4 text-sm font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">{ question }</h1>
	);
} 