import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import cx from "classnames";

import { Icons } from "../Icons";
import { CommandList } from "../CommandList";
import Commands, { ICommand } from "../../utils/commands/Commands";

import s from "./styles.module.css";

interface IProps {
	onSelectCommand?: (slug: string) => void;
}

export const CommandSearch = ({ onSelectCommand }: IProps): JSX.Element => {
	const [currentValue, setCurrentValue] = useState<string>("");
	const [currentListIndex, setCurrentListIndex] = useState<number | undefined>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);

	const searchResults: ICommand[] = useMemo(() => {
		return currentValue ? Commands.getWithSearch(currentValue) : [];
	}, [currentValue]);

	const handleListSubmit = useCallback(
		(index: number) => {
			onSelectCommand?.(searchResults[index].slug);
		},
		[onSelectCommand, searchResults],
	);

	const handleInputSubmit = useCallback(() => {
		if (currentListIndex !== undefined) {
			handleListSubmit(currentListIndex);
		}
	}, [currentListIndex, handleListSubmit]);

	const handleInput = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
		const newValue = (e.target as HTMLInputElement | undefined)?.value ?? "";
		setCurrentValue(newValue);
		setCurrentListIndex(undefined);
	}, []);

	const handleInputKeyDown = useCallback(
		(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (typeof currentListIndex === "number") {
				if (e.key === "ArrowUp") {
					if (currentListIndex > 0) {
						setCurrentListIndex(currentListIndex - 1);
					}
				} else if (e.key === "ArrowDown") {
					setCurrentListIndex(currentListIndex + 1);
				} else if (e.key === "Enter") {
					e.preventDefault();
					handleInputSubmit();
				}
			} else {
				if (e.key === "ArrowDown") {
					setCurrentListIndex(0);
				}
			}
		},
		[currentListIndex],
	);

	const handleFormSubmit = useCallback((e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleInputSubmit();
	}, []);

	const handleClickClear = useCallback((e: JSX.TargetedEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setCurrentValue("");
		inputRef.current?.focus();
	}, []);

	const clearVisible = currentValue.length > 0;

	return (
		<div className={s.container}>
			<form className={s.form} onSubmit={handleFormSubmit}>
				<input
					className={s.input}
					ref={inputRef}
					maxLength={300}
					placeholder={'Enter keywords or a command (for example, "Mute a video")'}
					type={"text"}
					autoComplete={"off"}
					autoCapitalize={"off"}
					autocorrect={"off"}
					onInput={handleInput}
					onKeyDown={handleInputKeyDown}
					value={currentValue}
					autoFocus
				/>
				<button className={cx(s.clear, clearVisible ? s.clearVisible : s.clearHidden)} onClick={handleClickClear}>
					<Icons.Close />
				</button>
			</form>
			<CommandList
				entries={searchResults}
				selectedIndex={currentListIndex}
				setSelectedIndex={setCurrentListIndex}
				submit={handleListSubmit}
			/>
		</div>
	);
};
