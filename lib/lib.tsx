import React = require('react')
import ReactDOM = require('react-dom')
import ReactRouter = require('react-router')
import assign = require('object-assign')
import EE = require('events')

var req: any = require
var requireContext = req.context('../lib', true, /\.tsx?$/)
requireContext.keys().map(requireContext)

export = {
	React: React,
	ReactDOM: ReactDOM,
	ReactRouter: ReactRouter,
	assign: assign,
	EE: EE
}