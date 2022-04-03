export interface ISearchIndexEntry {
	score: number;
	words: string[];
}

/**
 * Simplifies a word, removing undesired search characters
 */
const simplifySearchTerm = (term: string): string => {
	return term
		.trim()
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "");
};

/**
 * Search for a term on a search index. If found, returns the search index's score
 */
const searchForTermInIndex = (word: string, searchIndex: ISearchIndexEntry): number => {
	return searchIndex.words.some((searchIndexWord) => searchIndexWord.includes(word)) ? searchIndex.score : 0;
};

/**
 * Search for a term in list of search indexes. If found, returns the highest search index score
 */
const searchForTermInIndexes = (word: string, searchIndexes: ISearchIndexEntry[]): number => {
	return searchIndexes.find((searchIndex) => searchForTermInIndex(word, searchIndex) > 0)?.score ?? 0;
};

/**
 * Search for term in list of search indexes. Return the sum of all scores
 */
export const searchForTermsInIndexes = (words: string[], searchIndexes: ISearchIndexEntry[]): number => {
	return words.map((word) => searchForTermInIndexes(word, searchIndexes)).reduce((prev, curr) => prev + curr, 0);
};

/**
 * Given a text, creates a list of words found in the text
 */
export const generateSearchIndexWords = (text: string, additionalWords?: string[]): string[] => {
	const words = text
		.split(" ")
		.map((t) => simplifySearchTerm(t))
		.filter((t) => Boolean(t));

	if (additionalWords) {
		words.push(...additionalWords);
	}

	const singleWords = words.filter((word, index) => {
		return words.indexOf(word) === index;
	});

	return singleWords;
};
