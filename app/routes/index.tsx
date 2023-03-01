import { Form, NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { getFormsIds } from "~/models/question.server";
import { getUser } from "~/session.server";
import Content from "./components/Content";

export async function loader({ request }: LoaderArgs) {
	let user = await getUser(request);
	if (!user) return redirect("/login");

	let forms = await getFormsIds();

	return json({ user, forms }, {});
}

export default function IndexPage() {
	const { forms } = useLoaderData();
	return (
		<Content>
			<h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Form</span> - Data collection for XAI project</h1>
			<Form method="post" action="/export">
				<button type="submit" className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 md:py-3 md:text-lg md:px-6">Download data</button>
			</Form>
			<ul className="flex justify-center justify-self-center mt-20 mx-auto max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
				{ forms.map((form: any) => {
					const { id, title } = form;
					return (
						<li
							className="flex items-center justify-between"
							key={ id }>
							<NavLink to={ `/form/${id}` } className="text-gray-900 dark:text-white">{ title }</NavLink>
						</li>
					);
				}) }
			</ul>
		</Content>
	);

}