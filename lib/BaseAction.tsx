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

function dispatch(action: Function, data?: any){
	if (typeof data !== 'undefined' && typeof data !== 'object')
		data = { value: data }
	AppDispatcher.dispatch(assign({ actionType: action }, data))
}

function createAction<T extends IActionClass>(Action: IAction<T>): T {
	var newAction = new Action()
	var obj = newAction.__proto__ || newAction.constructor.prototype
	if (!obj.id)
		obj.id = parseInt(Math.random() * 1000)
	for (var key in obj) {
		if (typeof obj[key] !== 'function')
			continue
		(function(_obj, _key){
			let _method = _obj[_key]
			_obj[_key] = function() {
				let data = _method.apply(null, arguments)
				dispatch(_obj[_key], data)
			}
		}(obj, key))
	}
	return newAction
}

export = {
	createAction: createAction,
	dispatch: dispatch
}