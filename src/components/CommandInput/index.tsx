import { useCallback, useRef, useState } from "preact/hooks";
import cx from "classnames";

import { Icons } from "../Icons";
import { CommandList } from "../CommandList";

import s from "./styles.module.css";

export const CommandInput = (): JSX.Element => {
	const [currentValue, setCurrentValue] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [currentListIndex, setCurrentListIndex] = useState<number | undefined>(undefined);

	const handleInput = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
		const newValue = (e.target as HTMLInputElement | undefined)?.value ?? "";
		setCurrentValue(newValue);
		setCurrentListIndex(undefined);
	}, []);

	const handleInputKeyDown = useCallback(
		(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
			if (typeof currentListIndex === "number") {
				if (e.code === "ArrowUp") {
					if (currentListIndex > 0) {
						setCurrentListIndex(currentListIndex - 1);
					}
				} else if (e.code === "ArrowDown") {
					setCurrentListIndex(currentListIndex + 1);
					// TODO: clamp?
					// maybe forward events to the command list instead...
				}
			} else {
				if (e.code === "ArrowDown") {
					setCurrentListIndex(0);
				}
			}
		},
		[currentListIndex],
	);

	const handleFormSubmit = useCallback((e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: implement list/adding using currentValue
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
			<CommandList searchTerms={currentValue} selectedIndex={currentListIndex} />
		</div>
	);
};
