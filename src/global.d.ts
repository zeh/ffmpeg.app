import { ICommandDefinition } from "./types";

declare module "definitions.json" {
	const root: {
		macros: Record<string, string>;
		commands: ICommandDefinition[];
	};
	export = root;
}
