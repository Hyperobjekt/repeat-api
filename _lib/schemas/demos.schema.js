module.exports = {
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    collection: 'demos',
    schema: {
        _id: { type: 'id', required: false },
        demo_ids: { type: 'array_of_ids', schema: 'demos', required: false },
        arrayOfStrings: { type: 'array_of_strings', required: false },
        boolean: { type: 'boolean', default: false, required: false },
        color: { type: 'color', required: false },
        date: { type: 'date', required: false },
        email: { type: 'email', required: false },
        match: { type: 'match', matches: ['MATCHONE', 'MATCHTWO'], required: false },
        number: { type: 'number', required: false },
        password: { type: 'password', required: false },
        phone: { type: 'phone', required: false },
        slug: { type: 'slug', required: false },
        string: { type: 'string', required: false },
        title: { type: 'title', required: false },
        url: { type: 'url', required: false },
        tags: { type: 'array_of_strings', required: false },
        created: { type: 'date', required: false },
    }
};