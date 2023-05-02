import { Route, Switch } from "wouter-preact";

import { CommandPage } from "../CommandPage";
import { RootPage } from "../RootPage";
import { getCommandRoute, getRootRoute } from "../../utils/RouteUtils";

import s from "./styles.module.css";

export const App = (): JSX.Element => {
	return (
		<div className={s.container}>
			<Switch>
				<Route path={getRootRoute()} component={RootPage} />
				<Route path={getCommandRoute()} component={CommandPage} />
			</Switch>
		</div>
	);
};
