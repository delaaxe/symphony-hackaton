const Symphony = require('symphony-api-client-node');

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {
      let reply_message = 'Message: ' + JSON.stringify(message) + '\n Event: ' + JSON.stringify(event);
      console.log(message)
      console.log(event)
      Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
    })
}

Symphony.initBot(__dirname + '/config.json')
  .then( (symAuth) => {
    Symphony.getDatafeedEventsService( botHearsSomething );
  })
