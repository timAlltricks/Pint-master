/* eslint-disable new-cap */
'use strict';

const debug = require('debug')('info');

const mongoose = require('mongoose');
const database = require('../config/database');

const User = require('./models/user');

/* Mongo Config */
mongoose.Promise = global.Promise;
mongoose.connect(database.url, {useMongoClient: true});

const PORT = process.env.PORT || 8030;

module.exports = (app, router) => {

	function authenticated(req, res, next) {
		req.cookies.user ? next() : res.redirect('/login');
    }
    
    function register(username, password, req, res, next) {
        var user = new User({
            username: username,
            password: password
        });

        user.save((err) => {
            if (err) {
				req.flash('info', 'Username already taken');
				res.render('register');
			} else {
				next(user);
			}
        })
    }

	// Populate all pages with user object if authenticated
	app.use((req, res, next) => {
		if (req.cookies.user) {
			User.findById(req.cookies.user, (err, user) => {
				if (err) {
					throw err;
				}

				console.log('Populating page with user object');
				res.locals.user = user;

				next();
			});
		} else {
			next();
		}
	});

	// Sanitize all input so nobody hax us xD
	// I'm sure one random npm module will fix that
	app.use(require('sanitize').middleware);

	router
		.get('/cookies', (req, res) => {
			res.send(req.cookies);
		});

	router
		.get('/', (req, res) => {
			if (req.cookies.user) {
				// Logged in index
				User.find({}, (err, users) => {
					if (err) throw err;
					// just list all users at the moment
					res.render('home', {title: 'Home', users: users})
				})
			} else {
				res.render('welcome', {title: 'An easier way to plan'});
			}
		});

	router
		.get('/register', (req, res) => {
			if (req.cookies.user) {
				return res.redirect('/');
			}

			res.render('register', {title: 'Register'});
		})
		.post('/register', (req, res) => {
			if (req.cookies.user) {
				console.log("Already logged in");
				return res.redirect('/');
			}

			if (!req.body.username || !req.body.password) {
				req.flash('info', 'Username/password not provided');

				return res.render('register');
			}
			register(req.body.username, req.body.password, req, res, user => {
				console.log(`user "${user.username}" registered successfully`);

					// Authentication cookie lasts 60 mins
				res.cookie('user', user._id, {maxAge: 1000 * 60 * 60});

				res.redirect('/')
			});
		});

	router
		.get('/login', (req, res) => {
			if (req.cookies.user) {
				return res.redirect('/');
			}

			res.render('login', {title: 'Login'});
		})
		.post('/login', (req, res) => {
			// if the user is already logged in just redirect home
			if (req.cookies.user) {
				return res.redirect('/');
			}

			if (!req.body.username || !req.body.password) {
				req.flash('info', 'Username/password not provided');
				return res.render('login');
			}

			User.findOne({username: req.body.username}, (err, user) => {
				console.log(!user);
				if (!user) {
					console.log('user doesnt exist');
					// user probably doesn't even exist lol
					req.flash('info', 'User does not exist');
					return res.render('login');
				}

				if (user.compare(req.body.password)) {
					res.cookie('user', user._id, {maxAge: 1000 * 60 * 60});
					res.redirect('/');
				} else {
					req.flash('warning', 'Incorrect username/password');
					return res.render('login');
				}
			});
		});

	router
		.get('/logout', (req, res) => {
			res.clearCookie('user');
			res.redirect('/');
		});

	app
		.get('/delete/:id', (req, res) => {
            res.render('delete');
        })
        .post('/delete/:id', (req, res) => {
			console.log('deleting: ' + req.params.id);
			User
				.findById(req.params.id)
				.remove()
				.exec()
				.then(user => {
					res.clearCookie('user', {path:'/'})
					req.flash('info', 'Your account has been deleted')
					res.render('index')
				})
				.catch(err => {
					throw err
				});
		})
		
	app
		.get('/@:username', (req, res) => {
			if (!req.params.username) res.redirect('/404');
			
			User.findOne({username: req.params.username}, (err, user) => {
				if (err) throw err;
				var admin;

				if (req.cookies.user == user._id) {
					// this is the logged in user
					admin = true;
				} else {
					// this is just a user viewing a profile
					admin = false;
				}

				res.render('profile', {user: user, admin: admin})
			})
		})
		.post('/@:username', authenticated, (req, res) => {
			if (!req.body.bio) res.redirect('/@' + req.params.username);

			User.findById(req.cookies.user, (err, user) => {
				if (user.username == req.params.username) {
					// this user is authorized to edit bio
					user.bio = req.body.bio;
					user.save((err) => {
						if (err) throw err;

						console.log('Saved bio');
					})
				} else {
					redirect('/@' + req.params.username)
				}
			})
		})

	app
		.get('/404', (req, res) => {
			// just redirect home for now. TODO: Change this to warning message
			res.redirect('/');
		})
	app
		.listen(PORT, () => {
			debug(`Watching ${PORT} for changes`);
		});

	app.use('/', router);
};
