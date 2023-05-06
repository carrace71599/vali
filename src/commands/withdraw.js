const { Telegraf, Composer, session, Scenes } = require("telegraf");
const env = require("../env");
const axios = require("axios");
const bot = new Telegraf(env.bot_token);
const Comp = new Composer()
const { starter } = require('../functions/starter');
const { adminId, findUser, sendError, mustJoin, isNumeric, curr } = require("../functions/misc.js");
const { enter, leave } = Scenes.Stage;
const getWallet = new Scenes.BaseScene("getWallet");
const { db } = require("../functions/mongoClient");
function sleep(m) {
  return new Promise((r) => setTimeout(r, m));
  }
const onWithdraw = new Scenes.BaseScene("onWithdraw");
Comp.hears('💲Withdraw', async (ctx) => {
  const b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
  ctx.reply(`<b>📨You Can Exchange Your Point to Many Premium Accounts.

💰Your Balance ${b[0].balance} ${env.curr}.

🔄Exchange Point to ~
👉Netflix Account [7 Point ].
👉Netflix On Mail Account [ 30 Point ].
👉Prime On mail Account [ 15 Point ].</b>`, 
{ parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "NETFLIX", callback_data: "/Nf instant" }],[{text: "🔥 NETFLIX ON MAIL", callback_data: "/Nf mail" }],[{text: "🔥 PRIME ON MAIL", callback_data: "/Nf prime" }]]} }
  )
})
Comp.action(/^\/Nf/, ctx => {
var params = ctx.update.callback_query.data.split(' ')[1]
  ctx.editMessageText(`<b>🎁For Exchange Points to Account :-
🖲Please Click on Comfirm</b>`, { chat_id: ctx.chat.id, message_id: ctx.callbackQuery.message.message_id, parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "Confirm", callback_data: "/confirm "+params }, { text: "Cancel", callback_data: "/joined" }]] } });
});

