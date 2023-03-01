import type { Question } from "@prisma/client";
import type { ReactNode } from "react";
import { Form } from "react-router-dom";
import { QuestionText, QuestionTitle } from "./QuestionText";
import SubmitButton from "./SubmitButton";

export function questionPath({ formId, questionId }: { formId: string, questionId: string; }) {
	if (!formId || !questionId) {
		return "/form";
	}
	return `/form/${formId}/question/${questionId}`;
}

export default function QuestionForm({ question, children }: { question: Question, children: ReactNode; }) {
	const { body, title, formId, id: questionId } = question;
	return (
		<>
			<QuestionTitle question={ title } />
			<QuestionText question={ body } />
			<Form
				action={ questionPath({ formId, questionId }) }
				method="post">
				{ children }
				<SubmitButton type={ "submit" }>Submit answer</SubmitButton>
			</Form>
		</>
	);
}