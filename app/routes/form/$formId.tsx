import { NavLink, useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getFormInfo, getQuestionIdsForForm } from "~/models/question.server";
import Content from "~/routes/components/Content";
import { requireUserId } from "~/session.server";
import { Outlet } from "./questionOutlet";

export async function loader({ request, params }: LoaderArgs) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const userId = await requireUserId(request);

	// ID for form and question
	const { formId } = params;

	if (!formId) {
		return redirect('/');
	}
	// Get form info
	const form = await getFormInfo({ formId });

	// Get questions for form
	const res = await getQuestionIdsForForm({ formId });

	if (!res || !res.questions) {
		return redirect('/');
	}
	const { questions } = res;
	return { form, questions: questions.map((q: any) => q.id) };
}

export type FormState = {
	form: {
		id: string;
		title: string;
		description: string;
	};
	questions: string[];
	state: {
		current: string;
		next: string;
	};

};

export default function FormLandingPage() {
	const { form, questions } = useLoaderData();
	const matches = useMatches();
	const current = matches[matches.length - 1]["params"]["questionId"];
	const next = questions[questions.indexOf(current) + 1];
	return (
		<>
			{ (!current) &&
				<Content>
					<h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">{ form.title }</h1>
					<div>{ form.description }</div>
					<br />
					<StartForm form={ form.id } question={ questions[0] } />
				</Content>
			}
			{ (current) &&
				<>
					<FormNav
						form={ form.id }
						questions={ questions }
						currentQuestion={ current } />
					<Content>
						<Outlet data={ {
							form,
							questions,
							state: {
								current,
								next
							}
						} } />
					</Content>
				</>
			}
		</>
	);
}

export const getColorScheme = (isActive: boolean) => {
	return isActive ?
		'text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white'
		: 'text-center block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4';
};

function FormNav({ form, questions, currentQuestion }: { form: string, questions: string[], currentQuestion: string; }) {
	return (
		<div className="flex flex-row justify-center p-4">
			{ questions.map((q, i) => (
				<NavLink
					to={ `/form/${form}/question/${q}` }
					key={ q }
					className={ `ml-5 mr-5 p-3 text-center ${getColorScheme(q === currentQuestion)}` }>
					{ i + 1 }
				</NavLink>
			)) }
		</div>
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
