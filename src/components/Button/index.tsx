import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	text: string;
	className?: string;
	onClick?: () => void;
}

export const Button = ({ className, onClick, text }: IProps): JSX.Element => {
	return (
		<button className={cx([className, s.container])} onClick={onClick}>
			{text}
		</button>
	);
};
