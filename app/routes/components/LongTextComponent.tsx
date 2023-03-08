import { useState } from "react";
import { useFocusOnLoad } from "~/utils";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import QuestionForm from "./QuestionForm";

export default function LongTextComponent({ question, next }: FormCompoenentProps<{}>) {
	const [answer, setAnswer] = useState("");
	const ref = useFocusOnLoad<HTMLTextAreaElement>();
	const updateValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		const { value } = e.target;
		if (value.length <= 250) {
			setAnswer(value);
		}
	};
	return (
		<QuestionForm question={ question } next={ next }>
			<textarea
				ref={ ref }
				id="message"
				name={ question.id }
				rows={ 5 }
				value={ answer }
				onChange={ updateValue }
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			>
			</textarea>
			<div className="ml-auto">{ `${answer.length}/250` }</div>
		</QuestionForm>
	);
}