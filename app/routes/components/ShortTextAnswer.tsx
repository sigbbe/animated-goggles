import type { Question } from "@prisma/client";
import type { FormState } from "../form/$formId";
import { useParentData } from "../form/questionOutlet";
import QuestionForm, { questionPath } from "./QuestionForm";

export default function ShortTextAnswer({ question }: { question: Question; }) {
	const { id } = question;
	const { form, state } = useParentData<FormState>();
	return (
		<QuestionForm question={ question }>
			<input type="hidden" name="redirectTo" value={ questionPath({ formId: form.id, questionId: state.next }) } />
			<div className="mb-4">
				<input
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					name={ id }
					type="text"
				/>
			</div>
		</QuestionForm>
	);
}