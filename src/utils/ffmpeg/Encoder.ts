import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

import { LogEvent, ProgressEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { DownloadProgressEvent } from "@ffmpeg/util/dist/esm/types";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

type TLoadStatusKeys = "core" | "wasm";
type TLoadStatus = Record<TLoadStatusKeys, { received: number; total: number; finished: boolean }>;

type TEncoderView = {
	inited: boolean;
	initProgress: number;
};

export const useEncoder = (): TEncoderView => {
	// These totals are pre-set because we don't get the total data
	const [loadStatus, setLoadStatus] = useState<TLoadStatus>({
		core: {
			received: 0,
			total: 109488,
			finished: false,
		},
		wasm: {
			received: 0,
			total: 31598677,
			finished: false,
		},
	});

	const ffmpeg = useMemo(() => {
		const ffmpeg = new FFmpeg();
		ffmpeg.on("log", ({ message }: LogEvent): void => {
			console.info("!!! FFMPEG :: LOG ::", message);
		});
		ffmpeg.on("progress", ({ progress, time }: ProgressEvent): void => {
			console.info("!!! FFMPEG :: PROGRESS ::", progress, time);
		});
		return ffmpeg;
	}, []);

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

	useEffect(() => {
		console.info("Initializing FFmpeg");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.1/dist/esm";

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
		};
	}, [loadStatus]);

	return result;
};
