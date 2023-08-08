import s from "./styles.module.css";

export const CommandFooter = (): JSX.Element => {
	return (
		<div className={s.container}>
			<span>
				{"Made with "}
				<a href={"https://ffmpeg.org"}>FFmpeg</a>
				{" via "}
				<a href={"https://ffmpegwasm.netlify.app"}>ffmpeg.wasm</a>
				{" • "}
				{"Get the "}
				<a href={"https://github.com/zeh/ffmpeg.app"}>Source</a>
			</span>
		</div>
	);
};
