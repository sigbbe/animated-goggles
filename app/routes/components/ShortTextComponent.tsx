import { useFocusOnLoad } from "~/utils";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import QuestionForm from "./QuestionForm";

export default function ShortTextComponent({ question, next }: FormCompoenentProps<{}>) {
	const ref = useFocusOnLoad<HTMLInputElement>();
	return (
		<QuestionForm question={ question } next={ next }>
			<div className="mb-10">
				<input
					ref={ ref }
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					name={ question.id }
					type="text"
				/>
			</div>
		</QuestionForm>
	);
}