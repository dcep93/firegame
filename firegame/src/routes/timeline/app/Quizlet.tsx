const API_URL =
	"https://cors-anywhere.herokuapp.com/https://quizlet.com/webapi/3.1/";
const TERMS_URL = API_URL + "terms?filters[isDeleted]=0&filters[setId]=";
const SET_URL = API_URL + "sets/";
const SEARCH_URL = API_URL + "search?filters[isDeleted]=0&perPage=9&query=";
const FOLDER_URL =
	API_URL + "folder-sets?filters[folderId]=49189251&filters[isDeleted]=0";

function _fetch(path: string): Promise<any> {
	return fetch(path)
		.then((response) => response.json())
		.then((response) => response.responses[0]);
}

export default {
	fetch: _fetch,
	API_URL,
	TERMS_URL,
	SEARCH_URL,
	FOLDER_URL,
	SET_URL,
};
