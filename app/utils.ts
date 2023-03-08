import type { Form } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import fs from 'fs';
import { useEffect, useMemo, useRef } from "react";
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

export function __test__getQuestionsForForm({ formId, skip, take }: { formId: Form["id"], skip: number, take: number; }) {
	let rawdata = fs.readFileSync('/home/sigbjorn/Skole/eit/spootify-ai-app/mocks/mock.json', {
		encoding: 'utf-8'
	});
	return JSON.parse(rawdata);
}

export async function isImage({ href }: { href: string; }) {
	const response = await fetch(href, { method: 'HEAD' });
	const contentType = response.headers.get('content-type');
	return contentType?.startsWith('image/');
}

export function useFocusOnLoad<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	useEffect(() => {
		ref.current?.focus();
	}, []);
	return ref;
}

export function fancyTimeFormat(duration: number): string {
	// Hours, minutes and seconds
	const hrs = ~~(duration / 3600);
	const mins = ~~((duration % 3600) / 60);
	const secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	let ret = "";
	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}
	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}