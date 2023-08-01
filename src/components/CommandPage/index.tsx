import { RouteComponentProps } from "wouter-preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { useEncoder } from "../../utils/ffmpeg/Encoder";

import Commands from "../../utils/commands/Commands";
import { CommandForm } from "../CommandForm";
import { TagList } from "../TagList";
import { Button } from "../Button";
import CommandInput from "../../utils/commands/CommandInput";

import s from "./styles.module.css";

type IProps = RouteComponentProps<{ slug: string }>;

export const CommandPage = ({ params: { slug } }: IProps): JSX.Element => {
	const encoder = useEncoder();

	const command = useMemo(() => {
		return Commands.getFromSlug(slug);
	}, [slug]);

	const handleStart = useCallback(() => {
		// TODO: implement
		console.warn("Unimplemented: start encoding");
	}, []);

	const numInputFiles = useMemo(() => {
		return CommandInput.getInputFilesFromCommand(command?.command ?? "").length;
	}, [command]);

	const [inputFiles, setInputFiles] = useState<Array<File | null>>(Array.from(Array(numInputFiles)).map(() => null));

	if (!command) {
		// TODO: Return error page, maybe with suggestions
		return (
			<div className={s.container}>
				<p className={s.title}>{"Error!"}</p>
			</div>
		);
	}

	const handleSetFile = useCallback((index: number, file: File | null) => {
		setInputFiles((files: Array<File | null>) => {
			const nf = files.concat();
			nf[index] = file ?? null;
			return nf;
		});
	}, []);

	const hasAllInputFiles = useMemo(() => {
		return inputFiles.every((f) => f !== null);
	}, [inputFiles]);

	return (
		<div className={s.container}>
			<div className={s.box}>
				<p className={s.title}>{command.name}</p>
				<TagList className={s.tags} tags={command.tags} />
				<p className={s.hr} />
				<p className={s.description}>{command.description}</p>
				<CommandForm command={command.command} onSetFile={handleSetFile} />
				<div className={s.buttonRow}>
					<Button
						className={s.button}
						text={encoder.inited ? "Start" : "Initializing..."}
						onClick={handleStart}
						disabled={!encoder.inited || !hasAllInputFiles}
						progress={encoder.initProgress}
					/>
				</div>
			</div>
		</div>
	);
};
