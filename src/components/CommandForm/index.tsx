import cx from "classnames";
import { useMemo } from "preact/hooks";

import CommandInput, { CommandInputKind } from "../../utils/commands/CommandInput";
import { CommandFormFieldStaticText } from "../CommandFormFieldStaticText";
import { CommandFormFieldInputFile } from "../CommandFormFieldInput";
import { CommandFormFieldOutputFile } from "../CommandFormFieldOutput";

import s from "./styles.module.css";

interface IProps {
	command: string;
	onSetFile?: (index: number, file: File | null) => void;
}

export const CommandForm = ({ command, onSetFile }: IProps): JSX.Element => {
	const inputFields = useMemo(() => {
		return CommandInput.getFromCommand(command);
	}, [command]);

	let numInputs = 0;

	return (
		<div className={cx([s.container])}>
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
						return <CommandFormFieldOutputFile title={f.title} extension={f.extension} />;
					}
				}
			})}
		</div>
	);
};
