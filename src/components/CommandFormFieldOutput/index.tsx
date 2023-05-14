import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	title: string;
	extension: string;
}

export const CommandFormFieldOutputFile = ({ title, extension }: IProps): JSX.Element => {
	return <div className={cx([s.container])}>{title}</div>;
};
