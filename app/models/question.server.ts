import type { Form, Question, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { mode } from "~/utils";

/**
 * @param formId - the id of the form 
 * @param ids - the ids of the questions 
 * @returns Questions
 */
export function getQuestion({ id }: { id: Question["id"]; }) {
	return prisma.question.findFirst({
		select: {
			id: true, body: true, title: true, formId: true, choices: {
				select: {
					choice1: true,
					choice2: true,
					choice3: true,
					choice4: true,
					choice5: true,
					choice6: true,
					choice7: true,
					choice8: true,
					choice9: true,
					choice10: true,
				}
			}
		},
		where: {
			id: {
				equals: id,
			}
		},
	});
}

function isMultipleChoiceQuestion(question: any): question is MultipleChoiceQuestion {
	return question.choices !== null;
}

export function newMultipleChoice(question: Question | any) {
	if (isMultipleChoiceQuestion(question)) {
		return {
			choices: Object.values(question.choices).filter((choice) => choice !== null),
			body: question.body,
			id: question.id,
			title: question.title,
			formId: question.formId,
		};
	}
	return question;
}

export type MultipleChoiceQuestion = Question & Omit<Question, "choices"> & {
	choices: string[];
};
export type FormData = Extract<Form, "id" | "title">;

export async function getFormsIds() {
	return prisma.form.findMany({
		select: {
			id: true,
			title: true,
		}
	});
}

/**
* @param {string} id - the id of the Form
*/
export function getQuestionIdsForForm({ formId }: { formId: Form["id"]; }) {
	return prisma.form.findFirst({
		where: {
			id: formId
		},
		include: {
			questions: {
				select: {
					id: true,
				}
			}
		}
	});
}

export function getFormInfo({ formId }: { formId: Form["id"]; }) {
	return prisma.form.findFirst({
		select: {
			id: true,
			title: true,
			description: true,
		},
		where: {
			id: formId
		}
	});
}

export function getAllForms() {
	return prisma.form.findMany({
		select: {
			id: true,
			title: true,
			questions: {
				select: {
					id: true,
					title: true,
					body: true,
				}
			},
		},
	});
}

export function answerQuestion({ questionId, answer, user }: { questionId: Question["id"]; answer: string, user: User; }) {
	return prisma.answer.create({
		data: {
			body: answer,
			user: {
				connect: {
					id: user.id,
				},
			},
			question: {
				connect: {
					id: questionId,
				}
			},
		},
	});
}

function transformData(answers: any, questions: any, numRows: number) {
	for (const i in answers) {
		const { questionId, userId, body } = answers[i];
		let ansList = questions.get(questionId)["answers"];
		if (ansList) {
			ansList.push({
				userId,
				answer: body,
			});
		} else {
			questions.set(questionId, {
				question: questions.get(questionId),
				answers: [{
					userId,
					answer: body,
				}]
			});
		}
	}
	for (let [key, value] of questions) {
		if (typeof value === "string") {
			questions.set(key, {
				question: value,
				answers: Array.from({ ...[], length: numRows }, (v) => v ?? null)
			});
		} else if (typeof value === "object") {
			questions.set(key, {
				question: value.question,
				answers: Array.from({ ...value["answers"], length: numRows }, (v) => v ?? null)
			});
		}
	}

	return questions;
}

export async function exportData() {
	const users = new Map((await prisma.user.findMany({
		select: {
			id: true,
			email: true,
		}
	}))?.map((v) => [v.id, v.email]));
	console.log(users);

	const q = await prisma.question.findMany({
		select: {
			id: true,
			body: true,
		}
	});
	let questions = new Map();
	for (const i in q) {
		questions.set(q[i].id, {
			question: q[i].body,
			answers: []
		});
		questions.set(q[i].id, q[i].body);
	}
	const answers = await prisma.answer.findMany({
		select: {
			body: true,
			questionId: true,
			userId: true,
		}
	});
	const rows = mode(answers.map((v) => v.questionId));
	const columns = Array.from(questions.keys());
	columns.push("userId");

	const numRows = rows?.maxCount || 0;
	const questionAnswerMap = transformData(answers, questions, numRows);
	const t = Array.from(Array(numRows).keys()).map((i) => {
		const map = new Map();
		const user = new Set();
		for (const [key, value] of questionAnswerMap) {
			const ans = value.answers[i]?.answer;
			const usr = value.answers[i]?.userId;
			map.set(key, ans);
			if (usr) {
				user.add(users.get(usr));
			}
		}
		if (user.size > 1) {
			console.log("Multiple users");
		}
		map.set("userId", user.values().next().value);
		return Object.fromEntries(map);
	});
	return t;
}

function bais() {
	// let maxAns = 0;
	// for (const i in answers) {
	// 	const { questionId, userId, body } = answers[i];
	// 	let ansList = questions.get(questionId)["answers"];
	// 	if (ansList) {
	// 		ansList.push({
	// 			userId,
	// 			answer: body,
	// 		});
	// 		if (ansList.length > maxAns) {
	// 			maxAns = ansList.length;
	// 		}
	// 	} else {
	// 		questions.set(questionId, {
	// 			question: questions.get(questionId),
	// 			answers: [{
	// 				userId,
	// 				answer: body,
	// 			}]
	// 		});
	// 	}
	// }
	// console.log(questions);
	// let res = new Map();
	// for (const [, value] of questions) {
	// 	const entries = value["question"];
	// 	if (entries) {
	// 		const answersForQuestion = value["answers"].map((v: any) => v.answer);
	// 		const val = Array.from({ ...answersForQuestion, length: maxAns }, (v, i) => v ?? null);
	// 		res.set(value["question"], val);
	// 	}
	// }
}