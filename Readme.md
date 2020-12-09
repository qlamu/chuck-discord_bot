# Discord bot for Chuck Norris jokes API & YouTube audio streaming

A discord bot around the [ICNDb.com](http://www.icndb.com/) API, with bonus functions around YouTube music streaming.

## Deployment

First, you need to obtain a bot token, head over to [Discord Developer Portal](https://discord.com/developers), create a bot and copy the token and copy it :
- If you deploy with the _Dockerfile_, supply the token as an argument to the entrypoint.
- If you deploy using _docker-compose_, put the token in the `docker-compose.yml` file.
- If you don't use Docker, simply copy the token in `config.json`.

The bot comes with a Dockerfile and a Docker Compose, so to deploy it just run `docker-compose up` inside the cloned repository. It uses the _node:lts-alpine_ image to keep the result as small as possible.


## Commands

Once added to a server, the default prefix is `%`, and the following list of commands is also available by typing `%help`:

**%joke [arg]**: Fetch a joke from the API, the bot check `arg`, if it is a number it retrieve a specific joke by id, if it is a string we get a random joke from a specified category, and if no argument is present it just fetches a random joke.

**%jokeCategories**: Fetch the available categories, we can use those categories with the `%joke` command.

**%jokeCount**: Fetch the total number of joke of the API.

**%ping**: Show the latency of the bot.

**%prefix [new_prefix]**: Change the bot prefix, the prefix is stored in a file so it will persist when restarting the bot.

**%yt [youtube_url OR number_from_ytsearch]**: Stream the audio of the video at `youtube_url` in the sender voice channel. If a YouTube search as been made previously with `%ytsearch`, it can also take the video number as argument to stream its audio.

> **Note**: Once the stream is ended, the bot does not leave the channel. We could detect the end with a `.on("end")` and leave afterwardq but due to some bugs with Discord.js or ydtl-core the music terminate a bit early if we do so.

**%ytsearch [keyword_1] [keyword_2] ...**: Search five videos on YouTube with the keywords used in the command that can be played by using `$yt [video_number]`.