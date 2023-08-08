import { useLocation } from "wouter-preact";

import { useCallback } from "preact/hooks";
import { CommandFooter } from "../CommandFooter";
import { CommandHeader } from "../CommandHeader";
import { CommandSearch } from "../CommandSearch";
import { getCommandPath } from "../../utils/RouteUtils";

import s from "./styles.module.css";

export const RootPage = (): JSX.Element => {
	const [, setLocation] = useLocation();

	const handleSelectCommand = useCallback((slug: string) => {
		setLocation(getCommandPath(slug));
	}, []);

	return (
		<div className={s.container}>
			<CommandHeader />
			<CommandSearch onSelectCommand={handleSelectCommand} />
			<CommandFooter />
		</div>
	);
};
