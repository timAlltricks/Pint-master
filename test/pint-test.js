/* eslint-disable no-undef */
/* eslint-disable new-cap */

const express = require('express');

const router = express.Router();
const exphbs = require('express-handlebars');
const request = require('supertest');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Basic Handlebars Config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(session({
	secret: 'hunter2',
	cookie: {maxAge: 60000},
	resave: false,
	saveUninitialized: true
}));
app.use(cookieParser('hunter3'));

// Import routes
require('../app/routes')(app, router);

describe('rendering root unauthenticated', () => {
	it('responds with 200 OK', done => {
		request(app)
			.get('/')
			.expect(200, done);
	});
});
