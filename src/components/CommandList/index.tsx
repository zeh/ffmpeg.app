import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";
import cx from "classnames";

import Commands from "../../utils/commands/Commands";

import s from "./styles.module.css";

interface ICommand {
	label: string;
	value: string;
	tags: string[];
}

export interface IProps {
	searchTerms?: string;
	selectedIndex?: number;
	setSelectedIndex?: (index: number) => void;
	submit?: (index: number) => void;
}

export const CommandList = ({ searchTerms, selectedIndex, setSelectedIndex, submit }: IProps): JSX.Element | null => {
	const selectedIndexRef = useRef<HTMLDivElement>(null);

	if (!searchTerms) {
		return null;
	}

	const items: ICommand[] = useMemo(() => {
		const commands = Commands.getWithSearch(searchTerms);
		return commands.map((c, index) => ({ label: c.name, value: index.toString(), tags: c.tags }));
	}, [searchTerms]);

	const selectedIndexClean = useMemo(() => {
		if (selectedIndex === undefined) {
			return undefined;
		} else {
			return Math.min(selectedIndex, items.length - 1);
		}
	}, [items, selectedIndex]);

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

	const handleSubmit = useCallback((index: number) => {
		submit?.(index);
	}, []);

	return (
		<div className={s.container}>
			{items.map((c, index) => (
				<div
					ref={index === selectedIndexClean ? selectedIndexRef : undefined}
					key={c.value}
					className={cx({ [s.entry]: true, [s.selected]: index === selectedIndexClean })}
					onClick={() => {
						handleSubmit(index);
					}}
				>
					<div className={cx([s.label])}>{c.label}</div>
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
