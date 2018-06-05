module.exports.form =
[
    {
        'name': 'subject',
        'type': 'String',
        'value': null,
        'required': true,
        'question': 'What was the topic of your discussion ?',
        'keywords': ['subject']
    },
    {
        'name': 'account',
        'type': 'List',
        'value': null,
        'required': true,
        'question': 'What is the account ?',
        'keywords': ['account']        
    },
    {
        'name': 'date',
        'type': 'Datetime',
        'value': null,
        'required': true,
        'question': 'What is the date ?',
        'keywords': ['date']
    },
    {
        'name': 'content',
        'type': 'String',
        'value': null,
        'required': true,
        'question': 'What is the content ?',
        'keywords': ['content', 'summarise']
    },
    {
        'name': 'sg_participants',
        'type': 'List',
        'value': null,
        'required': true,
        'question': 'Who are the SG participants ?',
        'keywords': ['person']
    },
    {
        'name': 'account_participants',
        'type': 'List',
        'value': null,
        'required': false,
        'question': 'Who are the account participants ?',
        'keywords': ['person']
    }
]