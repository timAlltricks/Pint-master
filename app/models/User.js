const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	bio: String,
	createdAt: Date,
	friends: [{id: Schema.Types.ObjectId}],
	token: String
});

userSchema.pre('save', function (next) {
	const user = this;

	if (!this.createdAt) {
		this.createdAt = new Date();
	}

	if (!this.token) {
		this.token = jwt.sign({ auth: `${this.username}.${this.password}` }, 'hunter2');
	}

	bcrypt.hash(user.password, SALT_ROUNDS, (err, hash) => {
		if (err) {
			throw err;
		}

		user.password = hash;
		next();
	});
});

userSchema.methods.compare = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
