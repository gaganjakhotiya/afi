import React = require('react')
import BaseComponent = require('../../lib/BaseComponent')
import SampleActions = require('../actions/SampleActions')
import SampleStore = require('../stores/SampleStore')

// Get latest state from
function getState() {
	return {
		data: SampleStore.getData()
	}
}

// Stores to subscribe to
const STORES = [SampleStore]

class SampleComponent extends BaseComponent {
	constructor(props) {
		super(props, {
			stores: STORES,
			getState: getState
		})
	}
	onChange(e) {
		SampleActions.sampleAction(e.target.value)
	}
	render() {
		return (
			<div>
				<input placeholder="Enter some text" value={this.state.data} onChange={this.onChange} />
				{this.state.data ? <p>{"You entered: "}<em>{this.state.data}</em></p> : null}
			</div>
		)
	}
}

export = SampleComponent