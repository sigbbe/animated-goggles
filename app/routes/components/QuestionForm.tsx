import { QuestionType } from "@prisma/client";
import { Form, NavLink } from "@remix-run/react";
import { useRef } from "react";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import { QuestionText, QuestionTitle } from "./QuestionText";
import SubmitButton from "./SubmitButton";

export function questionPath({ formId, questionId }: { formId: string | null, questionId: string | undefined; }) {
	if (formId === null || formId === undefined || formId === "") {
		return '/';
	} else if (questionId === null || questionId === undefined || questionId === "") {
		return `/form/${formId}`;
	} else {
		return `/form/${formId}/question/${questionId}`;
	}
}

function isQuestion(q: QuestionType) {
	return q === QuestionType.SHORT_TEXT || q === QuestionType.LONG_TEXT || q === QuestionType.MULTIPLE_CHOICE || q === QuestionType.NUMBER_RANGE;
}

export default function QuestionForm({ question, next, children, }: Omit<FormCompoenentProps<{}>, "body">) {
	const { question: q, title, formId, id: questionId } = question;
	const ref = useRef<HTMLFormElement>(null);
	const isLastQuestion = next === undefined || next === null;
	const requiresResponse = isQuestion(question.type);
	const redirectTo = questionPath({ formId, questionId: next?.question.id });
	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { current } = ref;
		if (current) {
			question.hasAnswered = true;
			current.submit();
		}
	};
	return (
		<>
			<QuestionTitle question={ title } />
			<QuestionText question={ q } />
			<Form
				ref={ ref }
				className="relative flex flex-col justify-start"
				action={ questionPath({ formId, questionId }) }
				method={ requiresResponse ? "post" : "get" }>
				<input type="hidden" name="redirectTo" value={ redirectTo } />
				{ isLastQuestion && <input type="hidden" name="isLastQuestion" value="true" /> }
				{ children }
				{ requiresResponse ?
					<SubmitButton
						className="bottom-20 mx-auto mt-4 sm:w-1/4 w-96"
						type={ "submit" }>
						Submit answer
					</SubmitButton>
					: <NavLink
						className="text-center sm:w-1/4 mx-auto mt-4 w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						to={ redirectTo }>
						Continue
					</NavLink>
				}
			</Form>
		</>
	);
}