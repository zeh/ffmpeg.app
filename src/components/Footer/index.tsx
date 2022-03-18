import s from "./styles.module.css";

export const Footer = (): JSX.Element => {
	return (
		<footer className={s.container}>
			<span>
				{"Made with 🤬 by "}
				<a href={"https://portfolio.zehfernando.com"}>Zeh Fernando</a>
				{" • "}
				<a href={"https://github.com/zeh/online-ffmpeg"}>Source code</a>
			</span>
		</footer>
	);
};
