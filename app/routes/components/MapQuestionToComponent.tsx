import { QuestionType } from "@prisma/client";
import type { AnyQuestion, BaseQuestion, Explenation, MultipleChoice, NumberRange, Song } from "~/models/filter.server";
import type { FormEntry, FormState } from "../form/$formId";
import ExplanationComponent from "./ExplanationComponent";
import LongTextComponent from "./LongTextComponent";
import MultipleChoiceComponent from "./MultipleChoiceComponent";
import MusicPlayer from "./MusicPlayer";
import NumberRangeComponent from "./NumberRangeComponent";
import ShortTextComponent from "./ShortTextComponent";

export interface FormCompoenentProps<T extends AnyQuestion> {
	question: BaseQuestion & { hasAnswered: boolean; },
	body: T,
	next: FormEntry | undefined;
	children?: React.ReactNode;
}

export default function MapQuestionToComponent({ current, next }: FormState) {
	const { body } = current;
	const question = { ...current.question, hasAnswered: current.hasAnswered };
	if (!body && questionBodyRequired(question)) { return null; }
	switch (current.question.type) {
		case QuestionType.SHORT_TEXT:
			return <ShortTextComponent
				question={ question }
				body={ body }
				next={ next } />;
		case QuestionType.LONG_TEXT:
			return <LongTextComponent
				question={ question }
				body={ body }
				next={ next } />;
		case QuestionType.EXPLENATION:
			return <ExplanationComponent
				question={ question }
				body={ body as Explenation }
				next={ next } />;
		case QuestionType.NUMBER_RANGE:
			return <NumberRangeComponent
				question={ question }
				body={ body as NumberRange }
				next={ next } />;
		case QuestionType.MULTIPLE_CHOICE:
			return <MultipleChoiceComponent
				question={ question }
				body={ body as MultipleChoice }
				next={ next } />;
		case QuestionType.SONG:
			return <MusicPlayer
				question={ question }
				body={ body as Song }
				next={ next } />;
		default:
			return null;
	}
}

function questionBodyRequired(question: BaseQuestion) {
	return question.type !== QuestionType.SHORT_TEXT && question.type !== QuestionType.LONG_TEXT;
}