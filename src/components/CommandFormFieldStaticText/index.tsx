import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	text: string;
}

export const CommandFormFieldStaticText = ({ text }: IProps): JSX.Element => {
	return <div className={cx([s.container])}>{text}</div>;
};
