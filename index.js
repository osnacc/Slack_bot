const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/for-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/for-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});


app.command("/for-flip", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({ text: `🪙 The coin landed on: *${result}*` });
});


app.command("/for-choice", async ({ command, ack, respond }) => {
  await ack();
  const options = command.text.split(" ").filter(opt => opt.length > 0);
  if (options.length < 2) {
    await respond({ text: "Please provide at least two options separated by spaces." });
  } else {
    const choice = options[Math.floor(Math.random() * options.length)];
    await respond({ text: `I choose: *${choice}*` });
  }
});


app.command("/for-reverse", async ({ command, ack, respond }) => {
  await ack();
  if (!command.text) return await respond({ text: "Please provide text to reverse." });
  const reversed = command.text.split("").reverse().join("");
  await respond({ text: `Reversed: ${reversed}` });
});


app.command("/for-color", async ({ ack, respond }) => {
  await ack();
  const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  await respond({ text: `Random color: *${hex}*` });
});


app.command("/for-mock", async ({ command, ack, respond }) => {
  await ack();
  if (!command.text) return await respond({ text: "Please provide text to mock." });
  const mocked = command.text.split("").map((char, i) => 
    i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
  ).join("");
  await respond({ text: mocked });
});


app.command("/for-rate", async ({ command, ack, respond }) => {
  await ack();
  if (!command.text) return await respond({ text: "Please provide an object to rate." });
  const score = Math.floor(Math.random() * 11);
  await respond({ text: `I rate '${command.text}' a *${score}/10*!` });
});


 app.command("/for-nothing", async ({ command, ack, respond }) => {
   await ack();
   if (!command.text) return await respond({ text: "Please provide nothing for nothing." });
   if (command.text == "nothing"){ 
   await respond({ text: `This is your nothing '' `});
   }
   else{
   await respond({ text: `Give 'nothing' for nothing`});
   }
})



app.command("/for-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `*Available Commands:*
/for-ping - Check bot latency
/for-catfact - Get a random cat fact
/for-flip - Flip a coin
/for-choice [items] - Pick one from a list
/for-reverse [text] - Reverse your text
/for-color - Generate a random HEX color
/for-mock [text] - Spongebob mock style
/for-rate [object] - Rate something 0-10
/for-nothing [nothing] - Give nothing for nothing`
  });
});
(async () => {
  await app.start();
  console.log("bot is running!");
})();