import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

type TSetStateCallback<T> = (arg: T) => T;
type TQueryStringObject = Record<string, string>;
type TSetStateFunc<T> = (arg: TSetStateCallback<T> | T) => void;

const getCurrentSearch = (): string => {
	return window.location.search;
};

const setCurrentSearch = (value: string): void => {
	const url = new URL(window.location.toString());
	url.search = value;
	window.history.replaceState(null, "", url);
};

const setSearchParam = (key: string, value: string): void => {
	const url = new URL(window.location.toString());
	url.searchParams.set(key, value);
	window.history.replaceState(null, "", url);
};

const deleteSearchParam = (key: string): void => {
	const url = new URL(window.location.toString());
	url.searchParams.delete(key);
	window.history.replaceState(null, "", url);
};

const objectToSearch = (obj: TQueryStringObject): string => {
	const params = new URLSearchParams();
	Object.entries(obj).forEach(([key, value]) => {
		params.set(key, value);
	});
	return `?${params.toString()}`;
};

const searchToObject = (search: string): TQueryStringObject => {
	const params = new URLSearchParams(search);
	const result: TQueryStringObject = {};
	for (const [key, value] of params.entries()) {
		result[key] = value;
	}
	return result;
};

export const useLocationSearch = (): [string, TSetStateFunc<string>] => {
	const events = ["popstate", "pushState", "replaceState", "hashchange"];
	const [value, setValue] = useState(getCurrentSearch());

	const handleLocationChange = useCallback(() => {
		setValue(getCurrentSearch());
	}, []);

	const setValueUpwards: TSetStateFunc<string> = useCallback((valueOrFunc) => {
		if (typeof valueOrFunc === "function") {
			const newValue = valueOrFunc(getCurrentSearch());
			setCurrentSearch(newValue);
		} else {
			setCurrentSearch(valueOrFunc);
		}
	}, []);

	useEffect((): (() => void) => {
		for (const event of events) {
			window.addEventListener(event, handleLocationChange);
		}
		return () => {
			for (const event of events) {
				window.removeEventListener(event, handleLocationChange);
			}
		};
	}, []);

	return [value, setValueUpwards];
};

export const useQueryString = (): [TQueryStringObject, TSetStateFunc<TQueryStringObject>] => {
	const [locationSearch, setLocationSearch] = useLocationSearch();
	const result: TQueryStringObject = useMemo(() => {
		return searchToObject(locationSearch);
	}, [locationSearch]);

	const setValueUpwards: TSetStateFunc<TQueryStringObject> = useCallback((valueOrFunc) => {
		if (typeof valueOrFunc === "function") {
			const oldValue = searchToObject(getCurrentSearch());
			setLocationSearch(objectToSearch(valueOrFunc(oldValue)));
		} else {
			setLocationSearch(objectToSearch(valueOrFunc));
		}
	}, []);

	return [result, setValueUpwards];
};

export const useQueryStringParam = (key: string): [string | undefined, (arg0: string) => void, () => void] => {
	const [qs] = useQueryString();
	const value = useMemo(() => {
		return qs[key] ?? undefined;
	}, [key, qs]);
	const handleSetValue = useCallback(
		(value: string) => {
			setSearchParam(key, value);
		},
		[key],
	);
	const handleDeleteValue = useCallback(() => {
		deleteSearchParam(key);
	}, [key]);

	return [value, handleSetValue, handleDeleteValue];
};
