import { useLocation } from "wouter";

import { useCallback } from "preact/hooks";
import { CommandInput } from "../CommandInput";
import { Footer } from "../Footer";
import { getCommandPath } from "../../utils/RouteUtils";

import s from "./styles.module.css";

export const RootPage = (): JSX.Element => {
	const [, setLocation] = useLocation();

	const handleSelectCommand = useCallback((slug: string) => {
		setLocation(getCommandPath(slug));
	}, []);

	return (
		<div className={s.container}>
			<p className={s.title}>What do you want to do with FFmpeg today?</p>
			<CommandInput onSelectCommand={handleSelectCommand} />
			<Footer />
		</div>
	);
};
