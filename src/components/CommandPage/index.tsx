import { RouteComponentProps } from "wouter";

import s from "./styles.module.css";

type IProps = RouteComponentProps<{ slug: string }>;

export const CommandPage = ({ params }: IProps): JSX.Element => {
	return (
		<div className={s.container}>
			<p className={s.title}>{"Command: " + params.slug}</p>
		</div>
	);
};
