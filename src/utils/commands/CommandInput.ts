import { safeSplit } from "../StringUtils";

export enum CommandInputKind {
	InputFile = "input_file",
	OutputFile = "output_file",
	StaticText = "static_text",
}

interface ICommandInputFieldInputFile {
	kind: CommandInputKind.InputFile;
	title: string;
	types: string[];
}

interface ICommandInputFieldOutputFile {
	kind: CommandInputKind.OutputFile;
	title: string;
	extension: string;
}

interface ICommandInputFieldStaticText {
	kind: CommandInputKind.StaticText;
	text: string;
}

type ICommandInputField = ICommandInputFieldInputFile | ICommandInputFieldOutputFile | ICommandInputFieldStaticText;

const commandCache: Record<string, ICommandInputField[]> = {};

const getFromCommand = (command: string): ICommandInputField[] => {
	// Based on string segments, create fields (input, output, static text)
	if (commandCache[command]) {
		return commandCache[command];
	}

	const inputFields: ICommandInputField[] = [];
	const commandRegex = /\{\{\{(.*?)\}\}\}/;
	let toParse = command;
	let match = toParse.match(commandRegex);
	while (match) {
		const pos = match.index ?? 0;

		// Add text before
		if (pos > 0) {
			inputFields.push(createStaticTextCommandInputField(toParse.substring(0, pos)));
		}

		// Add input found
		inputFields.push(createSpecialCommandInputField(match[1]));

		toParse = toParse.substring(match[0].length + pos);
		match = toParse.match(commandRegex);
	}

	// Add remaining text, if needed
	if (toParse.length > 0) {
		inputFields.push(createStaticTextCommandInputField(toParse));
	}

	commandCache[command] = inputFields;

	return inputFields;
};

const getInputFilesFromCommand = (command: string): ICommandInputFieldInputFile[] => {
	return getFromCommand(command).filter(
		(ci) => ci.kind === CommandInputKind.InputFile,
	) as ICommandInputFieldInputFile[];
};

const getOutputFilesFromCommand = (command: string): ICommandInputFieldOutputFile[] => {
	return getFromCommand(command).filter(
		(ci) => ci.kind === CommandInputKind.OutputFile,
	) as ICommandInputFieldOutputFile[];
};

const createSpecialCommandInputField = (input: string): ICommandInputField => {
	const [inputType, inputParams] = safeSplit(input, ":", 1);
	console.assert(inputType && inputParams, `Could not parse input field parameters: "${input}"`);
	const inputParamObj: Record<string, string> = safeSplit(inputParams, ";").reduce((prev, curr) => {
		const [key, value] = safeSplit(curr, "=", 1);
		return {
			...prev,
			[key]: value,
		};
	}, {});

	switch (inputType) {
		case CommandInputKind.InputFile:
			return {
				kind: CommandInputKind.InputFile,
				title: unquote(inputParamObj.title ?? "Input"),
				types: (inputParamObj.types ?? "*").split(",").map((t) => t.trim()),
			};
		case CommandInputKind.OutputFile:
			return {
				kind: CommandInputKind.OutputFile,
				title: unquote(inputParamObj.title ?? "Output"),
				extension: inputParamObj.extension ?? ".bin",
			};
		default:
			throw new Error(`Command input [${input}] not parseable`);
	}
};

const createStaticTextCommandInputField = (text: string): ICommandInputFieldStaticText => {
	return {
		kind: CommandInputKind.StaticText,
		text: text,
	};
};

export default {
	getFromCommand,
	getInputFilesFromCommand,
	getOutputFilesFromCommand,
};
