import cx from "classnames";
import { useCallback } from "preact/hooks";

import CommandInput, { CommandInputKind } from "../../utils/commands/CommandInput";
import { CommandFormFieldStaticText } from "../CommandFormFieldStaticText";
import { CommandFormFieldInputFile } from "../CommandFormFieldInputFile";
import { CommandFormFieldOutputFile } from "../CommandFormFieldOutputFile";
import { CommandFormFieldSelector } from "../CommandFormFieldSelector";
import { IconButton } from "../IconButton";
import { Icons } from "../Icons";

import s from "./styles.module.css";

interface IProps {
	command: CommandInput;
	disabled?: boolean;
	onActionCopyToClipboard?: () => void;
	onActionReset?: () => void;
	onSetFile?: (index: number, file: File | null) => void;
	onSetSelectorValue?: (index: number, value: string | null) => void;
	outputFileNames?: Array<string | null>;
	selectorValues?: Array<string | null>;
	inputFiles?: Array<File | null>;
}

export const CommandForm = ({
	command,
	disabled,
	onActionCopyToClipboard,
	onActionReset,
	onSetFile,
	onSetSelectorValue,
	outputFileNames,
	selectorValues,
	inputFiles,
}: IProps): JSX.Element => {
	let numInputs = 0;
	let numOutputs = 0;
	let numSelectors = 0;

	const handleReset = useCallback(() => {
		onActionReset?.();
	}, [onActionReset]);

	const handleCopyToClipboard = useCallback(() => {
		onActionCopyToClipboard?.();
	}, [onActionCopyToClipboard]);

	return (
		<div className={cx([s.container, disabled ? s.disabledContainer : undefined])}>
			<div className={s.actionRow}>
				<IconButton
					onClick={handleCopyToClipboard}
					icon={Icons.CopyToClipboard}
					size={24}
					title={"Copy the command and its selections to the clipboard as a command line-ready string"}
				/>
				<IconButton
					onClick={handleReset}
					icon={Icons.Reset}
					size={24}
					title={"Reset the contents of the command input back to their default values"}
				/>
			</div>
			<div className={s.command}>
				<CommandFormFieldStaticText text={"ffmpeg"} />
				{command.getFields().map((f, ii) => {
					switch (f.kind) {
						case CommandInputKind.StaticText: {
							return <CommandFormFieldStaticText key={ii} text={f.text} />;
						}
						case CommandInputKind.InputFile: {
							const i = numInputs++;
							return (
								<CommandFormFieldInputFile
									key={`input_${i}`}
									title={f.title}
									types={f.types}
									value={inputFiles?.[i]}
									onSetFile={(file) => onSetFile?.(i, file)}
								/>
							);
						}
						case CommandInputKind.OutputFile: {
							const i = numOutputs++;
							return <CommandFormFieldOutputFile key={`output_${i}`} title={f.title} filename={outputFileNames?.[i]} />;
						}
						case CommandInputKind.Selector: {
							const i = numSelectors++;
							return (
								<CommandFormFieldSelector
									key={`selector_${i}`}
									value={selectorValues?.[i]}
									options={f.options}
									onSetValue={(value) => onSetSelectorValue?.(i, value)}
								/>
							);
						}
					}
				})}
			</div>
			{disabled ? <div className={s.disabledOverlay} /> : null}
		</div>
	);
};
