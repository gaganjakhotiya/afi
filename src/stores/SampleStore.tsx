import BaseStore = require('../../lib/BaseStore')
import Actions = require('../actions/SampleActions')
import KEYS = require('../constants/StorageMap')

class SampleStore extends BaseStore {
	constructor(_namespace) {
		super(_namespace)
	}

	getData() {
		return this.get(KEYS.SAMPLE_DATA)
	}

	//Caters to actions
	handler(action: any) {
		switch (action.actionType) {
			case Actions.sampleAction['CONST']:
				this.setValue(KEYS.SAMPLE_DATA, action.value)
				break
		}
	}
}

export = new SampleStore("samplestore")