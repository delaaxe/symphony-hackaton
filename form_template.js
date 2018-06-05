module.exports.template = function() {
    return [
        {
            'name': 'subject',
            'type': 'String',
            'value': null,
            'required': true,
        },
        {
            'name': 'account',
            'type': 'List',
            'value': null,
            'required': true,
        },
        {
            'name': 'date',
            'type': 'Datetime',
            'value': null,
            'required': true,
        },
        {
            'name': 'content',
            'type': 'String',
            'value': null,
            'required': true,
        },
        {
            'name': 'sg_participants',
            'type': 'List',
            'value': null,
            'required': true,
        },
        {
            'name': 'account_participants',
            'type': 'List',
            'value': null,
            'required': false,
        }
    ]
}