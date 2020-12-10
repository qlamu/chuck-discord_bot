const axios = require("axios");
const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const config = require("./config.json");
const helpFields = require("./help.json");

const client = new Discord.Client();

// Result from the "ytsearch" command, not very clean
// but I didn't want another file just for this function.
var ytUrls = [];

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
        .catch((err) => handleErrors(err, msg));
    }

    // Get the total number of jokes
    else if (command[0] == "jokeCount") {
      axios
        .get("http://api.icndb.com/jokes/count")
        .then((response) =>
          msg.channel.send(`I've got ${response.data.value} jokes to tell.`)
        )
        .catch((err) => handleErrors(err, msg));
    }

    // Get all availables categories
    else if (command[0] == "jokeCategories") {
      axios
        .get("http://api.icndb.com/categories")
        .then((response) => msg.channel.send(response.data.value.join(", ")))
        .catch((err) => handleErrors(err, msg));
    }

    // Ping the bot for latency
    else if (command[0] == "ping") {
      msg.channel.send(`Pong! ${Date.now() - msg.createdTimestamp}ms\n`);
    }

    // Change the bot prefix
    else if (command[0] == "prefix" && command[1]) {
      if (/^[^a-zA-Z0-9]$/.test(command[1])) {
        config.prefix = command[1];
        fs.writeFile("config.json", JSON.stringify(config), (err) => {
          msg.channel.send("Prefix updated to " + config.prefix);
          if (err)
            msg.channel.send(":warning: Cannot persistently save prefix");
        });
      } else
        msg.channel.send(":warning: The prefix must be a single symbol");
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
    else if (command[0] == "yt" && command[1]) {
      let url = isNaN(command[1]) ? command[1] : ytUrls[command[1]];
      let channel = msg.member.voice.channel;
      if (!ytdl.validateURL(url))
        msg.channel.send(":no_entry: Invalid YouTube url.");
      else if (!channel)
        msg.channel.send(":no_entry: You must be in an audio channel.");
      else {
        channel
          .join()
          .then((conn) => conn.play(ytdl(url, { quality: "highestaudio" })));
      }
    }

    // Search 5 videos on YouTube
    else if (command[0] == "yts" && command.length > 1) {
      ytSearch(command.slice(1).join(" "))
        .then((response) => {
          let embed = new Discord.MessageEmbed()
            .setAuthor("YouTube", "https://frama.link/yt-icon")
            .setTitle("Results for: _" + command.slice(1).join(" ") + "_")
            .setColor("#dc3c3c")
            .setFooter("Play with $yt [video_number]");
          const videos = response.videos.slice(0, 5);
          videos.forEach((v, i) => embed.addField(i + " - " + v.title, v.url));
          ytUrls = videos.map((v) => v.url);
          msg.channel.send(embed);
        })
        .catch((err) => handleErrors(err, msg));
    }
  }
});

handleErrors = (_err, msg) => {
  msg.reply("Either the API is broken or you can't write proper commands.");
};

client.login(config.token);
