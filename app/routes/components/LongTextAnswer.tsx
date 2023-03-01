import type { Question } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function LongTextAnswer({ question }: { question: Question; }) {
	const { title, body } = question;
	const [answer, setAnswer] = useState("");
	return (
		<>
			<h1>{ title }</h1>
			<Form method="post">
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						{ body }
					</label>
					<textarea
						id="message"
						rows={ 5 }
						value={ answer }
						onChange={ (e) => setAnswer(e.target.value) }
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					>
					</textarea>
					<div>{ `${answer.length}/250` }</div>
				</div>
				<SubmitButton>Submit answer</SubmitButton>
			</Form>
		</>
	);

}