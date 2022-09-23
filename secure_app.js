import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
  NEED_COMMAND,
  CHALLENGE_COMMAND,
  HasGuildCommands,
} from './commands.js';

import fs from 'fs';
import http from 'http';
import https from 'https';
import {discord_interaction} from "./discord_stuff.js";

const privateKey  = fs.readFileSync('sslcert/_.rodley.com.key', 'utf8');
const certificate = fs.readFileSync('sslcert/_.rodley.com.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  return( discord_interaction(req,res))
});

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(3000);
httpsServer.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    NEED_COMMAND,
    CHALLENGE_COMMAND,
  ]);
});
 