Comp.action(/^\/confirm/, async (ctx) => {
  if (ctx.chat.type != 'private') { return }
  ctx.deleteMessage();
  let bData = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();
  if (bData.length === 0) {
    return;
  }
  let joinCheck = await findUser(ctx);
  if (joinCheck) {
var params = ctx.update.callback_query.data.split(' ')[1]
   let b;
if(params == "prime"){
b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
    if (b[0].balance < 15) {
      ctx.replyWithMarkdown('‼ *🚫 You Need 15 ' + await curr() + ' For Exchanging .\n👬 Refer More to Earn .*')
      return
    }
ctx.replyWithMarkdown("*📧 Kindly Enter Your Email*")
ctx.scene.enter("getWallet")

getWallet.enter( async (ctx) => {
 
   getWallet.on("text",async(ctx) =>{
      try{
    const msg = ctx.message.text;

if(msg == "/start"){
  await starter(ctx);
  ctx.scene.leave("getWallet");
return;}
    if (ctx.message.text.length >= 9) {
      
    ctx.telegram.sendMessage(ctx.from.id,
          `🛒 Order Successfully Processed..\n✨ Order Details:-\n\n📧 Email :- ${msg}\n\n🎊Thanks For Using Our Bot🎊\n~Wait for distributors To reach you.`
        );
       await  ctx.telegram.sendMessage(env.paych,"*✅ New Account Request✅\n\n👤 User = @"+ctx.from.username+"\n🛎 Request = Prime\n📧 Mail:*\n`"+msg+"`",{
     parse_mode:"Markdown",
        reply_markup:{
          inline_keyboard:[[{text:"🤖 Bot Link",url:"https://t.me/"+ctx.botInfo.username}]]}
      })
      b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
        const upbal = parseFloat(b[0].balance - 15)
        
        await db.collection('balance').updateOne({ userId: ctx.from.id }, { $set: { balance: upbal } }, { upsert: true })
     ctx.scene.leave("getWallet");   
    } else {
      await ctx.replyWithMarkdown("⛔ *Not Valid Email Address* \n_Send /start to Return To The Menu,\nOr Send a Correct Email Address_");}
  }catch (err) {
    console.log(err);
}
})
});

return
}
if(params == "mail"){
b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
    if (b[0].balance < 30) {
      ctx.replyWithMarkdown('‼ *🚫 You Need 30 ' + await curr() + ' For Exchanging .\n👬 Refer More to Earn .*')
      return
    }
ctx.replyWithMarkdown("*📧 Kindly Enter Your Email*")
ctx.scene.enter("getWallet")

getWallet.enter( async (ctx) => {
 
   getWallet.on("text",async(ctx) =>{
      try{
    const msg = ctx.message.text;

if(msg == "/start"){
  await starter(ctx);
  ctx.scene.leave("getWallet");
return;}
    if (ctx.message.text.length >= 9) {
      
    ctx.telegram.sendMessage(ctx.from.id,
          `🛒 Order Successfully Processed..\n✨ Order Details:-\n\n📧 Email :- ${msg}\n\n🎊Thanks For Using Our Bot🎊\n~Wait for distributors To reach you.`
        );
       await  ctx.telegram.sendMessage(env.paych,"*✅ New Account Request✅\n\n👤 User = @"+ctx.from.username+"\n🛎 Request = Netflix\n📧 Mail:*\n`"+msg+"`",{
     parse_mode:"Markdown",
        reply_markup:{
          inline_keyboard:[[{text:"🤖 Bot Link",url:"https://t.me/"+ctx.botInfo.username}]]}
      })
      b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
        const upbal = parseFloat(b[0].balance - 30)
        
        await db.collection('balance').updateOne({ userId: ctx.from.id }, { $set: { balance: upbal } }, { upsert: true })
     ctx.scene.leave("getWallet");   
    } else {
      await ctx.replyWithMarkdown("⛔ *Not Valid Email Address* \n_Send /start to Return To The Menu,\nOr Send a Correct Email Address_");}
  }catch (err) {
    console.log(err);
}
})
});

return
}
if(params == "instant"){
b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
    if (b[0].balance < 7) {
      ctx.replyWithMarkdown('‼ *🚫 You Need 7 ' + await curr() + ' For Exchanging .\n👬 Refer More to Earn .*')
      return
    }
    const dat = await db.collection('acc').find({ type: "num" }).toArray();
    const acc = await db.collection('acc').find({ type: "acc" }).toArray();
    try {
      
      if (dat.length != 0) {
        var num = dat[0].num
        const Acc = acc[0].acc[num]
        var Accs = Acc.split(":")
        const email = Accs[0];
        const pass = Accs[1]
        const country = Accs[2]
        const mobile = Accs[3]

        ctx.telegram.sendMessage(ctx.from.id,
          `<b>🛒 Order Successfully Completed..\n📧 Account Details:-\n📧 Email :- </b><code>${email}</code>\n<b>🔐 Password :-</b><code>${pass}</code>\n<b>🌐 Country :- </b><code>${country}</code>\n<b>📞 Phone Number :-</b><code> ${mobile}</code>\n<b>🎊Thanks For Using Our Bot🎊\n~Send Screenshot To @jonathanxbot.</b>\n\n<i>~First Try With Emal And Password, if you got problem try with phone number and password</i>`
        ,{parse_mode:"html"});

        db.collection("acc").updateOne({ type: "num" }, { $set: { num: num + 1 } }, { upsert: true });
      } else {
        var num = 0
        const Acc = acc[0].acc[num]
        var Accs = Acc.split(":")
        const email = Accs[0];
        const pass = Accs[1]
        const country = Accs[2]
        const mobile = Accs[3]
        ctx.telegram.sendMessage(ctx.from.id,
          `<b>🛒 Order Successfully Completed..\n📧 Account Details:-\n📧 Email :- </b><code>${email}</code>\n<b>🔐 Password :-</b><code>${pass}</code>\n<b>🌐 Country :- </b><code>${country}</code>\n<b>📞 Phone Number :-</b><code> ${mobile}</code>\n<b>🎊Thanks For Using Our Bot🎊\n~Send Screenshot To @jonathanxbot.</b>\n\n<i>~First Try With Emal And Password, if you got problem try with phone number and password</i>`
        ,{parse_mode:"html"});
                                 }

        await db.collection("acc").insertOne({ type: "num", num: 1 })
        b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
        const upbal = parseFloat(b[0].balance - 5)
        
        await db.collection('balance').updateOne({ userId: ctx.from.id }, { $set: { balance: upbal } }, { upsert: true })
      
    } catch (err) {
      ctx.replyWithMarkdown("*🛒Sorry , This Product is out of stock .\n🪄 We will Inform You when it cames back.*")
    }
  }
  } else { await mustJoin(ctx, db); }
})


const stage = new Scenes.Stage(
  [ getWallet ],
  {
    ttl: 600,
  }
);

exports.stages = stage.middleware();
exports.bot = Comp;
exports.onWithdraw = onWithdraw;
