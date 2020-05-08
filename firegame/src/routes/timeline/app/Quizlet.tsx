const _api_url =
	"https://cors-anywhere.herokuapp.com/https://quizlet.com/webapi/3.1/";
const TERMS_URL = _api_url + "terms?filters[isDeleted]=0&filters[setId]=";
const SET_URL = _api_url + "sets/";
const SEARCH_URL = SET_URL + "search?filters[isDeleted]=0&perPage=9&query=";
const FOLDER_URL =
	_api_url + "folder-sets?filters[folderId]=49189251&filters[isDeleted]=0";

function _fetch(base: string, path: string): Promise<any> {
	return fetch(base + path)
		.then((response) => response.json())
		.then((response) => response.responses[0]);
}

export default {
	fetch: _fetch,
	TERMS_URL,
	SEARCH_URL,
	FOLDER_URL,
	SET_URL,
};
