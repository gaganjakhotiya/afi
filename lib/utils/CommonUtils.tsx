/// <reference path="../../typings/tsd.d.ts" />

function simpleClone(obj: {}): {}{
	let type = typeof obj
	if(type==='undefined' || type==='boolean' || type==='number' || type==='string' || type==='function' || obj===null)
		return obj
	return JSON.parse(JSON.stringify(obj))
}

export = {
	simpleClone: simpleClone
}