const Symphony = require('symphony-api-client-node');
const recastai = require('recastai');
const client = new recastai.request('512032aa56aa69d2281f16b8644deeae');
const form = require('./form_template').form;
var message_queue = [];

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {
      if (message.messageText == '!import'){
        // import the message queue
        import_form = Object.assign({}, form);
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
