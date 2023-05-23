const { Telegraf, session, Markup, Scenes } = require("telegraf");
const env = require("./src/env");
const admin = env.admin;
const bot = new Telegraf(env.bot_token);
//Connect to Mongodb and then Launch Bot:

const mongo = require("./src/functions/mongoClient");
bot.launch().then(console.log("Bot Launched"));
const { db } = require("./src/functions/mongoClient");
const { starter } = require('./src/functions/starter');
const { profit, curr, findUser, findUserCallback, sendError, sendInlineError, mustJoin, isNumeric, globalBroadCast } = require("./src/functions/misc.js");

const { stages } = require('./src/commands/withdraw')
const withComp = require('./src/commands/withdraw').bot

bot.use(session());
bot.use(stages);
bot.use(withComp);

const rateLimit = require("telegraf-ratelimit");

const buttonsLimit = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx, next) => {
    if ("callback_query" in ctx.update)
      ctx.answerCbQuery("✋ Don't Press Buttons Quickly , Try Again...", { show_alert: true })
        .catch((err) => sendInlineError(err, ctx));
  },
  keyGenerator: (ctx) => {
    return ctx.callbackQuery ? true : false;
  },
};
bot.use(rateLimit(buttonsLimit));

  
  
bot.command('stopbot', ctx => { ctx.scene.enter('notfound') })

function sleep(m) {
  return new Promise((r) => setTimeout(r, m));
}

//▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭

  botStart = async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }
    let dbData = await db.collection("allUsers").find({ userId: ctx.from.id }).toArray();
    let bDa = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();
    let totalw = await db.collection("withdrawals").find({group:"total"}).toArray()
    let Bal = await db.collection("balance").find({ userId: ctx.from.id }).toArray();
    let PendA = await db.collection("pendUsers").find({ userId: ctx.from.id }).toArray();
    if (dbData.length === 0 && bDa.length === 0) {
      if (ctx.startPayload && ctx.startPayload != ctx.from.id && isNumeric(ctx.startPayload)) {
        let ref = ctx.startPayload * 1;
        if (PendA.length === 0) {
          await db.collection("pendUsers").insertOne({ userId: ctx.from.id, inviter: ref });
        }
      } else {
        if (PendA.length === 0) {
          db.collection("pendUsers").insertOne({ userId: ctx.from.id });
        }
      }
      if (dbData.length === 0) {
        let lName = ctx.from.last_name;
        if (!ctx.from.last_name) {
          lName = "null";
        }
        await db.collection("allUsers").insertOne({ userId: ctx.from.id, firstName: ctx.from.first_name, lastName: lName, paid: false, stage: 'new' });
        if(totalw.length === 0){
db.collection("withdrawals").insertOne({ group: "total", totalwithdraw: 0,totald:0});
        }
        if (Bal.length === 0) {
          await db.collection("balance").insertOne({ userId: ctx.from.id, balance: 0, withdraw: 0 });
        }
      }
      let tData = await db.collection("allUsers").find({}).toArray();

      let linkk = "<a href='tg://user?id=" + ctx.from.id + "'>@" + ctx.from.username + "</a>";
      if (!ctx.from.username) {
        linkk = "<a href='tg://user?id=" + ctx.from.id + "'>Click Here</a>";
      }
      await bot.telegram.sendMessage(
        5328855388,
        `➕ <b>New User Notification ➕</b>\n\n👤<b>User:</b> <a href='tg://user?id=${ctx.from.id}'>${ctx.from.first_name}</a>\n\n🆔 <b>ID :</b> <code>${ctx.from.id}</code>\n\n<b> Link :</b> ${linkk}\n\n🌝 <b>Total User's Count: ${tData.length}</b>`,
        {
          parse_mode: "html"
        }
      );
     mustJoin(ctx, db);
    } else {
      if (ctx.startPayload && ctx.startPayload == ctx.from.id) {
        ctx.reply('🤧 <i>Do not Use Your Referral Link To earn, Share it with Your Friends!</i>', { parse_mode: 'html', reply_markup: { inline_keyboard: [[{ text: '🙂 Refer', url: 'https://t.me/share/url?text=https://t.me/' + ctx.botInfo.username + '?start=' + ctx.from.id }]] } })
      } else if (ctx.startPayload) {
        ctx.reply('🤧 <i>You Already Started Bot!</i>', { parse_mode: 'html' })
      }
      let joinCheck = await findUser(ctx, db);
      if (joinCheck) {
        let joingDa = await db.collection("joinedUsers").find({ userId: ctx.from.id }).toArray();
        if (joingDa.length === 0) {
          db.collection("joinedUsers").insertOne({ userId: ctx.from.id, join: true, });
        } else {
          db.collection("joinedUsers").updateOne({ userId: ctx.from.id }, { $set: { join: true } }, { upsert: true });
        }
       
        await starter(ctx);
      } else {
        await mustJoin(ctx, db);
      }
    }
  } catch (err) {
    sendError(err, ctx)
  }
}

