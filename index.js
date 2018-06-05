const Symphony = require('symphony-api-client-node');
const recastai = require('recastai');
const client = new recastai.request('512032aa56aa69d2281f16b8644deeae');
const form = require('./form_template');
var import_form = null;
var message_queue = [];
var getting = null;
var importing = false;

function getting_missing_fields(message){
  // subject field
  if (import_form[0].value === null && import_form[0].required === true){
    getting = 'subject';
    console.log('[debug] ask for subject');
    Symphony.sendMessage( message.stream.streamId, "What is the subject of form?", null, Symphony.MESSAGEML_FORMAT);
  }

  // account field
  else if(import_form[1].value === null && import_form[1].required === true){
    getting = 'account';
    console.log('[debug] ask for account');
    Symphony.sendMessage( message.stream.streamId, "What is the account of form?", null, Symphony.MESSAGEML_FORMAT);
  }

  else{
    getting = null;
    console.log('=== import finished ===');
    console.log('import_form:',import_form);
    Symphony.sendMessage( message.stream.streamId, "The form is well imported.", null, Symphony.MESSAGEML_FORMAT);
  }
}

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {
      if (getting != null && getting === 'subject'){
        console.log('[debug] got subject')
        import_form[0].value = message.messageText;
        getting_missing_fields(message);
      }
      else if (getting != null && getting === 'account'){
        console.log('[debug] got account')
        import_form[1].value = [message.messageText];
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
