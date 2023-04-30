import { useEffect, useRef, useState } from "preact/hooks";
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
}

export const CommandList = ({ searchTerms, selectedIndex }: IProps): JSX.Element | null => {
	const [items, setItems] = useState<ICommand[]>([]);
	const selectedIndexRef = useRef<HTMLDivElement>(null);

	if (!searchTerms) {
		return null;
	}

	useEffect(() => {
		const commands = Commands.getWithSearch(searchTerms);
		setItems(commands.map((c, index) => ({ label: c.name, value: index.toString(), tags: c.tags })));
	}, [searchTerms]);

	useEffect(() => {
		const scroll =
			(selectedIndexRef.current as unknown as { scrollIntoViewIfNeeded: Element["scrollIntoView"] | undefined })
				?.scrollIntoViewIfNeeded ?? selectedIndexRef.current?.scrollIntoView;
		scroll?.apply(selectedIndexRef.current);
	}, [selectedIndexRef.current]);

	return (
		<div className={s.container}>
			{items.map((c, index) => (
				<div
					ref={index === selectedIndex ? selectedIndexRef : undefined}
					key={c.value}
					className={cx({ [s.entry]: true, [s.selected]: index === selectedIndex })}
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
