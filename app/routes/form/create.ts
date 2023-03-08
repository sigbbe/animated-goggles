import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { psqlCreateForm, psqlGetForms } from "~/models/question.server";

export async function loader() {
	return json(await psqlGetForms({}));
}

export async function action({ request }: ActionArgs) {
	const body = await request.json();
	return json(await psqlCreateForm(body));
}