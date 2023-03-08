import type { ReactNode } from "react";

type SubmitButtonProps = {
	className?: string,
	children: ReactNode,
	type?: 'submit' | 'reset' | 'button' | undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SubmitButton({ type, children, ...rest }: SubmitButtonProps) {
	return (
		<button

			type={ type || "submit" }
			className={ `${rest.className} w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400` }>
			{ children }
		</button>
	);
}