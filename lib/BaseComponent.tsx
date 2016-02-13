/// <reference path="../typings/tsd.d.ts" />
import React = require('react')
import assign = require('object-assign')
import BaseStore = require('./BaseStore')
import TransitionUtils = require('./utils/TransitionUtils')

window['afiRouting'] = false

interface BaseProps{
	stores: BaseStore[];
	getState: Function;
	path?: string;
	urlParams?: string[];
	queryParams?: string[];
	loadURLDataAction?: Function;
}

class BaseComponent extends React.Component<any, any> {
	constructor(props, protected bProps: BaseProps) {
		super(props)
		this._onChange = this._onChange.bind(this)
		this.state = bProps.getState() || {}

		if(bProps.stores && bProps.stores.length>0){
			let subComponentDidMount = this.componentDidMount.bind(this)
			this.componentDidMount = () => {
				for (let index = 0; index < bProps.stores.length; index++){
					bProps.stores[index].addChangeListener(this._onChange)
				}
				if(bProps.loadURLDataAction){
					this._updateDataFromURL()
				}else{
					this._updateURL()
				}
				subComponentDidMount()
			}
			let subComponentWillUnmount = this.componentWillUnmount.bind(this)
			this.componentWillUnmount = () => {
				for (let index = 0; index < bProps.stores.length; index++) {
					bProps.stores[index].removeChangeListener(this._onChange)
				}
				this._dropQueryParams()
				subComponentWillUnmount()
			}
		}
	}

	protected componentDidMount() {}
	protected componentWillUnmount() {}

	protected show(component: any, ...cProps: any[]) {
		let props = { params: this.props.params }
		if(cProps){
			for (let index = 0; index < cProps.length; index++){
				assign(props, cProps[index])
			}
		}
		return React.createElement(component, props)
	}

	private _updateDataFromURL() {
		if (this._preventRouting())
			return
		
		let urlData = TransitionUtils.getSearchParamsFromURL()
		if (this.bProps.urlParams) {
			for (let count = 0; count < this.bProps.urlParams.length; count++) {
				let tState = this.bProps.urlParams[count]
				if (this.props.params && this.props.params[tState])
					urlData[tState] = this.props.params[tState]
			}
		}

		let params = []
		let l1 = this.bProps.urlParams ? this.bProps.urlParams.length : 0
		let l2 = this.bProps.queryParams ? this.bProps.queryParams.length : 0
		let index = 0
		for (index; index < l1; index++)
			params[index] = urlData[this.bProps.urlParams[index]]
		for (index; index < l1+l2; index++)
			params[index] = urlData[this.bProps.queryParams[index-l1]]

		this.bProps.loadURLDataAction.apply(null, params)
	}

	private _updateURL() {
		if (this._preventRouting())
			return

		let query = this._getNextSearchQuery()
		let pathnameCurrent = window.location.pathname
		let pathnameNext = this._getPathname(this.state)
		if (pathnameCurrent !== pathnameNext || (query && window.location.search !== query)) {
			TransitionUtils.updateURL(pathnameNext + query)
		}
	}

	private _getPathname(obj):string{
		let url = this.bProps.path || ''
		let params = this.bProps.urlParams || []

		if (url.charAt(url.length - 1) != '/')
			url += '/';
		for (let index = 0; index < params.length; index++) {
			if (!!obj[params[index]]) {
				url += obj[params[index]] + '/'
			}
		}
		return url.substr(0, url.length - 1)
	}

	private _getNextSearchQuery():string{
		if(this.bProps.queryParams && this.bProps.queryParams.length)
			return

		let params = this.bProps.queryParams
		let currentQueryParams = TransitionUtils.getSearchParamsFromURL()
		for (let index = 0; index < params.length; index++) {
			let key = params[index]
			if (!!this.state[key]) {
				currentQueryParams[key] = this.state[key]
			}else{
				delete currentQueryParams[key]
			}
		}
		return TransitionUtils.objectToURLSearchString(currentQueryParams)
	}

	private _dropQueryParams(){
		if (this._preventRouting() || !(this.bProps.queryParams && this.bProps.queryParams.length))
			return

		let params = this.bProps.queryParams
		let queryParams = TransitionUtils.getSearchParamsFromURL()
		for (var key in queryParams) {
			if(params.indexOf(key)>=0)
				delete queryParams[key]
		}
		let query = TransitionUtils.objectToURLSearchString(queryParams)

		if (query && window.location.search != query) {
			TransitionUtils.updateURL(window.location.pathname + query)
		}
	}

	private _onChange() {
		this.setState(this.bProps.getState(), this._updateURL.bind(this))
	}

	private _preventRouting(){
		return window['afiRouting'] || !this.bProps.path
	}
}

export = BaseComponent