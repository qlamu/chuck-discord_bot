const axios = require("axios");
const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");

const config = require("./config.json");
const helpFields = require("./help.json");

const client = new Discord.Client();

client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));

client.on("message", (msg) => {
  if (msg.content.startsWith(config.prefix)) {
    // Remove prefix and split the command
    let command = msg.content.substring(config.prefix.length).split(" ");

    // Get a joke, random, categorized or specific
    if (command[0] == "joke") {
      let url = "http://api.icndb.com/jokes";

      if (command[1])
        url += !isNaN(command[1])
          ? `/${command[1]}`
          : `/random?limitTo=[${command[1]}]`;
      else url += "/random";

      axios
        .get(url)
        .then((response) =>
          // The API doesn't handle errors prettily
          msg.channel.send(
            response.data.value.hasOwnProperty("joke")
              ? response.data.value.joke
              : ":warning: " + response.data.value
          )
        )
        .catch(err => handleErrors(err, msg));
    }

    // Get the total number of jokes
    else if (command[0] == "jokeCount") {
      axios
        .get("http://api.icndb.com/jokes/count")
        .then((response) =>
          msg.channel.send(`I've got ${response.data.value} jokes to tell.`)
        )
        .catch(err => handleErrors(err, msg));
    }

    // Get all availables categories
    else if (command[0] == "jokeCategories") {
      axios
        .get("http://api.icndb.com/categories")
        .then((response) => msg.channel.send(response.data.value.join(", ")))
        .catch(err => handleErrors(err, msg));
    }

    // Ping the bot for latency
    else if (command[0] == "ping") {
      msg.channel.send(`Pong! ${Date.now() - msg.createdTimestamp}ms\n`);
    }

    // Change the bot prefix
    else if (command[0] == "prefix" && command[1]) {
      config.prefix = command[1];
      fs.writeFile("config.json", JSON.stringify(config), (err) => {
        msg.channel.send("Prefix updated to " + config.prefix);
        if (err) msg.channel.send(":warning: Cannot persistently save prefix");
      });
    }

    // Show help box
    else if (command[0] == "help") {
      let help = new Discord.MessageEmbed()
        .setTitle("Chuck Norris Jokes Commands")
        .setColor("#dc3c3c");
      helpFields.forEach((f) => help.addField(config.prefix + f.name, f.value));
      msg.channel.send(help);
    }

    // Play audio from YouTube in user channel
    else if (command[0] == "yt" && ytdl.validateURL(command[1])) {
      let channel = msg.member.voice.channel;
      if (channel) {
        channel
          .join()
          .then((conn) =>
            conn.play(
              ytdl(command[1], { quality: "highestaudio" }).on("end", () =>
                channel.leave()
              )
            )
          );
      } else msg.reply(":no_entry: You must be in an audio channel to do this");
    }
  }
});

handleErrors = (err, msg) => {
  console.log(err);
  msg.channel.send("Either the API is broken or you can't write proper commands.");
} 

client.login(config.token);
