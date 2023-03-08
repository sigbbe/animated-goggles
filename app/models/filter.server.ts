import type { Question } from "@prisma/client";
import { QuestionType } from "@prisma/client";
import { getTrack } from "./spotify.server";

type QuestionWithBody = Question & { body: any; };

function castBodyToAny(question: Question): QuestionWithBody {
	const body = question.body?.valueOf() as any;
	return { ...question, body };
}

export const EMPTY_PARSE = {
	body: null,
	question: null
};

type BaseQuestion = Omit<Question, "body"> & {
	question?: string,
};

interface Explenation {
	img?: string,
};

function parseExplation(question: ParseBaseQuestion): ParseQuestion {
	const img = question.body["img"];
	return { question, body: { img } };
}

function definedString(value: any | undefined): value is string {
	return value !== undefined && typeof value === "string";
}

type ParseBaseQuestion = BaseQuestion & { body: any; };

function parseBaseQuestion(data: Question): ParseBaseQuestion {
	const cast = castBodyToAny(data);
	const question = cast.body["question"];
	delete cast.body["question"];
	return { ...cast, question };
}

function parseShortText(data: ParseBaseQuestion) {
	const { body, ...rest } = data;
	return { question: rest, body };
}

interface NumberRange {
	min: number,
	max: number;
}

function parseNumberRange(data: ParseBaseQuestion) {
	const min: number = data.body?.min;
	const max: number = data.body?.max;
	delete data.body;
	return { question: data, body: { min, max } };
}

interface MultipleChoice {
	ordered: boolean,
	single: boolean,
	choices: string[],
}

// TODO: clean up MultipleChoice
function parseMultipleChoice(data: ParseBaseQuestion) {
	const ordered: boolean = data.body.ordered;
	const single: boolean = data.body.single;
	const choices: string[] = data.body.choices;
	delete data.body;
	return { question: data, body: { ordered, single, choices } };
}

interface Song {
	artists?: string[];
	name?: string;
	img_src?: string;
	src?: string;
}

interface SpotifyTrack {
	track_id: string;
}

async function parseSong(data: QuestionWithBody): Promise<{ question: BaseQuestion; body: Song; } | null> {
	const { name, artists, img_src, src, track_id } = data.body;
	delete data.body;
	if (definedString(track_id)) {
		const body = await getTrack({ track_id });
		if (body) {
			return { question: data, body };
		}
		return null;
	};
	return { question: data, body: { artists, name, img_src, src } };
}

type AnyQuestion = Explenation | NumberRange | MultipleChoice | Song | SpotifyTrack | Explenation;

export type ParseQuestion = {
	question: BaseQuestion,
	body: AnyQuestion;
};

export async function parseQuestion(question: Question): Promise<ParseQuestion | null> {
	const { body, type } = question;
	if (typeof body === "object") {
		switch (type) {
			case QuestionType.SHORT_TEXT:
				return parseShortText(parseBaseQuestion(question));
			case QuestionType.LONG_TEXT:
				return parseShortText(parseBaseQuestion(question));
			case QuestionType.EXPLENATION:
				return parseExplation(parseBaseQuestion(question));
			case QuestionType.NUMBER_RANGE:
				return parseNumberRange(parseBaseQuestion(question));
			case QuestionType.MULTIPLE_CHOICE:
				return parseMultipleChoice(parseBaseQuestion(question));
			case QuestionType.SONG:
				return await parseSong(castBodyToAny(question));
			case QuestionType.ORDERING:
				return null;
		}
	}
	return null;
};

export type { AnyQuestion, BaseQuestion, Explenation, MultipleChoice, NumberRange, Song, SpotifyTrack };

