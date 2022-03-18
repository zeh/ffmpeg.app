import { Footer } from "../Footer";

import styles from "./styles.module.css";

export const App = (): JSX.Element => {
	return (
		<div className={styles.container}>
			<p>App</p>
			<Footer />
		</div>
	);
};
