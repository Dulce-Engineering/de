import firebase from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
//import { onSchedule } from 'firebase-functions/scheduler';
//const {onRequest} = require("firebase-functions/https");
//const logger = require("firebase-functions/logger");
import express from 'express';
import cors from 'cors';
import RPC_Buddy from 'rpc-buddy';
import Server from './lib/Server.js';

const api_options =
{
  region: ["australia-southeast1"],
  timeoutSeconds: 240,
  minInstances: 0,
  maxInstances: 10,
  concurrency: 80
};
export const api = functions.https.onRequest
  (api_options, Server.New_Express(express, cors, RPC_Buddy));
