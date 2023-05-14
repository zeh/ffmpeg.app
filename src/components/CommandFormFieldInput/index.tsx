import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	title: string;
	mask: string[];
}

export const CommandFormFieldInputFile = ({ title, mask }: IProps): JSX.Element => {
	return <div className={cx([s.container])}>{title}</div>;
};
