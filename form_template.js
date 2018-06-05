module.exports.template = function() {
    return [
        {
            'name': 'subject',
            'type': 'String',
            'value': null,
            'required': true,
            'question': 'What was the topic of your discussion ?',
        },
        {
            'name': 'account',
            'type': 'List',
            'value': null,
            'required': true,
            'question': 'What is the account ?',
        },
        {
            'name': 'date',
            'type': 'Datetime',
            'value': null,
            'required': true,
            'question': 'What is the date ?',
        },
        {
            'name': 'content',
            'type': 'String',
            'value': null,
            'required': true,
            'question': 'What is the content ?',
        },
        {
            'name': 'sg_participants',
            'type': 'List',
            'value': null,
            'required': true,
            'question': 'Who are the SG participants ?',
        },
        {
            'name': 'account_participants',
            'type': 'List',
            'value': null,
            'required': false,
            'question': 'Who are the account participants ?',
        }
    ]
}
