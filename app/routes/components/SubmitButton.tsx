import type { ReactNode } from "react";

type SubmitButtonProps = {
	children: ReactNode,
	type?: 'submit' | 'reset' | 'button' | undefined;
};

export default function SubmitButton({ children, type }: SubmitButtonProps) {
	return (
		<button
			type={ type || "submit" }
			className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
		>
			{ children }
		</button>
	);
}