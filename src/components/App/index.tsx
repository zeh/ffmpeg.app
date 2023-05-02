import { Route } from "wouter";

import { RootPage } from "../RootPage";

import s from "./styles.module.css";

export const App = (): JSX.Element => {
	return (
		<div className={s.container}>
			<Route path="/" component={RootPage} />
		</div>
	);
};
