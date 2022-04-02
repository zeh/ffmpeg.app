import { useEffect, useState } from "preact/hooks";
import cx from "classnames";

import Commands from "../../utils/commands/Commands";

import s from "./styles.module.css";

export interface ICommand {
	label: string;
	value: string;
}

export interface IProps {
	searchTerms?: string;
	selectedIndex?: number;
}

export const CommandList = ({ searchTerms, selectedIndex }: IProps): JSX.Element | null => {
	const [items, setItems] = useState<Array<{ label: string; value: string }>>([]);

	if (!searchTerms) {
		return null;
	}

	useEffect(() => {
		const commands = Commands.getWithSearch(searchTerms);
		setItems(commands.map((c, index) => ({ label: c.name, value: index.toString() })));
	}, [searchTerms]);

	return (
		<div className={s.container}>
			{items.map((c, index) => (
				<div key={c.value} className={cx({ [s.entry]: true, [s.selected]: index === selectedIndex })}>
					{c.label}
				</div>
			))}
		</div>
	);
};
