import { useCallback, useRef, useState } from "preact/hooks";
import cx from "classnames";

import { Icons } from "../Icons";

import s from "./styles.module.css";

export const CommandInput = (): JSX.Element => {
	const [currentValue, setCurrentValue] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInput = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
		const newValue = (e.target as HTMLInputElement | undefined)?.value ?? "";
		setCurrentValue(newValue);
		// TODO: implement list using newValue
	}, []);

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
					value={currentValue}
					autoFocus
				/>
				<button className={cx(s.clear, clearVisible ? s.clearVisible : s.clearHidden)} onClick={handleClickClear}>
					<Icons.Close />
				</button>
			</form>
		</div>
	);
};