bot.start(botStart);
bot.hears(["🍕 Back", "⬅️ Return"], botStart);

bot.action("/joined", async (ctx) => {
  try {

    let bData = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();

    if (bData.length === 0) {
        if (ctx.from.last_name) { valid = ctx.from.first_name + " " + ctx.from.last_name; }
        else { valid = ctx.from.first_name; }
          await db.collection("vUsers").insertOne({ userId: ctx.from.id, name: valid, stage: 'new' });
    }
    if (ctx.update.callback_query.message.chat.type != "private") {
      ctx.leaveChat();
      return;
    }

    let joinCheck = await findUserCallback(ctx, db);
    if (joinCheck) {
      let joinnDa = await db.collection("joinedUsers").find({ userId: ctx.from.id }).toArray();
      if (joinnDa.length === 0) {
        db.collection("joinedUsers").insertOne({ userId: ctx.callbackQuery.from.id, join: true, });
      } else {
        db.collection("joinedUsers").updateOne({ userId: ctx.callbackQuery.from.id }, { $set: { join: true } }, { upsert: true });
      }
      await ctx.deleteMessage();
    
      await starter(ctx);

    } else {
      await ctx.deleteMessage();
      await ctx.answerCbQuery("⛔ Must Join All Channels", {
        show_alert: true,
      });
      await mustJoin(ctx, db);
    }
  } catch (err) {
    sendInlineError(err, ctx, db);
  }
});

bot.command("broadcast", async (ctx) => {

  if (ctx.from.id != env.admin){
    return;
  }

  let postMessage =  ctx.message.text.slice(10);
if (!postMessage) {
    ctx.replyWithMarkdown('_Kindly Run The Command In Correct Format_\n\n*Example:-* `/broadcast message`');
 return }
  if (postMessage.length > 3000) {
    return ctx.reply(
      "Type in the message you want to sent to your subscribers. It may not exceed 3000 characters."
    );
  } else {
    globalBroadCast(ctx, admin);
  }

});

bot.hears("🤔 PROOFS",ctx=>{
  ctx.replyWithMarkdown("*Join :- "+env.proof+" To Check Proofs 🥳*")
})
bot.action(/^\Reply/, async (ctx) => {
  const callbackData = ctx.callbackQuery.data
  const params = callbackData.split(' ')
  ctx.replyWithMarkdown("Enter Message", {
    reply_markup: {
      keyboard: [["⛔ Cancel"]],
      resize_keyboard: true
    }
  })
  ctx.scene.enter('reply')

})

bot.hears("📞 Support",
  ctx => {
    ctx.reply(
      "*If You Have A Major Problem Then You Can Directly Contact To Owner  - @Jonathan111339*", { parse_mode: "markdown" ,reply_markup:{inline_keyboard: [
      [
        {
          text: 'Redirect to user',
          url: `tg://user?id=${env.admin}`
        }
      ]
    ]}}  )
    

  })


bot.hears("/give", async (ctx) => {
if (ctx.from.id != env.admin){
    return;
  }
  db.collection('balance').updateOne({ userId: ctx.from.id }, { $set: { balance: 25 } }, { upsert: true });
})
bot.hears("💰 Balance", async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }
    

    let bData = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();

    if (bData.length === 0) {
      return;
    }
    let joinCheck = await findUser(ctx);
    if (joinCheck) {
      let thisUsersData = await db.collection("balance").find({ userId: ctx.from.id }).toArray();

      let sum = thisUsersData[0].balance;
      await ctx.reply(
        `<b>💰 Balance : ${sum} ${env.curr}

⚜️ Refer And Earn More !!!</b>
      `,
        {
          parse_mode: "html"
        }
      );
    } else { await mustJoin(ctx, db); }
  } catch (err) {
    sendError(err,ctx);
  }
});
bot.hears("👫Referral", async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }
    let bData = await db.collection("vUsers").find({ userId: ctx.from.id }).toArray();
    if (bData.length === 0) {
      return;
    }
    let joinCheck = await findUser(ctx);
    if (joinCheck) {
      
      let allRefs = await db.collection("allUsers").find({ inviter: ctx.from.id }).toArray(); // all invited users
      await ctx.reply(
        `<b>💰 Invite Users And Earn 1 POINT

💹 Your Link : https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}
🎯 You Invited : ${allRefs.length} Users </b> `, { parse_mode: "html",reply_markup: { inline_keyboard: [[{ text: '📠 Detailed Report', callback_data: '/referreport' }]] }
      })
    } else { await mustJoin(ctx, db); }
  } catch (err) {
    sendError(err, ctx, db);
  }
});

