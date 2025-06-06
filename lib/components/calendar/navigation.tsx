export const Navigation = ({
	onClickNext,
	onClickPrev,
}: {
	onClickNext: () => void;
	onClickPrev: () => void;
}) => (
	<div>
		<SvgButton
			onClick={() => onClickPrev()}
			d="M7.66667 10.1663L3.5 5.99967L7.66667 1.83301"
		/>

		<SvgButton
			onClick={() => onClickNext()}
			d="M4.3335 1.83301L8.50016 5.99967L4.3335 10.1663"
		/>
	</div>
);

const SvgButton = ({ d, onClick }: { d: string; onClick: () => void }) => (
	<button onClick={onClick} className="p-1">
		<svg width="12" height="12" viewBox="0 0 12 12">
			<path
				d={d}
				stroke="#808080"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	</button>
);
