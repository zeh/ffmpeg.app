import cx from "classnames";
import { useMemo } from "preact/hooks";

import CommandInput, { CommandInputKind } from "../../utils/commands/CommandInput";
import { CommandFormFieldStaticText } from "../CommandFormFieldStaticText";
import { CommandFormFieldInputFile } from "../CommandFormFieldInput";
import { CommandFormFieldOutputFile } from "../CommandFormFieldOutput";

import s from "./styles.module.css";

interface IProps {
	command: string;
}

export const CommandForm = ({ command }: IProps): JSX.Element => {
	const inputFields = useMemo(() => {
		return CommandInput.getFromCommand(command);
	}, [command]);

	return (
		<div className={cx([s.container])}>
			<CommandFormFieldStaticText text={"ffmpeg"} />
			{inputFields.map((f) => {
				switch (f.kind) {
					case CommandInputKind.StaticText:
						return <CommandFormFieldStaticText text={f.text} />;
					case CommandInputKind.InputFile:
						return <CommandFormFieldInputFile title={f.title} mask={f.mask} />;
					case CommandInputKind.OutputFile:
						return <CommandFormFieldOutputFile title={f.title} extension={f.extension} />;
				}
			})}
		</div>
	);
};
