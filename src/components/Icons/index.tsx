interface IProps {
	size?: number;
}

const Close = ({ size }: IProps): JSX.Element => {
	const wh = size ?? 16;
	const margin = 1;
	const mwh = wh - margin;
	const sw = 1.4;
	return (
		<svg width={wh} height={wh}>
			<line x1={margin} y1={mwh} x2={mwh} y2={margin} stroke={"currentColor"} stroke-width={sw} />
			<line x1={margin} y1={margin} x2={mwh} y2={mwh} stroke={"currentColor"} stroke-width={sw} />
		</svg>
	);
};

export const Icons = {
	Close,
};
