import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import { FileData, LogEvent, ProgressEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { DownloadProgressEvent } from "@ffmpeg/util/dist/esm/types";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

type TLoadStatusKeys = "core" | "wasm";
type TLoadStatus = Record<TLoadStatusKeys, { received: number; total: number; finished: boolean }>;
type TEncodeFunc = (
	command: string[],
	inputFiles: File[],
	inputFileNames: string[],
	outputFileNames: string[],
) => Promise<void>;

export enum JobStatus {
	Starting = "starting",
	InProgressReadingFiles = "in-progress-reading-files",
	InProgressTranscoding = "in-progress-transcoding",
	Finished = "finished",
	Failed = "failed",
	Canceled = "canceled",
}

export type TEncoderJob = {
	id: string;
	command: string[];
	timeTranscodingStarted?: number;
	progress: number;
	progressStats: {
		time: number;
		frames?: number;
		fps?: number;
		size: number; // In bytes
		bitrate?: number; // In bits per second
		framerate?: number;
		dup: number;
		drop: number;
	};
	endStats: {
		videoSize: number;
		audioSize: number;
		subtitlesSize: number;
		otherSize: number;
		headersSize: number;
		muxingAmount: number;
	};
	status: JobStatus;
	outputFileNames: string[];
};

type TEncoderView = {
	inited: boolean;
	initProgress: number;
	canEncode: boolean;
	isEncoding: boolean;
	encode: TEncodeFunc;
	job: TEncoderJob | null;
	getOutputFileData: (filename: string) => Promise<FileData>;
};

export const useEncoder = (): TEncoderView => {
	// These totals are pre-set because we don't get the total data
	const [loadStatus, setLoadStatus] = useState<TLoadStatus>({
		core: {
			received: 0,
			total: 109870,
			finished: false,
		},
		wasm: {
			received: 0,
			total: 31598677,
			finished: false,
		},
	});

	const [job, setJob] = useState<TEncoderJob | null>(null);

	const handleLogLine = useCallback((message: string) => {
		setJob((job): TEncoderJob | null => {
			if (job?.status === JobStatus.InProgressTranscoding) {
				// If a progress update, update progressStats
				// Examples during (video):
				//   frame=    1 fps=0.0 q=-1.0 size=       0kB time=-00:00:00.06 bitrate=N/A speed=N/A
				//   frame=  871 fps=8.1 q=24.0 size=     256kB time=00:00:26.90 bitrate=  78.0kbits/s speed=0.251x
				//   frame=  872 fps=0.0 q=-1.0 Lsize=    3848kB time=00:00:28.96 bitrate=1088.2kbits/s speed=2.72e+03x
				//   frame=   46 fps= 43 q=0.0 size=       0kB time=00:00:00.00 bitrate=N/A dup=18 drop=0 speed=   0x
				//   frame=93500 fps= 25 q=-1.0 size= 1673216kB time=01:03:40.35 bitrate=3589.1kbits/s throttle=off speed=1.01x
				// Examples during (audio):
				//   size=     848kB time=00:03:36.94 bitrate=  32.0kbits/s speed=43.6x
				const isStatsRow = Boolean(message.match(/^(frame=|size=)/));
				if (isStatsRow) {
					const frames = parseInt(message.match(/frame= *(\d+)(?: |$)/)?.[1] ?? "");
					const fps = parseFloat(message.match(/fps=(.*?)(?: |$)/)?.[1] ?? "");
					const targetFPS = parseFloat(message.match(/q=(.*?)(?: |$)/)?.[1] ?? "");
					const sizeKB = parseFloat(message.match(/size=(.*?)kB/)?.[1] ?? "");
					// const time = message.match(/time=(.*?)(?: |$)/)?.[1] ?? null; // Unused
					const bitrateKBPS = parseFloat(message.match(/bitrate=(.*?)kbits\/s/)?.[1] ?? "");
					const dup = parseInt(message.match(/dup= *(\d+)(?: |$)/)?.[1] ?? "");
					const drop = parseInt(message.match(/drop= *(\d+)(?: |$)/)?.[1] ?? "");
					// const speed = parseFloat(message.match(/speed=(.*?)x(?: |$)/)?.[1] ?? ""); // Unused
					// const throttle = message.match(/throttle=(.*?)(?: |$)/)?.[1] ?? null; // Unused
					return {
						...job,
						progressStats: {
							...job.progressStats,
							frames: isNaN(frames) ? undefined : frames,
							size: isNaN(sizeKB) ? 0 : sizeKB * 1000,
							fps: isNaN(fps) ? undefined : fps,
							bitrate: isNaN(bitrateKBPS) ? undefined : bitrateKBPS * 1000,
							framerate: isNaN(targetFPS) ? undefined : targetFPS,
							dup: isNaN(dup) ? 0 : dup,
							drop: isNaN(drop) ? 0 : drop,
						},
					};
				}

				// If it's an end of encoding update, update endStats
				// Examples at the end (video or audio):
				//   video:541kB audio:0kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 1.633965%
				//   video:3837kB audio:0kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.280976%
				//   video:0kB audio:984kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.096913%
				const isEndStatsRow = Boolean(message.match(/^(video:)/));
				if (isEndStatsRow) {
					const videoKB = parseInt(message.match(/video:(\d+?)kB/)?.[1] ?? "");
					const audioKB = parseInt(message.match(/audio:(\d+?)kB/)?.[1] ?? "");
					const subtitlesKB = parseInt(message.match(/subtitle:(\d+?)kB/)?.[1] ?? "");
					const otherKB = parseInt(message.match(/other streams:(\d+?)kB/)?.[1] ?? "");
					const headersKB = parseInt(message.match(/global headers:(\d+?)kB/)?.[1] ?? "");
					const muxingPercent = parseFloat(message.match(/muxing overhead: *(.+?)%/)?.[1] ?? "");
					return {
						...job,
						endStats: {
							...job.endStats,
							videoSize: isNaN(videoKB) ? 0 : videoKB * 1000,
							audioSize: isNaN(audioKB) ? 0 : audioKB * 1000,
							subtitlesSize: isNaN(subtitlesKB) ? 0 : subtitlesKB * 1000,
							otherSize: isNaN(otherKB) ? 0 : otherKB * 1000,
							headersSize: isNaN(headersKB) ? 0 : headersKB * 1000,
							muxingAmount: isNaN(muxingPercent) ? 0 : muxingPercent / 100,
						},
					};
				}
			}
			return job;
		});
	}, []);

	const handleEncodingProgress = useCallback((progress: number, time: number) => {
		setJob((job) => {
			if (!job) {
				console.error(`Received progress @ ${progress} with no job in progress!`);
				return null;
			} else {
				return {
					...job,
					progress,
					progressStats: {
						...job.progressStats,
						time,
					},
				};
			}
		});
	}, []);

	const ffmpeg = useMemo(() => {
		const ffmpeg = new FFmpeg();
		ffmpeg.on("log", ({ message, type }: LogEvent): void => {
			console.info(`[FFMPEG][${type}] ${message}`);
			handleLogLine(message);
		});
		ffmpeg.on("progress", ({ progress, time }: ProgressEvent): void => {
			// Time is microseconds of the processed file
			handleEncodingProgress(progress, time / 1000 / 1000);
		});
		return ffmpeg;
	}, []);

	const handleJobReadingFilesStart = useCallback(() => {
		setJob((job) => {
			if (!job) {
				console.error(`Received job reading files start with no job in progress!`);
				return null;
			} else {
				return {
					...job,
					status: JobStatus.InProgressReadingFiles,
				};
			}
		});
	}, []);

	const handleJobTranscodingStart = useCallback(() => {
		setJob((job) => {
			if (!job) {
				console.error(`Received job transcoding start with no job in progress!`);
				return null;
			} else {
				return {
					...job,
					timeTranscodingStarted: performance.now() / 1000,
					status: JobStatus.InProgressTranscoding,
				};
			}
		});
	}, []);

	const handleJobFinish = useCallback((success: boolean) => {
		setJob((job) => {
			if (!job) {
				console.error(`Received success @ ${success} with no job in progress!`);
				return null;
			} else {
				// TODO: also set final stats
				return {
					...job,
					progress: 1.0,
					status: success ? JobStatus.Finished : JobStatus.Failed,
				};
			}
		});
	}, []);

	const getOutputFileData = useCallback(
		async (filename: string) => {
			const data = await ffmpeg.readFile(filename);
			return data;
		},
		[ffmpeg],
	);

	const handleInitLoadStatus = useCallback((key: TLoadStatusKeys, received: number, finished: boolean) => {
		setLoadStatus((ls) => {
			if (finished && ls[key].total !== received) {
				console.warn(
					`Warning: total size for key "${key}" is incorrect (expected ${ls[key].total}, received ${received})`,
				);
			}

			return {
				...ls,
				[key]: {
					...ls[key],
					received,
					finished,
				},
			};
		});
	}, []);

	const handleQueueEncode = useCallback(
		async (command: string[], inputFiles: File[], inputFileNames: string[], outputFileNames: string[]) => {
			const newJob: TEncoderJob = {
				id: Date.now().toString(16),
				command,
				progress: 0,
				timeTranscodingStarted: undefined,
				progressStats: {
					time: 0,
					frames: undefined,
					fps: undefined,
					size: 0,
					bitrate: undefined,
					framerate: undefined,
					dup: 0,
					drop: 0,
				},
				endStats: {
					videoSize: 0,
					audioSize: 0,
					subtitlesSize: 0,
					otherSize: 0,
					headersSize: 0,
					muxingAmount: 0,
				},
				status: JobStatus.Starting,
				outputFileNames,
			};

			setJob(newJob);

			startEncode(
				ffmpeg,
				newJob.id,
				command,
				inputFiles,
				inputFileNames,
				outputFileNames,
				handleJobReadingFilesStart,
				handleJobTranscodingStart,
				handleJobFinish,
			);
		},
		[ffmpeg, handleJobFinish],
	);

	useEffect(() => {
		console.info("Initializing FFmpeg");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";

		// The default for naming is https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.wasm`,
		// but we use it so we can listen to updates
		(async () => {
			await ffmpeg.load({
				coreURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.js`,
					"text/javascript",
					true,
					(progress: DownloadProgressEvent) => {
						handleInitLoadStatus("core", progress.received, progress.done);
					},
				),
				wasmURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.wasm`,
					"application/wasm",
					true,
					(progress: DownloadProgressEvent) => {
						handleInitLoadStatus("wasm", progress.received, progress.done);
					},
				),
			});
		})();

		return () => {
			console.info("Terminating FFmpeg");
			ffmpeg.terminate();
		};
	}, [ffmpeg]);

	const result = useMemo<TEncoderView>(() => {
		const loaded = Object.values(loadStatus).reduce((acc, o) => o.received + acc, 0);
		const expected = Object.values(loadStatus).reduce((acc, o) => o.total + acc, 0);
		return {
			initProgress: loaded / expected,
			inited: Object.values(loadStatus).every((o) => o.finished),
			isEncoding: [JobStatus.InProgressReadingFiles, JobStatus.InProgressTranscoding, JobStatus.Starting].includes(
				job?.status ?? JobStatus.Finished,
			),
			canEncode:
				!job ||
				job.status === JobStatus.Canceled ||
				job.status === JobStatus.Finished ||
				job.status === JobStatus.Failed,
			job,
			encode: handleQueueEncode,
			getOutputFileData,
		};
	}, [getOutputFileData, handleQueueEncode, job, loadStatus]);

	return result;
};

const startEncode = async (
	ffmpeg: FFmpeg,
	id: string,
	command: string[],
	inputFiles: File[],
	inputFileNames: string[],
	outputFileNames: string[],
	onReadingFilesStart: () => void,
	onTranscodingStart: () => void,
	onFinish: (success: boolean) => void,
): Promise<void> => {
	// Actually start transcoding

	onReadingFilesStart();

	// Write all files
	// https://ffmpegwasm.netlify.app/docs/api/util/#fetchfile
	// TODO: show progress?
	for (let i = 0; i < inputFileNames.length; i++) {
		await ffmpeg.writeFile(inputFileNames[i], await fetchFile(inputFiles[i]));
	}

	onTranscodingStart();

	console.info(`[FFMPEG] Executing commands:`, command);
	const result = await ffmpeg.exec(command);

	onFinish(result === 0);
};
