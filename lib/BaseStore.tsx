/// <reference path="../typings/tsd.d.ts" />
import EventEmitter = require('events')
import assign = require('object-assign')
import Dispatcher = require('./Dispatcher')
import StorageUtils = require('./utils/StorageUtils')
import CommonUtils = require('./utils/CommonUtils')

var EE: any = EventEmitter

class BaseStore{
	private static _localstorage: any = {}

	private _CHANGE_EVENT: string;
	private _dispatcherIndex: string;
	constructor(protected _namespace){
		BaseStore.setContext(this, _namespace)
		this.handler = this.handler.bind(this)
		this.register(this.handler)
	}
	
	static setContext(context: BaseStore, _namespace: string){
		context._CHANGE_EVENT = "ch_eve_st_" + _namespace
		if(!BaseStore._localstorage[_namespace])
			BaseStore._localstorage[_namespace] = StorageUtils.get(_namespace) || {}
	}

	public addChangeListener(callback: Function) {
		EE.prototype.on(this._CHANGE_EVENT, callback)
	}

	public removeChangeListener(callback: Function) {
		EE.prototype.removeListener(this._CHANGE_EVENT, callback)
 	}

 	protected emitChange(){
		EE.prototype.emit(this._CHANGE_EVENT)
	}

	protected waitFor(...stores: BaseStore[]){
		let array = []
		for (let index in stores)
			array.push(stores[index]._dispatcherIndex)
		Dispatcher.waitFor(array)
	}

	protected get(field?: string): any{
		let data = BaseStore._localstorage[this._namespace]
		if(field)
			data = data[field]
		return CommonUtils.simpleClone(data)
	}

	protected set(obj: {}, preventEmit?: boolean): void{
		assign(BaseStore._localstorage[this._namespace], CommonUtils.simpleClone(obj))
		if (!preventEmit){
			this.emitChange()
		}
		this._updateLocalStorage()
	}

	protected setValue(key: string, value: any, preventEmit?: boolean): void{
		let obj = {}
		obj[key] = value
		this.set(obj, preventEmit)
	}

	protected clear(field?: string, preventEmit?: boolean): void{
		if(field){
			delete BaseStore._localstorage[this._namespace][field]
		}else{
			BaseStore._localstorage[this._namespace] = {}
		}
		if(!preventEmit){
			this.emitChange()
		}
		this._updateLocalStorage()
	}

	protected replace(obj: {}, preventEmit?: boolean){
		for(let field in obj){
			if (obj.hasOwnProperty(field)){
				BaseStore._localstorage[this._namespace][field] = CommonUtils.simpleClone(obj[field])
			}
	    }
		if (!preventEmit){
			this.emitChange()
		}
		this._updateLocalStorage()
	}

	protected register(callback){
		this._dispatcherIndex = Dispatcher.register(callback)
	}

	protected handler(action: any) {}

	private unregister(): void{
		Dispatcher.unregister(this._dispatcherIndex)
	}

	private _updateLocalStorage(){
		StorageUtils.set(this._namespace, BaseStore._localstorage[this._namespace])
	}
}

export = BaseStore