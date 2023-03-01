const Content = ({ width, children }: { width?: string, children: any; }) => {
	return (
		<div className="flex min-h-full flex-col mt-20">
			<div className="mx-auto w-full px-8 max-w-2xl">
				{ children }
			</div>
		</div>
	);
};

export default Content;