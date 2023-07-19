import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	title: string;
	types: string[];
}

export const CommandFormFieldInputFile = ({ title, types }: IProps): JSX.Element => {
	return <div className={cx([s.container])}>{title}</div>;
};
