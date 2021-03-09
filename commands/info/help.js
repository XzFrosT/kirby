const Discord = require("discord.js")
module.exports = {
  name: "help",
  aliases: ["helpp","h"],
  description: "available commands for this bot",
  clientPerms: ["EMBED_LINKS"],
  run: async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setTitle("Help Center")
    .setDescription("**PREFIX:**` . `\n\n**use `help <category-name>` to view more info about a category**")
    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
    .addField(`<:moderation:797264386154037258> Moderation`, '`kick` | `ban` | `slowmode` | `unban` | `nuke` | `lock` | `unlock` | `purge` | `snipe`')
    .addField(`<:information:814772981447393323> Info`, '`serverinfo` | `servericon` | `covid` | `userinfo` | `github`')
    .addField(`<:mention:797264340646363186> Utility`, ' `ping` | `avatar` | `steal` | `calculate` | `remind`')
    .addField(`<:XBOX_CONTROLLER:795921686019964939> Fun`, '`meme` | `8ball` | `say` | `animequote` | `howgay` | `ranime` | `coinflip` | `status` | `joke` | `emojify` | `achievement` | `fact` | `quote` | `why` | `advice` | `ascii` | `owoify` | `slap` | `pokemon` | `hack`')
    .addField(`🐶 Animal`, '`bear` | `birb` | `cat` | `catfact` | `bunny` | `dog` | `dogfact` | `bunny`')
    .addField(`<:attention:818685126879739905> NSFW`, 'help nsfw **ONLY IN NFSW CHANNEL*')
    .addField(`<a:giveaway:814773030780928012> Giveaway`, '`gstart` | `gend` | `greroll`')
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`seal`, client.user.displayAvatarURL({ format: "png" }))
    message.channel.send(embed)
  }
}