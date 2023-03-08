import type { Question } from "@prisma/client";
import { QuestionType } from "@prisma/client";
import { NavLink, useLoaderData, useMatches } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import type { AnyQuestion, BaseQuestion, ParseQuestion } from "~/models/filter.server";
import { parseQuestion } from "~/models/filter.server";
import { psqlGetFormInfo, psqlGetFormSubmission, psqlGetQuestionsForForm, psqlSetFormSubmissionCompleted } from "~/models/question.server";
import { getUser } from "~/session.server";
import Content from "../components/Content";
import FormNav from "../components/FormNav";
import { QuestionText, QuestionTitle } from "../components/QuestionText";
import { Outlet } from "./questionOutlet";

async function getQuestionsForForm({ formId, userId }: { formId: string, userId: string; }) {
	const formSubmission = (await psqlGetFormSubmission({ formId, userId }))?.questions;
	if (formSubmission) {
		console.log("found form submission");
		return formSubmission;
	} else {
		const { questions } = await psqlGetQuestionsForForm({ formId }) ?? { questions: [] };
		// TODO: 29d4929a6d071734dfdc0e1f886716dc2db39108
		return questions.map(async (question: Question) => {
			const parsed = await parseQuestion(question);
			return { ...parsed, hasAnswered: false };
		});
	}
}

export async function loader({ request, params }: LoaderArgs) {
	let user = await getUser(request);
	if (!user) return redirect("/login");

	// ID for form and question
	const { formId } = params;
	if (!formId) {
		return redirect('/');
	}
	// Get form info
	const form = await psqlGetFormInfo({ formId });

	if (!form) {
		return redirect('/');
	}
	// Get questions for form
	const questions = await Promise.all(await getQuestionsForForm({ formId, userId: user.id }));

	if (!questions) {
		return redirect('/');
	}

	const answeredAllQuestions = questions.every(({ hasAnswered, question }) => hasAnswered || question?.type === QuestionType.EXPLENATION || question?.type === QuestionType.SONG);
	const formSubmission = await psqlGetFormSubmission({ formId, userId: user.id });
	if (answeredAllQuestions && formSubmission) {
		await psqlSetFormSubmissionCompleted({ formSubmissionId: formSubmission.id });
		return redirect('/');
	}

	return { form, questions };
}

export async function action({ request, params }: ActionArgs) {
	const { formId } = params;
	let user = await getUser(request);
	if (!user) return redirect('/login');
	if (!formId) return redirect('/');
	return redirect(`/`);
}

export type FormEntry = ParseQuestion & { hasAnswered: boolean; };

export type FormState = {
	current: FormEntry;
	next: FormEntry | undefined;
};


export default function FormLandingPage() {
	const { form, questions } = useLoaderData();
	const matches = useMatches();
	const createGetters = () => {
		const current = matches[matches.length - 1]["params"]["questionId"];
		const getCurrent = () => questions.find(({ question }: { question: BaseQuestion, hasAnswered: boolean; }, i: number) => question.id == current)!;
		const getNext = () => questions.find(({ question, hasAnswered }: { question: BaseQuestion, hasAnswered: boolean, body: AnyQuestion; }, i: number) => {
			return questions[Math.max(i - 1, 0)].question.id == current && i > 0;
		}) ?? questions.find(({ question, hasAnswered }: { question: BaseQuestion, hasAnswered: boolean; }, i: number) => question.id !== current && question.type !== QuestionType.EXPLENATION && question.type !== QuestionType.SONG && !hasAnswered);
		return [getCurrent, getNext];
	};
	const [getCurrent, getNext] = createGetters();
	const formState: FormState = {
		current: getCurrent(),
		next: getNext(),
	};
	// console.log(questions.map(({ hasAnswered }: { hasAnswered: boolean; }) => hasAnswered));
	// console.log(formState.next);
	return (
		<>
			{ (!formState.current) &&
				<Content>
					<QuestionTitle question={ form.title } />
					<QuestionText question={ form.description } />
					<StartForm form={ form.id } question={ questions.find(({ hasAnswered }: { hasAnswered: boolean; }) => hasAnswered == false)?.question?.id } />
				</Content>
			}
			{ (formState.current) &&
				<>
					<FormNav
						form={ form.id }
						questions={ questions.map(({ question, hasAnswered }: { question: BaseQuestion; } & { hasAnswered: boolean; }) => { return { ...question, hasAnswered }; }) }
						currentQuestion={ formState.current?.question?.id ?? "" } />
					<Content>
						<Outlet data={ formState } />
					</Content>
				</>
			}
		</>
	);
}


function StartForm({ form, question }: { form: string, question: string; }) {
	return (
		<NavLink
			className={ "flex m-auto self-center relative justify-center" }
			to={ `/form/${form}/question/${question}` }>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Go to form
			</button>
		</NavLink>
	);
}
