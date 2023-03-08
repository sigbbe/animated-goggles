import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { psqlAnswerQuestion, psqlGetOrCreateFormSubmission, psqlSetFormSubmissionCompleted } from "~/models/question.server";
import { getUserById } from "~/models/user.server";
import MapQuestionToComponent from "~/routes/components/MapQuestionToComponent";
import { requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";
import type { FormState } from "../$formId";
import { useParentData } from "../questionOutlet";

export async function action({ request, params }: ActionArgs) {
	const { formId, questionId } = params;
	const userId = await requireUserId(request);
	const user = await getUserById(userId);
	const data = await request.formData();
	const answer = data.get(questionId || "");
	const redirectTo = safeRedirect(data.get("redirectTo"), "/");
	const isLastQuestion = data.get("isLastQuestion") === "true";
	if (answer === null || answer?.length === undefined || answer?.length === 0) {
		return null;
	}
	if (!formId) {
		return null;
	}
	if (!questionId) {
		return null;
	}
	if (!user) {
		return null;
	}
	const { id: formSubmissionId } = await psqlGetOrCreateFormSubmission({ formId, userId: user.id });
	const ans = { questionId, body: answer.toString(), userId: user.id, formSubmissionId: formSubmissionId.toString(), trackId: null };
	await psqlAnswerQuestion({ answer: ans });
	if (isLastQuestion) {
		await psqlSetFormSubmissionCompleted({ formSubmissionId: formSubmissionId.toString() });
	}
	return redirect(redirectTo);
}

export default function QuestionContainer() {
	const { current, next } = useParentData<FormState>();
	if (!current) return null;
	return (
		<MapQuestionToComponent
			current={ current }
			next={ next }
		/>
	);
}