import cx from "classnames";

import CommandInput, { CommandInputKind } from "../../utils/commands/CommandInput";
import { CommandFormFieldStaticText } from "../CommandFormFieldStaticText";
import { CommandFormFieldInputFile } from "../CommandFormFieldInputFile";
import { CommandFormFieldOutputFile } from "../CommandFormFieldOutputFile";
import { CommandFormFieldSelector } from "../CommandFormFieldSelector";

import s from "./styles.module.css";

interface IProps {
	command: CommandInput;
	disabled?: boolean;
	onSetFile?: (index: number, file: File | null) => void;
	onSetSelectorValue?: (index: number, value: string | null) => void;
	outputFileNames?: Array<string | null>;
	selectorValues?: Array<string | null>;
}

export const CommandForm = ({
	command,
	disabled,
	onSetFile,
	onSetSelectorValue,
	outputFileNames,
	selectorValues,
}: IProps): JSX.Element => {
	let numInputs = 0;
	let numOutputs = 0;
	let numSelectors = 0;

	return (
		<div className={cx([s.container, disabled ? s.disabledContainer : undefined])}>
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
			{disabled ? <div className={s.disabledOverlay} /> : null}
		</div>
	);
};
