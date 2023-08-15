import { RouteComponentProps } from "wouter-preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { JobStatus, useEncoder } from "../../utils/ffmpeg/Encoder";

import Commands from "../../utils/commands/Commands";
import { CommandForm } from "../CommandForm";
import { TagList } from "../TagList";
import { Button } from "../Button";
import CommandInput from "../../utils/commands/CommandInput";
import { getExtensionForFile } from "../../utils/FileUtils";
import { EncoderJobStatus } from "../EncoderJobStatus";

import s from "./styles.module.css";
import { useQueryString } from "../../utils/hooks/useQueryString";

type IProps = RouteComponentProps<{ slug: string }>;

export const CommandPage = ({ params: { slug } }: IProps): JSX.Element => {
	const encoder = useEncoder();

	const command = useMemo(() => {
		return Commands.getFromSlug(slug);
	}, [slug]);

	const numInputFiles = useMemo(() => {
		return CommandInput.getInputFilesFromCommand(command?.command ?? "").length;
	}, [command]);

	const selectors = useMemo(() => {
		return CommandInput.getSelectorsFromCommand(command?.command ?? "");
	}, [command]);

	const selectorIds = useMemo(() => {
		return selectors.map((s) => s.slug);
	}, [selectors]);

	const [queryString, setQueryString] = useQueryString();

	const [inputFiles, setInputFiles] = useState<Array<File | null>>(Array.from(Array(numInputFiles)).map(() => null));
	const [selectorValues, setSelectorValues] = useState<Array<string | null>>(
		selectors.map((s, i) => queryString[selectorIds[i]] ?? s.defaultValue ?? null),
	);

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

	const handleSetSelectorValue = useCallback(
		(index: number, value: string | null) => {
			setSelectorValues((values: Array<string | null>) => {
				const nf = values.concat();
				nf[index] = value ?? null;
				return nf;
			});
			if (value !== null) {
				setQueryString((qq) => ({ ...qq, [selectorIds[index]]: value }));
			}
		},
		[setQueryString, selectorIds],
	);

	const hasAllInputFiles = useMemo(() => {
		return inputFiles.every((f) => f !== null);
	}, [inputFiles]);

	const hasAllSelectorValues = useMemo(() => {
		return selectorValues.every((v) => v !== null);
	}, [selectorValues]);

	const outputFileNames = useMemo(() => {
		const outputFiles = CommandInput.getOutputFilesFromCommand(command?.command ?? "");
		return outputFiles.map((of, i) => {
			let extension = of.extension;
			const match = extension.match(/input_file_(\d+)_extension/);
			if (match) {
				// Reuse extension from an input
				const inputIndex = parseInt(match[1], 10);
				const inputFile = inputFiles[inputIndex];
				if (!inputFile) {
					return null;
				} else {
					extension = getExtensionForFile(inputFile.type, inputFile.name);
				}
			}
			return outputFiles.length === 1 ? `output.${extension}` : `output_${i}.${extension}`;
		});
	}, [inputFiles]);

	const handleStart = useCallback(() => {
		if (command && hasAllInputFiles && hasAllSelectorValues) {
			encoder.encode(command.command, inputFiles as File[], outputFileNames as string[], selectorValues as string[]);
		}
	}, [command, inputFiles, selectorValues, hasAllInputFiles, hasAllSelectorValues, outputFileNames]);

	const handleSaveOutputFile = useCallback(async (filename: string) => {
		const data = await encoder.getOutputFileData(filename);
		const link = document.createElement("a");
		link.href = URL.createObjectURL(new Blob([(data as Uint8Array).buffer]));
		link.download = filename;
		link.click();
	}, []);

	const handleClose = useCallback(() => {
		location.href = "/";
	}, []);

	const canClickStart = encoder.inited && encoder.canEncode && hasAllInputFiles && hasAllSelectorValues;
	const canSave = encoder.job?.status === JobStatus.Finished;

	return (
		<div className={s.container}>
			<div className={s.box}>
				<p className={s.title}>{command.name}</p>
				<TagList className={s.tags} tags={command.tags} />
				<p className={s.hr} />
				<p className={s.description}>{command.description}</p>
				<button className={s.closeButton} onClick={handleClose}>
					<svg viewBox="0 0 40 40">
						<path class={s.lines} d="M 10,10 L 30,30 M 30,10 L 10,30" />
					</svg>
				</button>
				<CommandForm
					command={command.command}
					onSetFile={handleSetFile}
					onSetSelectorValue={handleSetSelectorValue}
					outputFileNames={outputFileNames}
					selectorValues={selectorValues}
					disabled={encoder.isEncoding}
				/>
				<div className={s.buttonRow}>
					<Button
						text={encoder.inited ? "Start" : "Initializing..."}
						onClick={handleStart}
						disabled={!canClickStart}
						progress={encoder.initProgress}
					/>
				</div>
				{encoder.job ? <EncoderJobStatus key={encoder.job.id} job={encoder.job} /> : null}
				{canSave ? (
					<div className={s.buttonRow}>
						{encoder.job?.outputFileNames.map((filename) => (
							<Button text={`Save ${filename}`} onClick={() => handleSaveOutputFile(filename)} />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
};
