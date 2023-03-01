import type { Form } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import fs from 'fs';
import { useMemo } from "react";
import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = DEFAULT_REDIRECT
) {
	if (!to || typeof to !== "string") {
		return defaultRedirect;
	}

	if (!to.startsWith(DEFAULT_REDIRECT) || to.startsWith(`${DEFAULT_REDIRECT.repeat(2)}`)) {
		return defaultRedirect;
	}

	return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
	id: string
): Record<string, unknown> | undefined {
	const matchingRoutes = useMatches();
	const route = useMemo(
		() => matchingRoutes.find((route) => route.id === id),
		[matchingRoutes, id]
	);
	return route?.data;
}

function isUser(user: any): user is User {
	return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
	const data = useMatchesData("root");
	if (!data || !isUser(data.user)) {
		return undefined;
	}
	const { user } = data;
	return user;
}

export function useUser(): User {
	const maybeUser = useOptionalUser();
	if (!maybeUser) {
		throw new Error(
			"No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
		);
	}
	return maybeUser;
}

export function validateEmail(email: unknown): email is string {
	return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function serverLog(...args: unknown[]) {
	console.log(`[SERVER]`, ...args);
}
export function __test__getQuestionsForForm({ formId, skip, take }: { formId: Form["id"], skip: number, take: number; }) {
	let rawdata = fs.readFileSync('/home/sigbjorn/Skole/eit/spootify-ai-app/mocks/mock.json', {
		encoding: 'utf-8'
	});
	return JSON.parse(rawdata);
}

export function getQuestionComponent(questionKind: string) {
	return () => {
		// return <div>Question</div>;
		return null;
	};
}

export function mode<T>(array: Array<T>) {
	if (array.length == 0)
		return null;
	var modeMap = new Map<T, number>();
	var maxEl = array[0], maxCount = 1;
	for (var i = 0; i < array.length; i++) {
		var el = array[i];
		if (modeMap.get(el) == null)
			modeMap.set(el, 1);
		else
			modeMap.set(el, (modeMap.get(el) || 0) + 1);
		if (modeMap.get(el) || 0 > maxCount) {
			maxEl = el;
			maxCount = modeMap.get(el) || 0;
		}
	}
	return { maxEl, maxCount };
}