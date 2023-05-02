export const getRootRoute = (): string => {
	return "/";
};

export const getCommandRoute = (): string => {
	return "/:slug";
};

export const getCommandPath = (slug: string): string => {
	return getCommandRoute().replace(":slug", slug);
};
