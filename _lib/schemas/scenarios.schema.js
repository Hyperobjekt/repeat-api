module.exports = {
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    collection: 'scenarios',
    schema: {
        _id: { type: 'id', required: false },
        id: { type: 'string', required: false },
        filter_level_1: { type: 'string', required: false },
        filter_level_2: { type: 'string', required: false },
        filter_level_3: { type: 'string', required: false },
        variable_name: { type: 'string', required: false },
        value: { type: 'string', required: false },
        unit: { type: 'string', required: false },
        scenario: { type: 'string', required: false },
        year: { type: 'string', required: false },
        geo: { type: 'string', required: false },
        unit_alt: { type: 'string', required: false },
        unit_alt_equation: { type: 'string', required: false },
        _filter_level_1: { type: 'string', required: false },
        _filter_level_2: { type: 'string', required: false },
        _filter_level_3: { type: 'string', required: false },
        _variable_name: { type: 'string', required: false },
        _value: { type: 'string', required: false },
        _unit: { type: 'string', required: false },
        _scenario: { type: 'string', required: false },
        _year: { type: 'string', required: false },
        _geo: { type: 'string', required: false },
        _unit_alt: { type: 'string', required: false },
        _unit_alt_equation: { type: 'string', required: false },
        created: { type: 'date', required: false },
    }
};