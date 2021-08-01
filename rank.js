const config = require('../../config/config.json')
const Canvas = require('canvas');
const user = require("../../models/user.js");
const rankcard = require("../../models/user-card.js"),
      guild = require("../../models/guild.js");
const { purple } = require("../../assets/color.json")
const { check, nocheck, thug9 } = require("../../assets/emojis.json")
const { getCommunitiveXp, getLevel, getLevelXp } = require("../../function/functions.js");

module.exports.run = async (client, message, args) => {
  let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
  if(member.id === client.user.id) return message.channel.send(`Hello ${thug9}, that's me! **I'm un-rankable!!! ${nocheck}**`)
  if(member.bot) return message.channel.send(`${nocheck} ${member} is a **bot!** Bots aren't invited to the **super fancy !rank party**`);
  let levelData1 = await user.findOne({ guildId: message.guild.id, userId: message.author.id });
  let cardData = await rankcard.findOne({ userId: member.id });
  if(!cardData) {
    const newdata = new rankcard({
      userId: message.author.id
    })
    newdata.save()
    message.author.send(`you can customize your rankcard with these`)
  }
  let levelData = await user.findOne({ guildId: message.guild.id, userId: member.id })
  
  if(member.presence.status === "dnd") member.presence.status = "#f14947";
  if(member.presence.status === "idle") member.presence.status = "#f9a61a";
  if(member.presence.status === "online") member.presence.status = "#43b580";
  if(member.presence.status === "offline") member.presence.status = "#737f8d";
  if(member.presence.status === "streaming") member.presence.status = "#593695";
  
  const color = cardData.color;
  const status = member.presence.status;
  
  let rank = await user.find({ guildId: message.guild.id }).sort({ "leveling.xp": -1 }).exec();
  rank = rank.filter(x => message.guild.members.cache.has(x.userId)).findIndex(x => x.userId == member.id) + 1;
  
  const xp = levelData.leveling.xp
  const axp = levelData1.leveling.xp
  const currentLvl = getLevel(xp) || 0;
  const currentXP = xp - getCommunitiveXp(currentLvl) || 0;
  const levelXP = getLevelXp(currentLvl) || 0;
  
  if(axp < 10) return message.channel.send(`${nocheck} You aren't ranked yet. Send some message first, then try again.`)
  if(xp < 10) return message.channel.send(`${nocheck} **${member.tag}** isn't ranked yet.`)
  
  const canvas = Canvas.createCanvas(1000, 300);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "#23272A";
  ctx.fillRect(0, 0, 1000, 300);
  
  if(cardData.image) {
    await Canvas.loadImage(cardData.image).then((image) => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    })
  }

  if(member.id === config.owner) {
    ctx.font = "25px Arial";
    ctx.fillStyle = purple;
    ctx.fillText("Developer Team", 295, 268);

    ctx.font = "25px Arial";
    ctx.fillStyle = purple;
    ctx.fillText("dsc.gg/xyzz", 820, 268);
    
    const xyzz = await Canvas.loadImage("https://i.imgur.com/iV7HbJx.png");
    ctx.drawImage(xyzz, 40, 60, 178, 220);
  }
  
  ctx.globalAlpha = cardData.opacity;
  ctx.fillStyle = "#000000";
  ctx.fillRect(26, 39, 947, 220)
  ctx.globalAlpha = 1.0;
    
  ctx.beginPath();
  ctx.arc(297, 215, 20, 0.5 * Math.PI, Math.PI * 1.5, false);
  ctx.arc(930, 215, 20, Math.PI * 1.5, Math.PI * 0.5, false);
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#020202";
  ctx.stroke();
  ctx.fillStyle = "#474b4d";
  ctx.fill();
  
  ctx.font = "48px Arial";
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText(`${member.username}`, 297, 180);
  let usernameWidth = ctx.measureText(`${member.username} `).width;

  ctx.font = "28px Arial";
  ctx.fillStyle = "#828282";
  ctx.fillText(`#${member.discriminator}`, 305 + usernameWidth, 176);
  
  if (xp != 0) {
    ctx.beginPath();
    ctx.arc(297, 215, 20, 0.5 * Math.PI, Math.PI * 1.5, false);
    ctx.arc(297 + Math.floor((currentXP / levelXP) * 630), 215, 19, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  ctx.font = "65px Arial";
  ctx.fillStyle = color;
  ctx.fillText(currentLvl, 950 - ctx.measureText(currentLvl).width, 106);
  var currentLevelWidth = ctx.measureText(currentLvl).width;

  ctx.font = "25px Arial";
  ctx.fillStyle = color;
  ctx.fillText("LEVEL", 950 - currentLevelWidth - ctx.measureText("LEVEL ").width, 106);
  currentLevelWidth = currentLevelWidth + ctx.measureText("LEVEL ").width;

  ctx.font = "65px Arial";
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText(`#${rank}`, 950 - currentLevelWidth - ctx.measureText(`#${rank} `).width - 5, 106);
  currentLevelWidth = currentLevelWidth + ctx.measureText(`#${rank} `).width;

  ctx.font = "25px Arial";
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText("RANK", 950 - currentLevelWidth - ctx.measureText("LEVEL ").width, 106);
  
  var formattedlevelXP;
  if (levelXP > 1000) {
    formattedlevelXP = (levelXP / 1000).toFixed(2) + "K";
  } else {
    formattedlevelXP = levelXP;
  }
  
  ctx.font = "25px Arial";
  ctx.fillStyle = "#828282";
  ctx.fillText(` / ${formattedlevelXP} XP`, 940 - ctx.measureText(` / ${formattedlevelXP} XP`).width, 176);
  var levelXPWidth = ctx.measureText(` / ${formattedlevelXP} XP`).width;

  var formattedcurrentXP;
  if (currentXP > 1000) {
    formattedcurrentXP = (currentXP / 1000).toFixed(2) + "K";
  } else {
    formattedcurrentXP = currentXP;
  }
  
  ctx.fillStyle = "#FEFEFE";
  ctx.fillText(`${formattedcurrentXP}`, 940 - levelXPWidth - ctx.measureText(`${formattedcurrentXP}`).width, 176);
  
  ctx.beginPath();
  ctx.arc(130, 150, 89, 0, Math.PI * 2);
  ctx.closePath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#020202";
  ctx.stroke();
  ctx.save();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: "jpg"}));
  ctx.drawImage(avatar, 41, 61, 178, 178);
  
  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(196, 207, 23, 0, Math.PI * 2);
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.fillStyle = status;
  ctx.fill();
  ctx.strokeStyle = "#020202";
  ctx.stroke();
  
  return message.channel.send({
    files: [{
      attachment: canvas.toBuffer(),
      name: 'rank.png'
    }]
  })
}

module.exports.help = {
  name: "rank",
  aliases: ["rankcard"]
}