import sirv from 'sirv';
import express from "express";
import compression from 'compression';
import * as sapper from '@sapper/server';
import body_parser from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as mduser  from './model/User.js';
import { url_path_to_level, level as access_level } from 'lib/user_access_levels';
import  nocache  from 'nocache';

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const FileStore = new sessionFileStore(session);

dotenv.config();

const app = express();
app.use(
  body_parser.json(),
  nocache(),
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: false
    },
    store: new FileStore({
      path: `.sessions`,
    }),
    name: "session"
  }),
  compression({threshold: 0}),
  sirv('static', {dev}),
  (req, res, next) => {
    const level = url_path_to_level(req.url);
    console.log('url:', req.url, 'route level:', level, 'user level:', req.session.user_level);
    // BOROWSKI: log out when an non-authorized route is accessed
    if ( level > (req.session.user_level || access_level.no_access)) return res.redirect(302, '/');
    next();
  },
  sapper.middleware({
    session: (req) => {
      //BOROWSKI: this is called when an access to the server is made.
      // console.log(`${req.session.user_id} is looking for access`, req.session.user_level);
      return ({
        user_level: req.session.user_level
      })
    }
  }),
)
//allow empty ("") strings
//https://github.com/Automattic/mongoose/issues/7150
mongoose.Schema.Types.String.checkRequired(v => v != null);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    mduser.init();
  })
  .then(() => {
    app.listen(PORT, err => {
      if (err) console.log('error', err);
    });
  })
  .catch((e) => {
    console.log(`main:\n${e}`);
  })

