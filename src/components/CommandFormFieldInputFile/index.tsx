import cx from "classnames";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { checkMimeTypeMatches, getFilesFromDataTransfer } from "../../utils/FileUtils";

import s from "./styles.module.css";

interface IProps {
	title: string;
	types: string[];
	value?: File | null;
	onSetFile?: (file: File | null) => void;
}

export const CommandFormFieldInputFile = ({ onSetFile, title, types, value }: IProps): JSX.Element => {
	const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);
	const [isDraggingValid, setIsDraggingValid] = useState(false);
	const [file, setFile] = useState<File | null>(value ?? null);
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log("!!! render :: ", file?.name, value?.name);
	}, [file, value]);

	const checkDataTransferValid = useCallback(
		(dataTransfer: DataTransfer | null): boolean => {
			const files = getFilesFromDataTransfer(dataTransfer);
			return files.length === 1 && checkMimeTypeMatches(files[0].type, types);
		},
		[types],
	);

	const handleClick = useCallback(() => {
		fileRef.current?.click();
	}, []);

	const handleFileInputChange = useCallback((e: Event) => {
		if (e.target && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
			setFile(e.target.files[0]);
		}
	}, []);

	useEffect(() => {
		onSetFile?.(file);
	}, [file]);

	useEffect(() => {
		setFile(value ?? null);
		if (!value && fileRef.current) {
			(fileRef.current as { value: string | null }).value = null;
		}
	}, [value]);

	const handleCoverDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();

			setIsDraggingOverWindow(false);
			if (checkDataTransferValid(e.dataTransfer)) {
				setFile(getFilesFromDataTransfer(e.dataTransfer)[0]);
			}
			// TODO: Maybe read with https://developer.mozilla.org/en-US/docs/Web/API/File
		},
		[checkDataTransferValid],
	);

	const handleCoverDragOver = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer) {
				setIsDraggingValid(false);
				return;
			}

			setIsDraggingValid(checkDataTransferValid(e.dataTransfer));
		},
		[checkDataTransferValid],
	);

	useEffect(() => {
		const handleWindowDragStart = (e: DragEvent): void => {
			e.preventDefault();
		};

		const handleWindowDragEnter = (e: DragEvent): void => {
			e.preventDefault();
			setIsDraggingOverWindow(true);
		};

		const handleWindowDragLeave = (e: DragEvent): void => {
			e.preventDefault();
			e.stopPropagation();

			// Detect only when it's actually leaving the window
			if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
				setIsDraggingOverWindow(false);
			}
		};

		const handleWindowMouseLeave = (e: MouseEvent): void => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOverWindow(false);
		};

		window.addEventListener("dragstart", handleWindowDragStart);
		window.addEventListener("dragenter", handleWindowDragEnter);
		window.addEventListener("dragleave", handleWindowDragLeave);

		// Only happens when there's no drag; last resort fallback when stuck in drag mode
		document.documentElement.addEventListener("mouseleave", handleWindowMouseLeave);

		return () => {
			window.removeEventListener("dragstart", handleWindowDragStart);
			window.removeEventListener("dragenter", handleWindowDragEnter);
			window.removeEventListener("dragleave", handleWindowDragLeave);
			document.documentElement.removeEventListener("mouseleave", handleWindowMouseLeave);
		};
	}, []);

	const label = file?.name ?? title;

	const containerClasses = [s.container, file ? undefined : s.errorState];

	const coverClasses = [
		s.windowCover,
		isDraggingOverWindow ? undefined : s.hidden,
		isDraggingValid ? s.dragAllowed : s.dragForbidden,
	];

	return (
		<div className={cx(containerClasses)} onClick={handleClick}>
			<input
				ref={fileRef}
				className={cx(s.fileInput)}
				type={"file"}
				accept={types.join(", ")}
				onChange={handleFileInputChange}
			/>
			<div className={cx([s.label])}>{label}</div>
			<div className={cx(coverClasses)} onDrop={handleCoverDrop} onDragOver={handleCoverDragOver}>
				<p className={s.windowCoverTitle}>{title}</p>
				<p className={s.windowCoverSubtitle}>Drop to place</p>
			</div>
		</div>
	);
};
