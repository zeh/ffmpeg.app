import cx from "classnames";

import { Tag } from "../Tag";

import s from "./styles.module.css";

interface IProps {
	className?: string;
	tags: string[];
}

export const TagList = ({ className, tags }: IProps): JSX.Element => {
	return (
		<div className={cx([className, s.container])}>
			{tags.map((l) => (
				<Tag label={l} />
			))}
		</div>
	);
};
