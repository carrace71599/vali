let botToken;
let mongoUrl;
let adminid;
let channel;
let chkchan;
let proof = '@Jonathannewadmin';
let refer = '1'//Reward Pool Of Your Bot in Usdt
let withdraw = '5' //Market on which Your Coin is Available
let paych = "@mailrequest";
let curr = 'Point'
let maxchnl = '6'
let heading = ['Main Channel','Netflix city','Father of Netflix'];
if(!process.env.channel){
    channel = ['joaenus','jonathansks','jonusmod'] //Put Telegram Channel here
}else{
    channel = process.env.channel
}
if(!process.env.chkchan){
    chkchan = ['@joaenus','@jonathansks','@jonusmod'] //put channel to add check like '@rest516','test'
}else{
  chkchan = process.env.chkchan
}
if(!process.env.admin){
    adminid = '5328855388' //Put Telegram User ID of Admin of the Bot
}else{
    adminid = process.env.admin
}

if(!process.env.bot_token){
    botToken = '5926499177:AAFEupgJBuvOOz3Y3jFBPqEp_X1NI9JTKhA' //Replace Bot token
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
heading,
  paych,
proof
}
