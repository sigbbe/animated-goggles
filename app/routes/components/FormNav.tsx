// import { CheckOutlinedIcon, InfoOutlinedIcon } from '@mui/icons-material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { QuestionType } from '@prisma/client';
import { NavLink } from "@remix-run/react";

const getFormNavColorScheme = ({ isActive, hasAnswered }: { isActive: boolean, hasAnswered: boolean; }) => {
	if (isActive) {
		return 'border-blue-500 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white';
	} else if (hasAnswered) {
		return 'border-white text-blue-500 py-2 px-4 bg-blue-100';
	} else {
		return 'border-gray-200 hover:border-white text-blue-500 hover:bg-white bg-gray-200 py-2 px-4';
	}
};

function FormNav({ form, questions, currentQuestion }: { form: string, questions: { id: string, hasAnswered: boolean, title: string, type: QuestionType; }[], currentQuestion: string; }) {
	// TODO: add states for if the question has been answered/visitted/not visited
	const getContent = ({ hasAnswered, title, type }: any) => {
		if (type === QuestionType.EXPLENATION) {
			return InfoOutlinedIcon;
		} else if (type === QuestionType.SONG) {
			return MusicNoteRoundedIcon;
		} else if (hasAnswered) {
			return CheckOutlinedIcon;
		} else {
			return () => <span>{ title }</span>;
		}
	};

	return (
		<div className="sm:w-full pt-4 flex flex-row justify-center">
			{ questions.map((q: any, i) => {
				const { id, hasAnswered, title, type } = q;
				const isActive = id === currentQuestion;
				const Content = getContent({ hasAnswered, title, type });
				return (
					<NavLink
						to={ `/form/${form}/question/${id}` }
						key={ `${id}-${i}` }
						className={ `${!isActive ? "overflow-hidden text-ellipsis" : ""} whitespace-nowrap border-2 p-3 sm:mx-2 mx-0 text-center rounded ${getFormNavColorScheme({ isActive, hasAnswered })}` }>
						{ <Content /> }
					</NavLink>
				);
			}) }
		</div>
	);
}

export default FormNav;