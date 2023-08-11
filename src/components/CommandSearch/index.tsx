import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import cx from "classnames";

import { Icons } from "../Icons";
import { CommandList } from "../CommandList";
import Commands, { ICommand } from "../../utils/commands/Commands";
import { useWindowSize } from "../../utils/hooks/useViewportWidth";

import s from "./styles.module.css";

interface IProps {
	onSelectCommand?: (slug: string) => void;
}

export const CommandSearch = ({ onSelectCommand }: IProps): JSX.Element => {
	const [currentValue, setCurrentValue] = useState<string>("");
	const [currentListIndex, setCurrentListIndex] = useState<number | undefined>(undefined);
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputHasFocus, setInputHasFocus] = useState(false);

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

	const handleInputFocus = useCallback(() => {
		setInputHasFocus(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		setInputHasFocus(false);
	}, []);

	const handleInputKeyDown = useCallback(
		(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (typeof currentListIndex === "number") {
				// Something selected in the list already
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
				// Nothing selected
				if (e.key === "ArrowDown") {
					setCurrentListIndex(0);
				} else if (e.key === "Enter") {
					e.preventDefault();
					// If there's only one visible result, assume that's the one desired
					if (searchResults.length === 1) {
						handleListSubmit(0);
					}
				}
			}
		},
		[currentListIndex, searchResults.length],
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

	const visiblySelectedListIndex = useMemo(() => {
		if (typeof currentListIndex === "undefined" && searchResults.length === 1) {
			return 0;
		} else {
			return currentListIndex;
		}
	}, [currentListIndex, searchResults.length]);

	const windowSize = useWindowSize();
	const useSmallPlaceholder = windowSize.width < 630;
	const placeholder = useSmallPlaceholder
		? "Enter keywords or a command"
		: 'Enter keywords or a command (for example, "Mute a video")';

	const clearVisible = currentValue.length > 0;

	return (
		<div className={cx([s.container, inputHasFocus ? s.focused : undefined])}>
			<form className={cx([s.form, inputHasFocus ? s.focused : undefined])} onSubmit={handleFormSubmit}>
				<input
					className={s.input}
					ref={inputRef}
					maxLength={300}
					placeholder={placeholder}
					type={"text"}
					autoComplete={"off"}
					autoCapitalize={"off"}
					autocorrect={"off"}
					onInput={handleInput}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					onKeyDown={handleInputKeyDown}
					value={currentValue}
					autoFocus
				/>
				<button className={cx(s.clear, clearVisible ? s.clearVisible : s.clearHidden)} onClick={handleClickClear}>
					<Icons.Close />
				</button>
			</form>
			<CommandList
				className={cx([s.list, inputHasFocus ? s.listFocused : undefined])}
				entries={searchResults}
				selectedIndex={visiblySelectedListIndex}
				setSelectedIndex={setCurrentListIndex}
				submit={handleListSubmit}
			/>
		</div>
	);
};
