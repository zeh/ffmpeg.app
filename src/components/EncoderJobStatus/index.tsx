import { useMemo } from "preact/hooks";

import { JobStatus, TEncoderJob } from "../../utils/ffmpeg/Encoder";
import { formatTimeDuration, formatTimeReadable } from "../../utils/FormatUtils";

import s from "./styles.module.css";

interface IProps {
	job: TEncoderJob;
}

export const EncoderJobStatus = ({ job }: IProps): JSX.Element => {
	const label = useMemo(() => {
		switch (job.status) {
			case JobStatus.Canceled: {
				return "CANCELED";
			}
			case JobStatus.Starting: {
				return "STARTING...";
			}
			case JobStatus.InProgressReadingFiles: {
				return "READING FILES...";
			}
			case JobStatus.InProgressTranscoding: {
				const percent = (Math.floor(job.progress * 1000) / 10).toFixed(1) + "%";
				return `ENCODING: ${percent} done`;
			}
			case JobStatus.Finished: {
				return "FINISHED";
			}
			case JobStatus.Failed: {
				return "FAILED";
			}
		}
	}, [job.progress, job.status]);

	const progressLabels = useMemo(() => {
		if (job.status === JobStatus.InProgressTranscoding || job.status === JobStatus.Finished) {
			return [
				// Frames (for video)
				job.progressStats.frames ? job.progressStats.frames.toString(10) + " frames" : undefined,
				// Time
				formatTimeDuration(job.progressStats.time),
				// Size
				Math.floor(job.progressStats.size / 1000) + " kB",
				// Bitrate
				(job.progressStats.bitrate ? job.progressStats.bitrate / 1000 : "?") + " kbps",
			].filter((s) => typeof s === "string");
		} else {
			return [];
		}
	}, [job.status, job.progressStats]);

	const mainLabels = useMemo(() => {
		if (job.status === JobStatus.InProgressTranscoding) {
			// Calculate time spent/remaining
			let timeStatus: string | null = null;

			const now = performance.now() / 1000;
			const timeSpent = now - (job.timeTranscodingStarted ?? NaN);
			if (!isNaN(timeSpent)) {
				// Add time spent
				timeStatus = `${formatTimeReadable(timeSpent)} spent`;

				// Add time remaining only of somewhat predictable
				job.progress;
				if (timeSpent > 3) {
					const timeTotal = timeSpent / job.progress;
					timeStatus += ` (${formatTimeReadable(timeTotal - timeSpent)} remaining)`;
				}
			}

			return [
				// Time spent/remaining
				timeStatus,
			].filter((s) => typeof s === "string");
		} else if (job.status === JobStatus.Finished) {
			return [
				// Video
				job.endStats.videoSize > 0 ? job.endStats.videoSize / 1000 + " kB video" : undefined,
				// Audio
				job.endStats.audioSize > 0 ? job.endStats.audioSize / 1000 + " kB audio" : undefined,
				// Subtitles
				job.endStats.subtitlesSize > 0 ? job.endStats.subtitlesSize / 1000 + " kB subtitles" : undefined,
				// Headers
				job.endStats.headersSize > 0 ? job.endStats.headersSize / 1000 + " kB headers" : undefined,
				// Other
				job.endStats.otherSize > 0 ? job.endStats.otherSize / 1000 + " kB other" : undefined,
			].filter((s) => typeof s === "string");
		} else {
			return [];
		}
	}, [job.status, job.endStats]);

	const progressStyle: JSX.CSSProperties = useMemo(() => {
		if (job.status === JobStatus.InProgressTranscoding) {
			return { right: (1 - job.progress) * 100 + "%" };
		} else {
			return { display: "none" };
		}
	}, [job.status, job.progress]);

	return (
		<div className={s.container}>
			<div className={s.box}>
				<div className={s.label}>
					{label}
					{mainLabels.map((l, i) => (
						<>
							<span className={s.showWhenTiny}>
								<br />
							</span>
							<span className={s.showWhenSmall}>{i % 2 === 1 ? <>{" ‧ "}</> : <br />}</span>
							<span className={s.showWhenMediumPlus}>{" ‧ "}</span>
							<span className={s.labelInfoEntry}>{l}</span>
						</>
					))}
				</div>
				<div className={s.labelInfo}>
					{progressLabels.map((l, i) => (
						<>
							<span className={s.showWhenTiny}>{i > 0 ? <br /> : null}</span>
							<span className={s.showWhenSmall}>{i > 0 ? i % 2 === 1 ? <>{" ‧ "}</> : <br /> : null}</span>
							<span className={s.showWhenMediumPlus}>{i > 0 ? <>{" ‧ "}</> : null}</span>
							<span className={s.labelInfoEntry}>{l}</span>
						</>
					))}
				</div>
				<div key={job.status} className={s.foregroundBar} style={progressStyle} />
			</div>
		</div>
	);
};
