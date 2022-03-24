import { Footer } from "../Footer";

import s from "./styles.module.css";

export const App = (): JSX.Element => {
	return (
		<div className={s.container}>
			<p className={s.title}>What do you want to do with FFmpeg today?</p>
			<Footer />
		</div>
	);
};
