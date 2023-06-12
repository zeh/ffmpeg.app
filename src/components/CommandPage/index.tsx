import { RouteComponentProps } from "wouter-preact";
import { useCallback, useMemo } from "preact/hooks";

import Commands from "../../utils/commands/Commands";
import { CommandForm } from "../CommandForm";
import { TagList } from "../TagList";
import { Button } from "../Button";

import s from "./styles.module.css";

type IProps = RouteComponentProps<{ slug: string }>;

export const CommandPage = ({ params: { slug } }: IProps): JSX.Element => {
	const command = useMemo(() => {
		return Commands.getFromSlug(slug);
	}, [slug]);

	const handleStart = useCallback(() => {
		// TODO: implement
		console.warn("Unimplemented: start encoding");
	}, []);

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
			<div className={s.box}>
				<p className={s.title}>{command.name}</p>
				<TagList className={s.tags} tags={command.tags} />
				<p className={s.hr} />
				<p className={s.description}>{command.description}</p>
				<CommandForm command={command.command} />
				<div className={s.buttonRow}>
					<Button text={"Start"} onClick={handleStart}/>
				</div>
			</div>
		</div>
	);
};
