import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";

import s from "./styles.module.css";

const SELECT_LABEL = "Select";

interface IProps {
	value?: string | null;
	options: Array<{ label?: string; value: string }>;
	onSetValue?: (value: string | null) => void;
}

export const CommandFormFieldSelector = ({ value, options, onSetValue }: IProps): JSX.Element => {
	const [isExpanded, setIsExpanded] = useState(false);
	const selectedIndexRef = useRef<HTMLDivElement>(null);

	const handleClickLabel = useCallback(() => {
		setIsExpanded(true);
	}, []);

	const handleClickEntry = useCallback(
		(e: MouseEvent, value: string) => {
			e.stopPropagation();
			onSetValue?.(value);
			setIsExpanded(false);
		},
		[onSetValue],
	);

	const widthStyle = useMemo(() => {
		const minLengthLabel = SELECT_LABEL.length + 2;
		const maxLengthList = options
			.map((o) => o.value.length + (o.label?.length ?? 0) * 0.8 + (o.label ? 1 : 0))
			.reduce((prev, curr) => Math.max(prev, curr), 0);
		const maxLengthSelected = options.map((o) => o.value.length).reduce((prev, curr) => Math.max(prev, curr), 0) + 1;
		const maxLength = Math.max(minLengthLabel, maxLengthList, maxLengthSelected);

		return {
			width: `${maxLength * 0.7}em`,
		};
	}, [options]);

	const option = useMemo(() => {
		return options.find((o) => o.value === value);
	}, [value, options]);

	const label = option ? option.value : SELECT_LABEL;
	const containerClasses = [s.container, option ? undefined : s.errorState, isExpanded ? s.expanded : undefined];

	useEffect(() => {
		if (isExpanded) {
			selectedIndexRef.current?.scrollIntoView({
				behavior: "instant",
				block: "center",
			});

			const closeList = (e: MouseEvent): void => {
				e.stopPropagation();
				setIsExpanded(false);
			};

			document.addEventListener("click", closeList);

			return () => {
				document.removeEventListener("click", closeList);
			};
		}
	}, [isExpanded]);

	return (
		<div className={cx(containerClasses)} style={widthStyle} onClick={handleClickLabel}>
			<div className={cx([s.label])}>{label}</div>
			{isExpanded ? (
				<div className={s.list}>
					{options.map((o) => (
						<div
							ref={o.value === value ? selectedIndexRef : undefined}
							key={o.value}
							className={cx({ [s.entry]: true, [s.selected]: o.value === value })}
							onClick={(e) => {
								handleClickEntry(e, o.value);
							}}
						>
							<div className={s.listLabels}>
								<div className={s.listLabel}>{o.value}</div>
								<div className={s.listSublabel}>{o.label}</div>
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};
