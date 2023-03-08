import type { Answer, Form, FormSubmission, Question, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { parseQuestion } from "./filter.server";

async function psqlCreateEmptyFrom({ title, description }: { title: Form["title"], description: Form["description"]; }) {
	return prisma.form.create({
		data: {
			title,
			description,
		},
		select: {
			id: true,
		}
	});
}

async function psqlPopulateFrom({ formId, questions }: { formId: Form["id"], questions: NewFormQuestion[]; }) {
	function mapToJsonNull(body: Question["body"]): Prisma.JsonNullValueInput | Prisma.InputJsonValue {
		if (body === null) {
			return Prisma.JsonNullValueInput.JsonNull;
		} else {
			return body;
		}
	}
	return prisma.question.createMany({
		data: questions.map(({ title, body, formId, type }: NewFormQuestion) => ({
			title,
			body: mapToJsonNull(body),
			formId,
			type
		})),
		skipDuplicates: true,
	});
}

type NewFormQuestion = Omit<Question, "id">;
type NewQuestion = Exclude<Question, { id: Question["id"], formId: Question["formId"], type: Question["type"]; }>;

export async function psqlCreateForm({ title, description, questions }: { title: Form["title"], description: Form["description"], questions: NewQuestion[]; }) {
	const { id } = await psqlCreateEmptyFrom({ title, description });
	return await psqlPopulateFrom({ formId: id, questions: questions.map(({ title, body, type }: NewQuestion) => ({ title, body, formId: id, type, formSubmissionId: null })) });
}

const QUESTION_DEFUALT_SELECT = {
	id: true,
	title: true,
	body: true,
	formId: true,
	type: true
};

const FORM_DEFAULT_SELECT = {
	id: true,
	title: true,
	description: true,
	questions: {
		select: QUESTION_DEFUALT_SELECT,
	}
};

export async function psqlGetForms({ select, where }: { select?: Prisma.FormSelect, where?: Prisma.FormWhereInput; }) {
	return prisma.form.findMany({
		select: select ?? FORM_DEFAULT_SELECT,
		where: where ?? {},
	});
}

export async function psqlGetQuestion({ id }: { id: Question["id"]; }) {
	return prisma.question.findUnique({
		where: {
			id,
		},
		select: QUESTION_DEFUALT_SELECT,
	});
}

export async function psqlGetQuestions({ ids }: { ids: Question["id"][]; }) {
	return await prisma.question.findMany({
		where: {
			id: {
				in: ids
			}
		},
		select: QUESTION_DEFUALT_SELECT,
	});
}

export async function psqlGetQuestionsForForm({ formId }: { formId: Form["id"]; }) {
	return prisma.form.findFirst({
		where: {
			id: formId
		},
		select: {
			id: true,
			questions: {
				select: QUESTION_DEFUALT_SELECT,
			}
		},
		orderBy: {
			questions: {
				_count: "asc"
			}
		}
	});
}

export async function psqlGetFormsIds() {
	return prisma.form.findMany({
		select: {
			id: true,
			title: true,
		},
	});
}
export async function psqlAnswerQuestion({ answer }: { answer: Omit<Answer, "id">; }) {
	const { body, userId, questionId, formSubmissionId, trackId } = answer;
	return prisma.answer.create({
		data: {
			body,
			userId,
			questionId,
			formSubmissionId,
			trackId,
		},
	});
}

export async function psqlAnswerQuestions({ answers }: { answers: Omit<Answer, "id">[]; }) {
	return prisma.answer.createMany({
		data: answers.map(({ questionId, userId, body }: Omit<Answer, "id">) => ({
			questionId,
			userId,
			body,
		})),
		skipDuplicates: true,
	});
}


export async function psqlGetFormInfo({ formId }: { formId: Form["id"]; }) {
	return prisma.form.findFirst({
		where: {
			id: formId
		},
		select: {
			id: true,
			title: true,
			description: true
		}
	});
}

export async function psqlGetQuestionsUserHasAnswered({ userId }: { userId: Answer["userId"]; }) {
	return prisma.answer.findMany({
		where: {
			userId,
		},
		select: {
			questionId: true,
		},
	});
}

export async function psqlSetFormSubmissionCompleted({ formSubmissionId }: { formSubmissionId: FormSubmission["id"]; }) {
	const answers = await prisma.formSubmission.findFirst({
		where: {
			id: formSubmissionId,
			completed: false
		},
		select: {
			formId: true,
			answers: {
				select: {
					questionId: true,
				}
			}
		}
	});
	if (answers) {
		const { formId, answers: questionIds } = answers;
		const questions = (await psqlGetQuestionsForForm({ formId }))?.questions.map(({ id }) => id);
		if (!questions) return;
		const hasAnsweredAllQuestions = questionIds.map(({ questionId }) => questionId).every((id) => questions.includes(id));
		if (hasAnsweredAllQuestions) {
			await psqlUpdateFormSubmission({ formSubmissionId });
		}
	}
	return;
}

async function psqlUpdateFormSubmission({ formSubmissionId }: { formSubmissionId: FormSubmission["id"]; }) {
	return prisma.formSubmission.update({
		where: {
			id: formSubmissionId,
		},
		data: {
			completed: true,
		},
	});
}

export async function psqlGetFormSubmission({ userId, formId }: { userId: User["id"], formId: Form["id"]; }) {
	const formSubmission = await prisma.formSubmission.findFirst({
		where: {
			userId,
			formId,
			completed: false,
		},
		select: {
			id: true,
			answers: {
				select: {
					questionId: true,
					question: { select: QUESTION_DEFUALT_SELECT }
				}
			},
		}
	});
	if (!formSubmission) return;
	const { id } = formSubmission;
	const answers = formSubmission.answers.map(({ questionId }) => questionId);
	const questions = await psqlGetQuestionsForForm({ formId });
	// TODO: 29d4929a6d071734dfdc0e1f886716dc2db39108
	return {
		id, questions: questions?.questions.map(async (q: Question) => {
			const parsed = await parseQuestion(q);
			return { ...parsed, hasAnswered: answers.includes(q.id) };
		})
	};
}

async function psqlCreateEmptyFromSubmission({ userId, formId }: { userId: User["id"], formId: Form["id"]; }) {
	return prisma.formSubmission.create({
		data: {
			userId,
			formId
		},
		select: {
			id: true,
			answers: {
				select: {
					questionId: true,
				}
			},
		}
	});
}

export async function psqlGetOrCreateFormSubmission({ userId, formId }: { userId: User["id"], formId: Form["id"]; }) {
	// if user has an unfinished form submission, return that
	const unfinishedFormSubmission = await psqlGetFormSubmission({ userId, formId });
	// else create a new form submission
	if (unfinishedFormSubmission) {
		return unfinishedFormSubmission;
	} else {
		return psqlCreateEmptyFromSubmission({ userId, formId });
	}
}

export async function psqlExportAnswers({ form }: { form: Form["id"]; }) {
	const submissions = await prisma.formSubmission.findMany({
		where: {
			formId: form,
			completed: true
		},
		select: {
			answers: {
				select: {
					body: true,
					questionId: true
				}
			}
		}
	});
	return submissions.map(({ answers }) => {
		const row = new Map();
		answers.forEach(({ questionId, body }) => {
			row.set(questionId, toFloatIntOrString(body));
		});
		return Object.fromEntries(row);
	});
}

function toFloatIntOrString(value: string) {
	const parsed = parseFloat(value);
	if (isNaN(parsed)) return value;
	if (Number.isInteger(parsed)) return parsed;
	return parsed;
}

// export async function psql_({}: {}) {}