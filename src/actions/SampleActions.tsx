import BaseAction = require('../../lib/BaseAction')

class Actions {
	sampleAction(data: string) {
		return data
	}
}

export = BaseAction.createAction(Actions)