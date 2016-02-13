import AppDispatcher = require('./Dispatcher')
import assign = require('object-assign')

declare var parseInt: {
	(value: string | number):number
}

interface IActionClass {
	id?: number;
	__proto__?: any;
}

interface IAction<T extends IActionClass> { 
	new (...args: any[]): T
}

String.prototype['toUnderscore'] = function() {
	return this.replace(/([A-Z])/g, function($1) { return "_" + $1 })
}

function dispatch(action: string | number, data?: any){
	if (typeof data !== 'undefined' && typeof data !== 'object')
		data = { value: data }
	AppDispatcher.dispatch(assign({ actionType: action }, data))
}

function createAction<T extends IActionClass>(Action: IAction<T>): T {
	var newAction = new Action()
	var obj = newAction.__proto__
	if (!obj.id)
		obj.id = parseInt(Math.random() * 1000)
	for (var key in obj) {
		if (typeof obj[key] !== 'function')
			continue
		(function(_obj, _key){
			let _method = _obj[_key]
			let _constant = _key.toUnderscore().toUpperCase()
			let _actionType = _obj.id + '_' + _constant
			_obj[_key] = function() {
				let data = _method.apply(null, arguments)
				dispatch(_actionType, data)
			}
			_obj[_key].CONST = _actionType
		}(obj, key))
	}
	return newAction
}

export = {
	createAction: createAction,
	dispatch: dispatch
}