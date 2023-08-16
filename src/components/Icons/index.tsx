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

// https://www.svgrepo.com/svg/489717/copy?edit=true
const CopyToClipboard = ({ size }: IProps): JSX.Element => {
	const wh = size ?? 16;
	const sw = (1.4 * 12) / wh;
	// Original viewbox was 0 0 24 24
	return (
		<svg width={wh} height={wh} viewBox="4 4 16 16">
			<path
				d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z"
				fill={"none"}
				stroke-width={sw}
				stroke={"currentColor"}
				stroke-linecap={"round"}
				stroke-linejoin={"round"}
			></path>
		</svg>
	);
};

// https://www.svgrepo.com/svg/343266/reset-forward?edit=true
const Reset = ({ size }: IProps): JSX.Element => {
	const wh = size ?? 16;
	const sw = (1.4 * 21) / wh;
	// Original viewbox was 0 0 21 21
	return (
		<svg width={wh} height={wh} viewBox="0 0 21 21">
			<g
				fill={"none"}
				stroke={"currentColor"}
				stroke-linecap={"round"}
				stroke-linejoin={"round"}
				stroke-width={sw}
				transform="translate(2 2)"
			>
				<path d="m4.5 1.5c-2.4138473 1.37729434-4 4.02194088-4 7 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{" "}
				<path d="m4.5 5.5v-4h-4"></path>
			</g>
		</svg>
	);
};

export const Icons = {
	Close,
	CopyToClipboard,
	Reset,
};
