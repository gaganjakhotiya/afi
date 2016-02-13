/// <reference path="../../typings/tsd.d.ts" />
import history = require('../History')

function objectToURLSearchString(obj: {}){
	if(typeof obj !== 'object')
		return
	let query = ''
	for (let key in obj) {
		query += key + '=' + obj[key]
	}
	return query ? '?' + query.substr(1) : ''
}

function getSearchParamsFromURL(): any{
	let search = window.location.search.substr(1)
	return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
		function(key, value) { return key===""?value:decodeURIComponent(value) }) : {}
}

function updateURL(url: string, preserveQueryParams?: boolean){
	if(history.replaceState){
		let search = ''
		if(preserveQueryParams)
			search = window.location.search
		history.replaceState(null, url+search)
	}
}

function goToURL(url: string, preserveQueryParams?: boolean){
	if(history.pushState){
		let search = ''
		if(preserveQueryParams)
			search = window.location.search
		history.pushState(null, url+search)
	}
}

function jumpToURL(url: string, hash?: string[], searchObj?: {}, newTab?: boolean){
	let search = objectToURLSearchString(searchObj)
	
	if(url.charAt(url.length - 1) === '/')
		url = url.slice(0, url.length-1)
	if(hash)
		url += '/#/' + hash.join('/')
	if(search)
		url += search

	if (newTab){		
		let win = window.open(url, '_blank')
		if (win)
			win.focus()
	}else{
		window.location.href = url
	}
}

export = {
	objectToURLSearchString: objectToURLSearchString,
	getSearchParamsFromURL: getSearchParamsFromURL,
	updateURL: updateURL,
	goToURL: goToURL,
	jumpToURL: jumpToURL
}