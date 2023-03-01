
// -------------------- NOT TO BE USED FOR ACTUAL USE CASES ------------------------ //

import { prisma } from "~/db.server";

/**
 * data needed to create a question
 */
type QuestionBody = Pick<Question, "title"> &
	Pick<Question, "body"> &
	Pick<Question, "formId">;


/**
 * @param data - the data (i.e., title, body, and FormId) to create
 * the question with
 */
export function createQuestion({ title, body, formId }: QuestionBody) {
	return prisma.question.create({
		data: {
			title,
			body,
			formId,
		},
	});
}

/**
 * @param data - the data (i.e., questions for a new Form) to create 
 * the Form with
 */
export function createForm(title: string, description: string, data: QuestionBody[]) {
	return prisma.form.create({
		data: {
			title,
			description,
			questions: {
				create: data.map(({ title, body, formId }) => ({
					title, body, formId
				}))
			}
		},
	});
}