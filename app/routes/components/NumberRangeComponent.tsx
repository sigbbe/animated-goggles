import { useState } from "react";
import type { NumberRange } from "~/models/filter.server";
import "~/styles/custom.css";
import type { FormCompoenentProps } from "./MapQuestionToComponent";
import QuestionForm from "./QuestionForm";

export default function NumberRangeComponent({ question, body, next }: FormCompoenentProps<NumberRange>) {
	const { min, max } = body;
	const { id } = question;
	const [value, setValue] = useState<number>((max - min) / 2);

	const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const val = parseInt(e.target.value);
		if (val > max) {
			setValue(max);
		} else if (val < min) {
			setValue(min);
		} else {
			setValue(val);
		}
	};

	const increment = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (value !== null && value < max) {
			setValue(value + 1);
		}
	};

	const decrement = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (value !== null && value > min) {
			setValue(value - 1);
		}
	};

	return (
		<QuestionForm
			question={ question }
			next={ next }>
			<SliderInput
				id={ id }
				min={ min }
				max={ max }
				value={ value }
				updateValue={ updateValue } />
			<NumberInput
				id={ id }
				update={ updateValue }
				value={ value }
				increment={ increment }
				decrement={ decrement } />
		</QuestionForm>
	);
}

interface SliderInputProps {
	id: string;
	min: number;
	max: number;
	value: number | null;
	updateValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SliderInput({ id, min, max, value, updateValue }: SliderInputProps) {
	return (
		<>
			<label
				htmlFor="steps-range"
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
			<input
				id="steps-range"
				type="range"
				name={ id }
				min={ min }
				max={ max }
				onChange={ updateValue }
				value={ value ?? (max - min) / 2 }
				step="1"
				className="mb-5 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
		</>
	);
}

interface NumberInputProps {
	id: string;
	value: number;
	increment: (e: React.MouseEvent<HTMLButtonElement>) => void;
	decrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
	update: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function NumberInput({ id, value, update, increment, decrement }: NumberInputProps) {
	return (
		<div className="m-auto flex justify-center w-32 mb-10">
			<div className="mx-auto justify-center flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
				<button
					onClick={ decrement }
					data-action="decrement"
					className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
					<span className="m-auto text-2xl font-thin">-</span>
				</button>
				<input
					onChange={ update }
					type="number"
					id="custom-input-number"
					className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700"
					name={ id }
					value={ value } />
				<button
					onClick={ increment }
					data-action="increment"
					className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
					<span className="m-auto text-2xl font-thin">+</span>
				</button>
			</div>
		</div>
	);
};;