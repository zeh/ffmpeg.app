import classes from "./index.module.css";

export const App = (): JSX.Element => {
	return (
		<div className={classes.container}>
			<p>App</p>
			<Footer></Footer>
		</div>
	);
};
