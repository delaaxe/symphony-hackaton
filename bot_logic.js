const Symphony = require('symphony-api-client-node');
var basicForm = require('./form_template')

class Bot {
    constructor() {
        this.isPassive= false; // just listening or also asking question
        this.logger= new Log();  
        this.NLP = null;
        this.answer = null
    }

    run() {
        Symphony.initBot(__dirname + '/config.json')
        .then( (symAuth) => {
            Symphony.getDatafeedEventsService( this.read.bind(this) );
        })

    }
    sendToNLP() {
        //TODO: send to NLP and reveive defaulting
    };
    verifyForm(templateForm) {
        //TODO: verify form required
    }
    read(event, messages) {
        messages.forEach((message, index) => {
            // parsed = this.NLP.parse(message)
            var parsed = {parsed: true, message: message.messageText}
            if (this.isPassive) {
                this.logger.add(parsed)    
            } else if (!this.isPassive && !this.answer) {
                this.askNextQuestion(message)
            } else {
                this.logger.updateFieldForm(this.answer, parsed)      
                this.answer = null
                if (this.logger.isCompleted()) {
                    console.log("COMPLETED!!!", this.logger.getDefaultForm())
                    this.reset()
                } else {
                    this.askNextQuestion(message)
                }
            }
        });
    }


    askNextQuestion(message) {
        var form = this.logger.getDefaultForm()
        form.forEach(field => {
            if (!field.value) {
                if(!this.answer) {
                    Symphony.sendMessage(message.stream.streamId, field.question, null, Symphony.MESSAGEML_FORMAT);
                    this.answer = field.name
                }
            }
        })

    }
    reset() {
        this.logger = new Log()
        this.isPassive = true
        this.NLP = null;
        this.answer = null
    }

    sendMessage(message) {
        Symphony.sendMessage(message.stream.streamId, message, null, Symphony.MESSAGEML_FORMAT);
    }

    fillForm() {
        if (this.isPassive) {
            this.isPassive = false
        }
        else {
            return null
        }
        form = this.logger.getDefaultForm()
        form.fields.forEach(field => {
            if (!field.value) {
                input(field.question)
            }
        });
    }

}


class Log {
    constructor() {
        this.location = "Filename";
        this.lastLoad = null;
        this.history = []
        this.defaultForm = JSON.parse(JSON.stringify(basicForm)).form
        // basicForm
    
    }

    add(message) {
        console.log(message)
        this.history.push(message)

    }

    save() {

    }

    load() {

    }

    updateFieldForm(fieldname, value) {
        var idx = this.defaultForm.findIndex(x => x.name == fieldname)
        this.defaultForm[idx].value = value
    }

    isCompleted() {
        var completed = true
        this.defaultForm.forEach(field => {
            console.log(field.value)
            if (field.value == null) {
                completed = false
            }
        })
        return completed
    }

    getDefaultForm() {
        return this.defaultForm;
    }
}


module.exports = Bot
