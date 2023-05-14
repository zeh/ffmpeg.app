import { ISearchIndexEntry, generateSearchIndexWords, searchForTermsInIndexes } from "../SearchUtils";
import { slugify } from "../StringUtils";
import commandsJSONFile from "./commands.json";

interface ICommandsJSONCommand {
	name: string;
	description?: string;
	command: string;
	keywords?: string[];
	tags?: string[];
}

interface ICommandsJSON {
	definitions: Record<string, string>;
	commands: ICommandsJSONCommand[];
}

export interface ICommand {
	slug: string;
	name: string;
	description?: string;
	command: string;
	keywords: string[];
	tags: string[];
	searchIndex: ISearchIndexEntry[];
}

let commands: ICommand[] | null = null;

const parseWithDefinitions = (text: string, definitions: ICommandsJSON["definitions"]): string => {
	return text.replaceAll(/\$\{(.*?)\}/g, (match, group1) =>
		parseWithDefinitions(definitions[group1] ?? `!!!${group1}!!!`, definitions),
	);
};

const maybeParseWithDefinitions = (
	text: string | undefined,
	definitions: ICommandsJSON["definitions"],
): string | undefined => {
	return text ? parseWithDefinitions(text, definitions) : text;
};

/**
 * Returns all of the existing commands, including their metadata.
 */
const getAll = (): ICommand[] => {
	if (commands === null) {
		const commandsJSON = commandsJSONFile as ICommandsJSON;
		const defs = commandsJSON.definitions;
		commands = commandsJSON.commands.map((commandJSON): ICommand => {
			const name = parseWithDefinitions(commandJSON.name, defs);

			const command = {
				slug: slugify(name),
				name,
				description: maybeParseWithDefinitions(commandJSON.description, defs),
				command: parseWithDefinitions(commandJSON.command, defs),
				keywords: commandJSON.keywords ?? [],
				tags: commandJSON.tags ?? [],
				searchIndex: [] as ISearchIndexEntry[],
			};

			command.searchIndex.push({
				score: 1,
				words: generateSearchIndexWords(command.name, command.keywords),
			});

			if (command.description) {
				command.searchIndex.push({
					score: 0.5,
					words: generateSearchIndexWords(command.description),
				});
			}

			return command;
		});
	}

	return commands as ICommand[];
};

/**
 * Based on a slug string, find and return the Command it refers to.
 */
const getFromSlug = (slug?: string): ICommand | null => {
	if (!slug) {
		return null;
	}

	return getAll().find((c) => c.slug === slug) ?? null;
};

/**
 * Based on a search string, returns a list of Commands.
 */
const getWithSearch = (search?: string): ICommand[] => {
	const commands = getAll();

	if (!search) {
		return commands;
	}

	// Based on the terms, generate a list of commands sorted by better fit
	const terms = generateSearchIndexWords(search);
	return commands
		.map((command) => {
			return {
				score: searchForTermsInIndexes(terms, command.searchIndex),
				command,
			};
		})
		.filter((entry) => entry.score > 0)
		.sort((a, b) => a.score - b.score)
		.map((entry) => entry.command);
};

export default {
	getAll,
	getFromSlug,
	getWithSearch,
};
