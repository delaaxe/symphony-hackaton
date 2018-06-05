module.exports.template = function() {
    return [
        {
            'name': 'subject',
            'type': 'String',
            'value': null,
            'required': true,
            'question': 'What was the topic of your discussion ?',
            'nlp_type': "subject"
        },
        // {
        //     'name': 'account',
        //     'type': 'List',
        //     'value': null,
        //     'required': true,
        //     'question': 'What is the account ?',
        //     'nlp_type': null
        // },
        // {
        //     'name': 'date',
        //     'type': 'Datetime',
        //     'value': null,
        //     'required': true,
        //     'question': 'What is the date ?',
        //     'nlp_type': "datetime"
        // },
        // {
        //     'name': 'content',
        //     'type': 'String',
        //     'value': null,
        //     'required': true,
        //     'question': 'What is the content ?',
        //     'nlp_type': null
        // },
        // {
        //     'name': 'sg_participants',
        //     'type': 'List',
        //     'value': null,
        //     'required': true,
        //     'question': 'Who are the SG participants ?',
        //     'nlp_type': "person"
        // },
        // {
        //     'name': 'account_participants',
        //     'type': 'List',
        //     'value': null,
        //     'required': false,
        //     'question': 'Who are the account participants ?',
        //     'nlp_type': "person"
        // }
    ]
}
