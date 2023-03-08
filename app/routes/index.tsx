import type { Form as FormModel } from "@prisma/client";
import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Navbar } from "flowbite-react";
import { psqlGetFormsIds } from "~/models/question.server";
import { getUser } from "~/session.server";
import MyAlert from "./components/Alert";
import Content from "./components/Content";

export async function loader({ request, params }: LoaderArgs) {
	let user = await getUser(request);
	if (!user) return redirect("/login");

	let forms = await psqlGetFormsIds();

	const alert = {
		title: `Thank you ${user.email} :)`,
		message: "Tank you for your submission. Our team will appriciates your contribution.",
		variant: "info",
	};

	return json({ user, forms, alert: undefined });
}

export default function IndexPage() {
	const { forms, alert } = useLoaderData();
	return (
		<>
			<Content>
				<h1 className="text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Form</span> - Data collection for XAI project</h1>
				<FormsList forms={ forms } />
			</Content>
			<MyAlert variant="info" { ...alert } />
			<SiteFooter />
		</>
	);
}

interface FormsListProps {
	id: FormModel["id"];
	title: FormModel["title"];
}

function FormsList({ forms }: { forms: FormsListProps[]; }) {
	return (
		<ul className="flex-col-reverse flex items-center mt-20 mx-auto max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
			{ forms.map((form: FormsListProps) => {
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
	);
}

function SiteHeader() {
	return (
		<Navbar
			fluid={ true }
			rounded={ true }
		>
			<Navbar.Brand
				as={ "a" }
				to="/navbars"
			>
				<img
					src="https://flowbite.com/docs/images/logo.svg"
					className="mr-3 h-6 sm:h-9"
					alt="Flowbite Logo"
				/>
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					Flowbite
				</span>
			</Navbar.Brand>
			<Navbar.Collapse>
				<Navbar.Link
					href="/navbars"
					active={ true }
				>
					Home
				</Navbar.Link>
				<Navbar.Link
					as={ "a" }
					to="/navbars"
				>
					About
				</Navbar.Link>
				<Navbar.Link href="/navbars">
					Services
				</Navbar.Link>
				<Navbar.Link href="/navbars">
					Pricing
				</Navbar.Link>
				<Navbar.Link href="/navbars">
					Contact
				</Navbar.Link>
			</Navbar.Collapse>
			<Navbar.Toggle />
		</Navbar>
	);
}

function SiteFooter() {
	return (
		<footer className="mt-auto bg-white dark:bg-gray-900">
		</footer>
	);
}