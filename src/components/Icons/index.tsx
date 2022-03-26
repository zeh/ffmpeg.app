const Close = (): JSX.Element => {
	return (
		<svg width={16} height={16}>
			<line x1={1} y1={15} x2={15} y2={1} stroke={"currentColor"} stroke-width={1.4} />
			<line x1={1} y1={1} x2={15} y2={15} stroke={"currentColor"} stroke-width={1.4} />
		</svg>
	);
};

export const Icons = {
	Close,
};
