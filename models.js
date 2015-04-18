exports.models = {
	Unit: {
		id: 'Unit',
		required: ['name', 'type'],
		properties: {
			name: {
				type: 'string',
				description: 'Name of the unit'
			},
			plural: {
				type: 'string',
				description: 'Plural name of the unit'
			},
			otherNames: {
				type: 'array',
				description: 'Other names of the unit',
				items: {
					type: 'string'
				}
			},
			otherSymbols: {
				type: 'array',
				description: 'Other symbols of the unit',
				items: {
					type: 'string'
				}
			},
			symbol: {
				type: 'string',
				description: 'Symbol of the unit'
			},
			type: {
				type: 'string',
				description: 'Type of the unit'
			},
			systems: {
				type: 'array',
				description: 'Keys of the systems the unit belongs to',
				items: {
					type: 'string'
				}
			},
			tags: {
				type: 'array',
				description: 'Tags that apply to the unit',
				items: {
					type: 'string'
				}
			},
			notes: {
				type: 'string',
				description: 'Notes on the unit'
			}
		}
	}
}