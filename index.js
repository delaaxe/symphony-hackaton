const Symphony = require('symphony-api-client-node');
const Bot = require("./bot_logic")

const botHearsSomething = ( event, messages ) => {
    messages.forEach( (message, index) => {
      let reply_message = 'Message: ' + message.user.firstName  ;
      bot.read(message)
      // console.log(message)
      // console.log(event)
      Symphony.sendMessage( message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT);
    })
}

Symphony.initBot(__dirname + '/config.json')
  .then( (symAuth) => {
    Symphony.getDatafeedEventsService( botHearsSomething );
  })
