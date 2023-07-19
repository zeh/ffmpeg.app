/**
 * Simple check for whether a mime type is matched in a list of allowed mime types.
 * This performs a simple check, so
 * - video/mp4 vs [video/mp4] => true
 * - video/mp4 vs [video/*] => true
 * - video/mpeg vs [video/mp4] => false
 */
export const checkMimeTypeMatches = (type: string, allowedTypes: string[]): boolean => {
	return allowedTypes.some((t) => t[0] === "*" || (t[0] == type[0] && (t[1] == type[1] || t[1] == "*")));
};

export const getFilesFromDataTransfer = (dataTransfer: DataTransfer | null): File[] => {
	const files: File[] = [];

	if (dataTransfer?.files) {
		// Use DataTransfer interface to access the file(s); Safari 11+
		for (let i = 0; i < dataTransfer.files.length; i++) {
			const file = dataTransfer.files[i];
			if (file) {
				files.push(file);
			}
		}
	} else if (dataTransfer?.items) {
		// Use DataTransferItemList interface to access the file(s); Safari 12+
		const files: File[] = [];
		for (let i = 0; i < dataTransfer.items.length; i++) {
			// If dropped items aren't files, reject them
			if (dataTransfer.items[i].kind === "file") {
				const file = dataTransfer.items[i].getAsFile();
				if (file) {
					files.push(file);
				}
			}
		}
	}

	return files;
};
