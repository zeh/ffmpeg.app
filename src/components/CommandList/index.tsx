import { useEffect, useMemo, useRef } from "preact/hooks";
import cx from "classnames";

import { ICommand } from "../../utils/commands/Commands";

import s from "./styles.module.css";

interface IProps {
	entries: ICommand[];
	selectedIndex?: number;
	setSelectedIndex?: (index: number) => void;
	submit?: (index: number) => void;
}

export const CommandList = ({ entries, selectedIndex, setSelectedIndex, submit }: IProps): JSX.Element | null => {
	const selectedIndexRef = useRef<HTMLDivElement>(null);

	if (entries.length === 0) {
		return null;
	}

	const selectedIndexClean = useMemo(() => {
		if (selectedIndex === undefined) {
			return undefined;
		} else {
			return Math.min(selectedIndex, entries.length - 1);
		}
	}, [entries.length, selectedIndex]);

	useEffect(() => {
		if (selectedIndexClean !== undefined && selectedIndex != selectedIndexClean) {
			setSelectedIndex?.(selectedIndexClean);
		}
	}, [selectedIndex, selectedIndexClean, setSelectedIndex]);

	useEffect(() => {
		const scroll =
			(selectedIndexRef.current as unknown as { scrollIntoViewIfNeeded: Element["scrollIntoView"] | undefined })
				?.scrollIntoViewIfNeeded ?? selectedIndexRef.current?.scrollIntoView;
		scroll?.apply(selectedIndexRef.current);
	}, [selectedIndexRef.current]);

	return (
		<div className={s.container}>
			{entries.map((c, index) => (
				<div
					ref={index === selectedIndexClean ? selectedIndexRef : undefined}
					key={c.slug}
					className={cx({ [s.entry]: true, [s.selected]: index === selectedIndexClean })}
					onClick={() => {
						submit?.(index);
					}}
				>
					<div className={cx([s.label])}>{c.name}</div>
					<div className={cx([s.tags])}>
						{c.tags.map((t) => (
							<div className={cx([s.tag])}>{t}</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
