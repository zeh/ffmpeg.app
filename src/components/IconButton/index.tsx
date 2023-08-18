import cx from "classnames";

import { Icons } from "../Icons";

import s from "./styles.module.css";

interface IProps {
	className?: string;
	icon?: (arg0: { size?: number }) => JSX.Element;
	size?: number;
	title?: string;
	onClick?: () => void;
}

export const IconButton = ({ className, icon, size, onClick, title }: IProps): JSX.Element => {
	const IconComponent = icon ?? Icons.Close;
	return (
		<button className={cx(s.container, className)} type={"button"} onClick={onClick} title={title}>
			<IconComponent size={size} />
		</button>
	);
};
