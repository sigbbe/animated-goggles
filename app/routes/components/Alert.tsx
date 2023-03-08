import { Transition } from '@headlessui/react';
import { useEffect, useState } from "react";

interface MyAlertPropsI {
	variant: "inherit" | "action" | "disabled" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
	timeout?: number;
	title?: string;
	message?: string;
}

const MyAlert = ({ variant = "info", timeout = 10, title, message }: MyAlertPropsI) => {
	const shouldShow = () => (title !== undefined || !message == undefined);
	const [show, setShow] = useState(shouldShow());

	// On componentDidMount set the timer
	useEffect(() => {
		const timeId = setTimeout(() => {
			// After 3 seconds set the show value to false
			setShow(false);
		}, timeout * 1000);
		return () => {
			clearTimeout(timeId);
		};
	}, [timeout]);

	return (
		<Transition
			className={ "fixed bottom-5 left-1/2 transform -translate-x-1/2" }
			show={ show }
			// enter="bottom-10"
			// enterFrom="opacity-0"
			// enterTo="opacity-100"
			// leave="-bottom-1/2"
			// leaveFrom="opacity-100"
			// leaveTo="opacity-0"
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<InfoBox variant={ variant } title={ title } message={ message } />
		</Transition>
	);
};

function InfoBox({ variant, title, message }: Omit<MyAlertPropsI, "timeout">) {
	return (
		<div className="w-96 bg-teal-100 border-t-4 border-teal-500 rounded text-teal-900 px-4 py-3 shadow-md" role="alert">
			<div className="flex">
				<div className="py-1">
					{/* <InfoOutlined color={ variant } /> */ }
					<svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg>
				</div>
				<div>
					<p className="font-bold">{ title }</p>
					<p className="text-sm">{ message }</p>
				</div>
			</div>
		</div>
	);
}

export default MyAlert;
