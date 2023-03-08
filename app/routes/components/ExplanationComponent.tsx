import type { Explenation } from "~/models/filter.server";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import QuestionForm from "./QuestionForm";
import { QuestionImage } from "./QuestionText";

const ExplanationComponent = ({ question, body, next, children }: FormCompoenentProps<Explenation>) => {
	const { img } = { ...question, ...body };
	return (
		<QuestionForm question={ question } next={ next }>
			<QuestionImage image={ img } />
			{ children }
		</QuestionForm>
	);
};

export default ExplanationComponent;