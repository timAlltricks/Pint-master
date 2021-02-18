/* eslint-disable new-cap */

'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const router = express.Router();

/* Config */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
	secret: 'hunter2',
	cookie: {maxAge: 60000},
	resave: false,
	saveUninitialized: true
}));
app.use(cookieParser('hunter3'));

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(flash());

/* Import and use routes */
require('./app/routes')(app, router);

