const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const usersController = require('./controllers/passport-users.controller')

let opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'nexus'
}

let jwtStrategy = new JwtStrategy(opts, async function (payload, next) {
	const user = await usersController.readById(payload.Id)
	if (user && user.login === payload.Login) {
		next(null, user);
	} else {
		next(null, false);
	}
});

module.exports = jwtStrategy;