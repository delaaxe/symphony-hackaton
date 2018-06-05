const Symphony = require('symphony-api-client-node');
const recastai = require('recastai');
const client = new recastai.request('512032aa56aa69d2281f16b8644deeae');
const form = require('./form_template');
var import_form = null;
var message_queue = [];
var getting = null;

function reset() {
  var import_form = null;
  var message_queue = [];
  var getting = null; 
}

function getting_missing_fields(message){
  var completed = true
  import_form.forEach(field => {
    if (field.value === null && field.required === true && completed === true) {
      completed = false
      Symphony.sendMessage(message.stream.streamId, field.question, null, Symphony.MESSAGEML_FORMAT);
      // this.answer = field.name
      getting = field.name;
    }
  })
  if(completed == true) {
    getting = null;
    console.log('=== import finished ===');
    console.log('import_form:',import_form);
    Symphony.sendMessage( message.stream.streamId, "The form is well imported.", null, Symphony.MESSAGEML_FORMAT);
    reset()
  }
}

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {

      if(getting != null) {
        index_field_getting = import_form.findIndex(x => x.name==getting);
        import_form[index_field_getting].value = message.messageText;
        getting_missing_fields(message);
      }

      else if (message.messageText == '!import'){
        // import the message queue
        import_form = form.template();
        message_queue.forEach( (message_nlp) =>{
          if (message_nlp.nlp.datetime != undefined){
            var date_field = import_form.find(function(element) {
              return element.name === 'date';
            });
            date_field.value = message_nlp.nlp.datetime[0].formatted;
          }
        });
        getting_missing_fields(message);

        
      }else{
        client.converseText(message.messageText)
        .then(function(res) {
          var message_nlp = {};
          message_nlp.original = message;
          message_nlp.nlp = res.entities;
          message_queue.push(message_nlp);
          console.log(res.entities)
          Symphony.sendMessage( message.stream.streamId, JSON.stringify(res.entities), null, Symphony.MESSAGEML_FORMAT);
        })
      }
    })
}

Symphony.initBot(__dirname + '/config.json')
  .then( (symAuth) => {
    Symphony.getDatafeedEventsService( botHearsSomething );
  })
