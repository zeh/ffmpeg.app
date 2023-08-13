import cx from "classnames";
import { useMemo } from "preact/hooks";

import { JobStatus, TEncoderJob } from "../../utils/ffmpeg/Encoder";

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

	const labelInfos = useMemo(() => {
		if (job.status === JobStatus.InProgressTranscoding || job.status === JobStatus.Finished) {
			return [
				// Frames (for video)
				job.progressStats.frames ? job.progressStats.frames.toString(10) + " frames" : undefined,
				// Time
				Math.floor(job.progressStats.time * 10) / 10 + " sec",
				// Size
				Math.floor(job.progressStats.size / 1000) + " kB",
				// Bitrate
				(job.progressStats.bitrate ? job.progressStats.bitrate / 1000 : "?") + " kbps",
			].filter((s) => typeof s === "string");
		} else {
			return [];
		}
	}, [job.status, job.progressStats]);

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
				<div className={s.label}>{label}</div>
				<div className={cx([s.labelInfo, s.showWhenTiny])}>
					{labelInfos.map((l, i) => (
						<>
							{i > 0 ? <br /> : null}
							<span className={s.labelInfoEntry}>{l}</span>
						</>
					))}
				</div>
				<div className={cx([s.labelInfo, s.showWhenSmall])}>
					{labelInfos.map((l, i) => (
						<>
							{i > 0 ? i % 2 === 1 ? <>{" ‧ "}</> : <br /> : null}
							<span className={s.labelInfoEntry}>{l}</span>
						</>
					))}
				</div>
				<div className={cx([s.labelInfo, s.showWhenMediumPlus])}>
					{labelInfos.map((l, i) => (
						<>
							{i > 0 ? <>{" ‧ "}</> : null}
							<span className={s.labelInfoEntry}>{l}</span>
						</>
					))}
				</div>
				<div key={job.status} className={s.foregroundBar} style={progressStyle} />
			</div>
		</div>
	);
};
