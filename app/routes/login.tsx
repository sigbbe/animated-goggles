import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import Content from "./components/Content";
import SubmitButton from "./components/SubmitButton";

type ActionType = typeof action;

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const email = formData.get("email");
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
	const remember = formData.get("remember") || "off";

	if (!validateEmail(email)) {
		return json(
			{ errors: { email: "Email is invalid", password: null } },
			{ status: 400 }
		);
	}

	const user = await verifyLogin(email);
	if (!user) {
		return json(
			{ errors: { email: "Invalid email", password: null } },
			{ status: 400 }
		);
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: remember === "on" ? true : false,
		redirectTo,
	});
}

export const meta: MetaFunction = () => {
	return {
		title: "Login",
	};
};

export default function LoginPage() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/";
	const actionData = useActionData<ActionType>();
	const emailRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		}
	}, [actionData]);

	return (
		<Content>
			<Form method="post" className="space-y-6">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email address
					</label>
					<div className="mt-1">
						<input
							ref={ emailRef }
							id="email"
							required
							autoFocus={ true }
							name="email"
							type="email"
							autoComplete="email"
							aria-invalid={ actionData?.errors?.email ? true : undefined }
							aria-describedby="email-error"
							className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
						/>
						{ actionData?.errors?.email && (
							<div className="pt-1 text-red-700" id="email-error">
								{ actionData.errors.email }
							</div>
						) }
					</div>
				</div>

				<input type="hidden" name="redirectTo" value={ redirectTo } />
				<SubmitButton type="submit">Answer questions :)</SubmitButton>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember"
							name="remember"
							type="checkbox"
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label
							htmlFor="remember"
							className="ml-2 block text-sm text-gray-900"
						>
							Remember me
						</label>
					</div>
				</div>
			</Form>
		</Content>
	);
}
