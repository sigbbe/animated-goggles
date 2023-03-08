import type { MouseEvent } from "react";
import { useState } from "react";
import type { BaseQuestion, MultipleChoice } from "~/models/filter.server";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import QuestionForm from "./QuestionForm";

export default function MultipleChoiceComponent({ question, body, next }: FormCompoenentProps<MultipleChoice>) {
	const { id: questionId } = question;
	const { choices } = body;
	const [selected, setSelected] = useState<string | null>(null);

	const selectInputFromDiv = (evt: MouseEvent<HTMLDivElement, MouseEvent>) => {
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

	return (
		<QuestionForm question={ question } next={ next }>
			<RadioButtons
				choices={ choices }
				questionId={ questionId }
				isSelected={ isSelected }
				onClick={ selectInputFromDiv } />
		</QuestionForm>
	);
}

interface RadioButtonsProps {
	choices: MultipleChoice["choices"],
	questionId: BaseQuestion["id"];
	isSelected: (choice: string) => boolean;
	onClick: (evt: any) => void;
}

const getColorScheme = (isActive: boolean) => {
	return isActive ?
		'text-center block border border-blue-500 rounded py-2 px-4 bg-blue-100 text-white'
		: 'text-center block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4';
};

function RadioButtons({ choices, questionId, isSelected, onClick }: RadioButtonsProps) {
	return (
		<ul className="w-full mb-10 p-x-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
			{ choices.map((choice: string, i: number) => {
				const id = `choice_${i}_${choice}`;
				return (
					<li
						key={ i }
						className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
						<div
							onClick={ onClick }
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
	);
}