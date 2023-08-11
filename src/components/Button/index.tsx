import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	text: string;
	disabled?: boolean;
	progress?: number;
	className?: string;
	onClick?: () => void;
}

export const Button = ({ className, disabled, onClick, progress, text }: IProps): JSX.Element => {
	const f = progress ?? 1;
	const enabled = !disabled;
	const progressStyle =
		progress === 1
			? { display: "none" }
			: {
					left: f * 100 + "%",
			  };
	return (
		<div className={cx([s.container, className, enabled ? undefined : s.disabledContainer])}>
			<button className={cx([s.button, enabled ? undefined : s.disabledButton])} disabled={!enabled} onClick={onClick}>
				<div className={s.backgroundProgress} style={progressStyle} />
				{text}
			</button>
		</div>
	);
};
