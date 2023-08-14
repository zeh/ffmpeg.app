/**
 * Format time in "DD days HH:MM:SS.mmmms" format.
 */
export const formatTimeDuration = (timeSeconds: number): string => {
	const mss = Math.round((timeSeconds % 1) * 1000);
	const secs = Math.floor(timeSeconds % 60);
	const mins = Math.floor(timeSeconds / 60) % 60;
	const hours = Math.floor(timeSeconds / 60 / 60) % 24;
	const days = Math.floor(timeSeconds / 60 / 60 / 24);

	let time = ("00" + secs).substr(-2) + (mss / 1000).toString(10).substring(1) + "s";

	if (mins > 0 || hours > 0 || days > 0) {
		time = ("00" + mins).substr(-2) + ":" + time;
	}
	if (hours > 0 || days > 0) {
		time = ("00" + hours).substr(-2) + ":" + time;
	}
	if (days > 0) {
		time = ("00" + days).substr(-2) + "days " + time;
	}

	time = time.replace(/^0+(\d)/, "$1");

	return time;
};

/**
 * Format time in "DDd HHh MMm SSs" format.
 */
export const formatTimeReadable = (timeSeconds: number): string => {
	const secs = Math.floor(timeSeconds % 60);
	const mins = Math.floor(timeSeconds / 60) % 60;
	const hours = Math.floor(timeSeconds / 60 / 60) % 24;
	const days = Math.floor(timeSeconds / 60 / 60 / 24);

	let time = `${secs}s`;

	if (mins > 0 || hours > 0 || days > 0) {
		time = `${mins}m ${time}`;
	}
	if (hours > 0 || days > 0) {
		time = `${hours}h ${time}`;
	}
	if (days > 0) {
		time = `${days}d ${time}`;
	}

	time = time.replace(/^0+(\d)/, "$1");

	return time;
};
