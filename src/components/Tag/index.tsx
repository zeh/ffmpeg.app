import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	label: string;
}

export const Tag = ({ label }: IProps): JSX.Element => {
	return <div className={cx([s.container])}>{label}</div>;
};