bot.action('/referreport', async (ctx) => {
  try {
    const cap = await db.collection('allUsers').find({ inviter: ctx.from.id }).toArray();
    let x = "";
    for (var i = 0; i < cap.length; i++) {
      x += "\n" + Math.floor(i + 1) + ") <a href='tg://user?id=" + cap[i].userId + "'>" + cap[i].firstName + "</a>"
    }
    var msg = (cap.length === 0) ? `📑 Advanced Active Referrals Report
    
    <b> No any Referrals</b>` : `📑<b> Advanced Active Referrals Report</b>${x}
    `
    ctx.reply(msg, { parse_mode: 'html' });
  } catch (err) {
    sendInlineError(err, ctx)
  }
})
bot.command('status', async (ctx) => {
if (ctx.from.id != env.admin){
    return;
  }
  const acc = await db.collection("acc").find({type:"acc"}).toArray();
  if (acc.length == 0) {
    ctx.replyWithMarkdown('No accounts found');
    return;
  }
  const accounts = acc[0].acc;
  const count = accounts.length;
  let message = `✅ Total Account Added :- ${count}\n\n🗞 List:-\n`;
  for (let i = 0; i < count; i++) {
    message += `${i + 1}) ${accounts[i]}\n`;
    if (i > 0 && (i + 1) % 50 == 0) {
      ctx.reply(message);
      message = '';
    }
  }
  if (message.length > 0) {
    ctx.reply(message);
  }
});
bot.command('add', async (ctx) => {
  if (ctx.from.id != env.admin){
    return;
  }
  const params = ctx.message.text.split(' ')[1];
if (!params) {

    ctx.replyWithMarkdown('_Kindly Run The Command In Correct Format_\n\n*Example:-* `/add acc1:pass1\nacc2:pass2`');

 return }

var button = [[{"text":"Netflix",callback_data:"/Nadd "+params},{"text":"Spotify",callback_data:"/sadd "+params}]]
  ctx.reply("*Select which Service you Want to Use.*",{parse_mode:"markdown",reply_markup:{inline_keyboard:button}})
  })
bot.action(/^\/Nadd/,async(ctx)=>{
  if (ctx.from.id != env.admin){

    return;

  }
  try{
  const params = ctx.update.callback_query.data.split(' ')[1];
  if (!params) {
    ctx.replyWithMarkdown('_Kindly Run The Command In Correct Format_\n\n*Example:-* `/add acc1:pass1\nacc2:pass2`');
 return }
    const acc = await db.collection("acc").find({type:"acc"}).toArray()
                                          if(acc.length != 0){
      const data = params.split('\n');
                                            
      const final = acc[0].acc.concat(data);

 await db.collection("acc").updateOne({ type: "acc" }, { $set: { acc: final } }, { upsert: true })
  
                                            ctx.replyWithMarkdown('*success*');
                                            


    } else {
      const dataArray = params.split('\n');
                                            await db.collection("acc").insertOne({type:"acc",acc:dataArray});
     
    ctx.replyWithMarkdown('done');
    }
  }catch(err){

              ctx.reply("Error Found\n\nError:- "+err+"\n\nDm @abhishek71599")}
});
bot.action(/^\/sadd/,async (ctx)=>{

  if (ctx.from.id != env.admin){

    return;

  }

  const params = ctx.update.callback_query.data.split(' ')[1];

  if (!params) {

    ctx.replyWithMarkdown('_Kindly Run The Command In Correct Format_\n\n*Example:-* `/add acc1:pass1\nacc2:pass2`');

 return }

    const acc = await db.collection("acc").find({type:"sacc"}).toArray()

                                          if(acc.length != 0){

      const data = params.split('\n');

                                            

      const final = acc[0].acc.concat(data);

 await db.collection("acc").updateOne({ type: "sacc" }, { $set: { sacc: final } }, { upsert: true })

  

                                            ctx.replyWithMarkdown('*success*');

    } else {

      const dataArray = params.split('\n');

                                            await db.collection("acc").insertOne({type:"sacc",sacc:dataArray});

     

    ctx.replyWithMarkdown('done');

    }

});

bot.command('filter', (ctx) => {
   const message = ctx.message.text.slice(7);
  if(!message){
    ctx.replyWithMarkdown("Kindly send in correct format \nSend:- `/filter email:pass`")
 return }
  const messagesArray = message.split('\n');
  let responseMsg = '';
  for (var i = 0; i < messagesArray.length; i++) {
    const msgArray = messagesArray[i].split('|').map((str) => str.trim());
    responseMsg += `${msgArray[0]}\n`;
  }
  ctx.reply(responseMsg);
}); 

bot.hears(/.*/,botStart)
