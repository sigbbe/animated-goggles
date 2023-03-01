import type { Question } from "@prisma/client";

enum QuestionType {
	// for text input
	ShortAnswer = 0,
	LongAnswer,
	// boolean (true/false)
	TrueFalse,
	// for radio buttons or dropdowns (i.e. single answer)
	MultipleChoice,
	MultipleChoiceGrid,
	// number between 0 and 100
	Range,
	// for checkboxes (i.e. multiple answers)
	CheckboxChoice,
	CheckboxChoiceGrid,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ShortTextQuestion = Question & {
	type: QuestionType.ShortAnswer;
};

export type { QuestionType };
