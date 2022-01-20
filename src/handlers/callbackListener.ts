import { Composer } from "grammy";

const listener = new Composer();

listener.on('callback_query:data', (ctx) => {
  console.log('raw data', ctx.callbackQuery.data);
  const [intention, ...data]: string[] = ctx.callbackQuery.data.split(':');
  
  if (intention === 'join') {
    const [gameId]: string[] = data;
    console.log('join', gameId);

    ctx.answerCallbackQuery({
      text: "You're trying to join game " + gameId,
      show_alert: true
    });
  }
});

export default listener;