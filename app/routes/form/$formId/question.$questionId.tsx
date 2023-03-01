import { useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { answerQuestion, getQuestion, newMultipleChoice } from "~/models/question.server";
import { getUserById } from "~/models/user.server";
import MultipleChoiceAnswer from "~/routes/components/MultipleChoiceAnswer";
import ShortTextAnswer from "~/routes/components/ShortTextAnswer";
import { requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export async function loader({ params }: LoaderArgs) {
	// ID for form and question
	const { questionId } = params;

	if (!questionId) {
		return redirect('/form');
	}

	// Get questions for form
	let question = await getQuestion({ id: questionId });

	if (!question) {
		console.log(`Question ${questionId} not found`);
		return null;
	}

	return { question: newMultipleChoice(question) };
}

export async function action({ request, params }: ActionArgs) {
	const { questionId } = params;
	const data = await request.formData();
	const answer = data.get(questionId || "");
	const userId = await requireUserId(request);
	const redirectTo = safeRedirect(data.get("redirectTo"), "/");

	console.log(redirectTo);


	if (answer === null || answer?.length === undefined || answer?.length === 0) {
		return null;
	}
	if (!questionId) {
		return null;
	}

	console.log(`User (${userId}) answered question (${questionId}): ${answer}`);
	const user = await getUserById(userId);

	if (!user) {
		return null;
	}

	const res = await answerQuestion({
		questionId,
		answer: answer.toString(),
		user
	});

	console.log("Answered question", res);

	return redirect(redirectTo);
}


export default function QuestionContainer() {
	const actionData = useActionData<typeof action>();
	const { question } = useLoaderData();
	// const { state } = useParentData<FormState>();
	const Component = mapQuestionToComponent(question);
	useEffect(() => {
		return () => {
			return;
		};
	}, [actionData]);

	return <Component question={ question } />;

}

function mapQuestionToComponent(question: any) {
	// switch (question.type) {
	// 	case "short-text":
	// 		return ShortTextAnswer;
	// 	case "multiple-choice":
	// 		return MultipleChoiceAnswer;
	// 	default:
	// 		return ShortTextAnswer;
	// }
	if (question.choices) {
		return MultipleChoiceAnswer;
	}
	return ShortTextAnswer;
}