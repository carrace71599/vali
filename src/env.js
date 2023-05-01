let botToken;
let mongoUrl;
let adminid;
let channel;
let chkchan;
let refer = '1'//Reward Pool Of Your Bot in Usdt
let withdraw = '5' //Market on which Your Coin is Available
let paych = "@rest516";
let curr = 'Point'
let maxchnl = '6'
if(!process.env.channel){
    channel = ['@rest516'] //Put Telegram Channel here
}else{
    channel = process.env.channel
}
if(!process.env.chkchan){
    chkchan = ['@rest516'] //put channel to add check
}else{
  chkchan = process.env.chkchan
}
if(!process.env.admin){
    adminid = '1834957586' //Put Telegram User ID of Admin of the Bot
}else{
    adminid = process.env.admin
}

if(!process.env.bot_token){
    botToken = '5815565391:AAHrvxlQoIQ7tXeAEWRrCp3ClN_xJ0a6pYQ' //Replace Bot token
}else{
    botToken = process.env.bot_token
}

if(!process.env.mongoLink){
    mongoUrl = 'mongodb+srv://abhishek71599:dora1emon@cluster0.qvx9s93.mongodb.net/?retryWrites=true&w=majority' //Put MongoDB URL you can get it from https://mongodb.com/
}else{
    mongoUrl = process.env.mongoLink
}


module.exports = {
mongoLink: mongoUrl,
bot_token: botToken,
admin: adminid,
channel:channel,
chkchan:chkchan,
refer,
withdraw,
curr,
maxchnl,
  paych,
}
