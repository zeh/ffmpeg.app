import { CommandInput } from "../CommandInput";
import { Footer } from "../Footer";

import s from "./styles.module.css";

export const RootPage = (): JSX.Element => {
	return (
		<div className={s.container}>
			<p className={s.title}>What do you want to do with FFmpeg today?</p>
			<CommandInput></CommandInput>
			<Footer />
		</div>
	);
};
