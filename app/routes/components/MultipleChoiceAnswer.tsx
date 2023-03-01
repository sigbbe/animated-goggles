import { useState } from "react";
import type { MultipleChoiceQuestion } from "~/models/question.server";
import { getColorScheme } from "../form/$formId";
import QuestionForm from "./QuestionForm";

export default function MultipleChoiceAnswer({ question }: { question: MultipleChoiceQuestion; }) {
	const { id: questionId, choices } = question;
	const [selected, setSelected] = useState<string | null>(null);

	const selectInputFromDiv = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const { target } = evt;
		let value = null;
		if (target instanceof HTMLInputElement) {
			value = target.value;
		} else if (target instanceof HTMLLabelElement) {
			value = target.innerText;
		}
		if (choices.indexOf(value || "") !== -1) {
			setSelected(value);
		}
	};
	const isSelected = (choice: string) => {
		return selected === choice;
	};

	const selectInputFromInput = (evt: React.FocusEvent<HTMLInputElement>) => {
		const target = evt.target;
		setSelected(target.id);
	};
	return (
		<QuestionForm question={ question }>
			<ul className="w-full p-x-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
				{ choices.map((choice, i) => {
					const id = `choice_${i}_${choice}`;
					return (
						<li
							key={ i }
							className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
							<div
								onClick={ selectInputFromDiv }
								className={ `flex items-center pl-3 ${getColorScheme(isSelected(choice))}` }>
								<input
									id={ id }
									type="radio"
									value={ choice }
									name={ questionId }
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
								<label
									htmlFor={ id }
									className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>{ choice }
								</label>
							</div>
						</li>
					);
				}) }
			</ul>
			<br />
		</QuestionForm>
	);
}