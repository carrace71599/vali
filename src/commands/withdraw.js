const { Telegraf, Composer, session, Scenes } = require("telegraf");
const env = require("../env");
const axios = require("axios");
const bot = new Telegraf(env.bot_token);
const Comp = new Composer()
const { starter } = require('../functions/starter');
const { adminId, findUser, sendError, mustJoin, isNumeric, curr } = require("../functions/misc.js");

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
👉Netflix Account [5 Point ].
👉Netflix On Mail Account [ 25 Point ].
👉Prime On mail Account [ 15 Point ].</b>`, { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "Netflix", callback_data: "/Nf instant" }],[{text: "Netflix on Mail", callback_data: "/NF mail" }]] } }
  )
})
Comp.action(/./Nf/, ctx => {
var params = ctx.message.text.split(' ')[1]
  ctx.editMessageText(`<b>🎁For Exchange Points to Account :-
🖲Please Click on Comfirm</b>`, { chat_id: ctx.chat.id, message_id: ctx.callbackQuery.message.message_id, parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "Confirm", callback_data: "/confirm "+params }, { text: "Cancel", callback_data: "/joined" }]] } });
});

Comp.action('/./confirm/', async (ctx) => {
  if (ctx.chat.type != 'private') { return }
  ctx.deleteMessage();
  let bData = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();
  if (bData.length === 0) {
    return;
  }
  let joinCheck = await findUser(ctx);
  if (joinCheck) {
var params = ctx.message.text.split(' ')[1]
const withdraw = (params == "instant" || params == "mail") ? parseFloat(5) : parseFloat(25);
    let b;
    b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
    if (b[0].balance < withdraw) {
      ctx.replyWithMarkdown('‼ *🚫 You Need ' + withdraw + ' ' + await curr() + ' For Exchanging .\n👬 Refer More to Earn .*')
      return
    }
var params = ctx.message.text.split(' ')[1]
if(params == "mail"){
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
       await  ctx.telegram.sendMessage("","** :\n"+msg,{
     parse_mode:"Markdown",
        reply_markup:{
          inline_keyboard:[[{text:"🤖 Bot Link",url:"https://t.me/botusername"}]]}
      })
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
    const dat = await db.collection('acc').find({ type: "num" }).toArray();
    const acc = await db.collection('acc').find({ type: "acc" }).toArray();
    try {
      
      if (dat.length != 0) {
        var num = dat[0].num
        const Acc = acc[0].acc[num]
        var Accs = Acc.split(":")
        const email = Accs[0];
        const pass = Accs[1]

        ctx.telegram.sendMessage(ctx.from.id,
          `🛒 Order Successfully Completed..\n📧 Account Details:-\n📧 Email :- ${email}\n🔐 Password :- ${pass}\n🎊Thanks For Using Our Bot🎊\n~Send Screenshot To @abhishek71599`
        );

        db.collection("acc").updateOne({ type: "num" }, { $set: { num: num + 1 } }, { upsert: true });
      } else {
        var num = 0
        const Acc = acc[0].acc[num]
        var Accs = Acc.split(":")
        const email = Accs[0];
        const pass = Accs[1]
        ctx.telegram.sendMessage(ctx.from.id,
          `🛒 Order Successfully Completed..\n📧 Account Details:-\n📧 Email :- ${email}\n🔐 Password :- ${pass}\n🎊Thanks For Using Our Bot🎊\n~Send Screenshot To @abhishek71599`
        );
                                 }

        await db.collection("acc").insertOne({ type: "num", num: 1 })
        b = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
        const upbal = parseFloat(b[0].balance - env.withdraw)
        
        await db.collection('balance').updateOne({ userId: ctx.from.id }, { $set: { balance: upbal } }, { upsert: true })
      
    } catch (err) {
      ctx.replyWithMarkdown("*🛒Sorry , This Product is out of stock .\n🪄 We will Inform You when it cames back.*")
    }
  } else { await mustJoin(ctx, db); }
})



exports.bot = Comp;
exports.onWithdraw = onWithdraw;
