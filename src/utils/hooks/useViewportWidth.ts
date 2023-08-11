import { useCallback, useEffect, useState } from "preact/hooks";

export const useWindowSize = (): { width: number; height: number } => {
	const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	const handleResize = useCallback(() => {
		setSize({ width: window.innerWidth, height: window.innerHeight });
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("reisze", handleResize);
		};
	}, []);

	return size;
};
