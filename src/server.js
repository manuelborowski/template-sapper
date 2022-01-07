import sirv from 'sirv';
import express from "express";
import compression from 'compression';
import * as sapper from '@sapper/server';
import body_parser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { init as user_init } from './model/User.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const FileStore = new sessionFileStore(session);

dotenv.config();

const app = express();
app.use(
		body_parser.json(),
		session({
			secret: process.env.SESSION_SECRET,
			resave: true,
			saveUninitialized: true,
			cookie: {
				httpOnly: false
			},
			store: new FileStore({
				path: `.sessions`
			}),
			name: "session"
		}),
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => {
				//BOROWSKI: this is called when an access to the server is made.
				console.log(`${req.session.user_id} is looking for access`, req.session.user_level);
				return ({
					user_level: req.session.user_level
				})
			}
		})
	)

mongoose.connect('mongodb://localhost:27017/sapper-authenticated-sessions')
	.then((res) => {
		return user_init();
	})
	.then( () => {
		app.listen(PORT, err => {
			if (err) console.log('error', err);
		});
	})
	.catch((err) => {
		console.log('Error: ', err);
	})

