/// <reference path="../../typings/tsd.d.ts" />
var _return = !Storage

function set(form: string, obj: {}){
	if(_return)
		return 
	localStorage.setItem(form, JSON.stringify(obj))
}

function get(form: string, field?: string){
	if(_return)
		return
	let data = localStorage.getItem(form)
	return data ? (field ? JSON.parse(data)[field] : JSON.parse(data)) : undefined
}

function clear(form: string, field?: string){
	if(_return)
		return 
	if(field){
		let data = localStorage.getItem(form)
		if (data) {
			data = JSON.parse(data)
			delete data[field]
			localStorage.setItem(form, JSON.stringify(data))
		}
	}else{
		localStorage.removeItem(form)
	}
}

export = {
	set: set,
	get: get,
	clear: clear
}