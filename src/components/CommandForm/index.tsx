import cx from "classnames";
import { useMemo } from "preact/hooks";

import CommandInput, { CommandInputKind } from "../../utils/commands/CommandInput";
import { CommandFormFieldStaticText } from "../CommandFormFieldStaticText";
import { CommandFormFieldInputFile } from "../CommandFormFieldInput";
import { CommandFormFieldOutputFile } from "../CommandFormFieldOutput";

import s from "./styles.module.css";

interface IProps {
	command: string;
	disabled?: boolean;
	onSetFile?: (index: number, file: File | null) => void;
	outputFileNames?: Array<string | null>;
}

export const CommandForm = ({ command, disabled, onSetFile, outputFileNames }: IProps): JSX.Element => {
	const inputFields = useMemo(() => {
		return CommandInput.getFromCommand(command);
	}, [command]);

	let numInputs = 0;
	let numOutputs = 0;

	return (
		<div className={cx([s.container, disabled ? s.disabledContainer : undefined])}>
			<CommandFormFieldStaticText text={"ffmpeg"} />
			{inputFields.map((f) => {
				switch (f.kind) {
					case CommandInputKind.StaticText: {
						return <CommandFormFieldStaticText text={f.text} />;
					}
					case CommandInputKind.InputFile: {
						const i = numInputs++;
						return (
							<CommandFormFieldInputFile title={f.title} types={f.types} onSetFile={(file) => onSetFile?.(i, file)} />
						);
					}
					case CommandInputKind.OutputFile: {
						const i = numOutputs++;
						return <CommandFormFieldOutputFile title={f.title} filename={outputFileNames?.[i]} />;
					}
				}
			})}
			{disabled ? <div className={s.disabledOverlay} /> : null}
		</div>
	);
};
