const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');

module.exports = {
    name: "nsfw",
    aliases: ["help nsfw"],
    category: "nsfw",
  description: "Sends nsfw command",
  run: async (client, message, args, level) => {
  //command

  //Checks channel for nsfw
  var errMessage = "This is not an NSFW Channel";
  if (!message.channel.nsfw) {
      message.react('💢');

      return message.reply(errMessage)
      .then(msg => {
      msg.delete({ timeout: 3000 })
      })
      
  }

  return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
    return rp.get({
        url:'http://media.oboobs.ru/' + res[0].preview,
        encoding: null
    });
}).then(function(res)   {

const nsfw = new Discord.MessageEmbed()
      .setTitle("NSFW Commands")
      .setColor(RANDOM)
      .addField("`ass` | `boobs` | `hentai` | `hentaigif`")
      message.channel.send(nsfw);
});
  }
  };