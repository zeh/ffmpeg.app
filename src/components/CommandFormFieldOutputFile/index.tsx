import cx from "classnames";

import s from "./styles.module.css";

interface IProps {
	title: string;
	filename?: string | null;
}

export const CommandFormFieldOutputFile = ({ title, filename }: IProps): JSX.Element => {
	const label = filename ?? title;

	const containerClasses = [s.container, filename ? undefined : s.errorState];

	return (
		<div className={cx(containerClasses)}>
			<div className={cx([s.label])}>{label}</div>
		</div>
	);
};
