# Discord bot for Chuck Norris jokes API & youtube audio streaming

A discord bot around the [ICNDb.com](http://www.icndb.com/) API, with bonus functions around youtube music streaming.

## Deployment

First, you need to obtain a bot token, head over to [Discord Developer Portal](https://discord.com/developers), create a bot and copy the token inside `config.json`.

The bot comes with a Dockerfile and a Docker Compose, so to deploy it just run `docker-compose -f docker-compose.yml up` inside the cloned repository.


## Commands

Once added to a server, the default prefix is `%`, and the following list of commands is also available by typing `%help`.

**%joke [arg]**: Fetch a joke from the api, the bot check `arg`, if it is a number it retrieve a specific joke by id, if it is a string we get a random joke from limited categories, and if no argument is present it just fetches a random joke.

**%jokeCategories**: Fetch the availables categories, we can use those categories with the `%joke` command.

**%jokeCount**: Fetch the number of joke route of the API.

**%ping**: Show the latency of the bot.

**%prefix [new_prefix]**: Change the bot prefix, the prefix is stored in a file so it will persist when restarting the bot.

**%yt [youtube_url]**: Stream the audio of the video at `youtube_url` in the sender voice channel.