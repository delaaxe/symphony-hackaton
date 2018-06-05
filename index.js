var fs = require('fs');
const Symphony = require('symphony-api-client-node');
const recastai = require('recastai');
const client = new recastai.request('512032aa56aa69d2281f16b8644deeae');
const form = require('./form_template');
var import_form = null;
var message_queue = [];
var getting = null;

function format_output() {
  var output = []
  import_form.forEach(field => {
    output.push({
      name: field.name,
      value: field.value
    })
  })
  return output
}

function save_output() {
fs.writeFile("./output.json", JSON.stringify(format_output(), null, 4),  function(err) {
    if(err) {
        return console.log(err);
    }
}); 
}

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
    save_output()
    Symphony.sendMessage( message.stream.streamId, "The form is well imported.", null, Symphony.MESSAGEML_FORMAT);
    Symphony.sendMessage( message.stream.streamId, "test\ntest\n", null, Symphony.MESSAGEML_FORMAT);
    reset()
  }
}

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {

      if(getting != null) {
        index_field_getting = import_form.findIndex(x => x.name==getting);
        var message_nlp = {};
        client.converseText(message.messageText)
        .then(function(res) {
          message_nlp.original = message;
          message_nlp.nlp = res.entities;
          console.log(message_nlp)
          if(getting == 'date') {
            import_form[index_field_getting].value = message_nlp.nlp.datetime[0].formatted;          
          } else if (getting == 'sg_participants') {
            import_form[index_field_getting].value = message_nlp.nlp.person.map(function(person) {
              return person.raw
            }).join(', ');
            
          } else {
            import_form[index_field_getting].value = message.messageText;
          }
  
          getting_missing_fields(message);

        })
        
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
          if (message_nlp.nlp.person != undefined){
            var sg_participants_field = import_form.find(function(element) {
              return element.name === 'sg_participants';
            });
            sg_participants_field.value = message_nlp.nlp.person.map(function(person) {
              return person.raw
            }).join(', ');
          }
          if (message_nlp.nlp.subject != undefined){
            var subject_field = import_form.find(function(element) {
              return element.name === 'subject';
            });
            subject_field.value = message_nlp.nlp.subject[0].raw
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
