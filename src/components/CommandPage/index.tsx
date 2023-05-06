import { RouteComponentProps } from "wouter-preact";
import { useMemo } from "preact/hooks";

import Commands from "../../utils/commands/Commands";

import s from "./styles.module.css";

type IProps = RouteComponentProps<{ slug: string }>;

export const CommandPage = ({ params: { slug } }: IProps): JSX.Element => {
	const command = useMemo(() => {
		return Commands.getFromSlug(slug);
	}, [slug]);

	if (!command) {
		// TODO: Return error page, maybe with suggestions
		return (
			<div className={s.container}>
				<p className={s.title}>{"Error!"}</p>
			</div>
		);
	}

	return (
		<div className={s.container}>
			<p className={s.title}>{command.name}</p>
			<p className={s.description}>{command.description}</p>
			<p className={s.tags}>{command.tags}</p>
			<p className={s.command}>{command.command}</p>
		</div>
	);
};
