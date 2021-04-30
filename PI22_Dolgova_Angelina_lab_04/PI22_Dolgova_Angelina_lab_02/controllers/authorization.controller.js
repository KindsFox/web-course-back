const db = require('../db')
const jwt = require('jsonwebtoken')

const findUser = async (username) => {
    const currentUser = await db.query('SELECT * FROM user WHERE username = $1', [username]);
    if(!currentUser.rows[0]) {
        return {};
    }
    return currentUser.rows[0];
}

class AuthorizationController {

    async register(req, res) {
        const {username, password} = req.body;
        if(username == "" || password == "") {
            return res.status(400).json({ status: 'error', error: 'Invalid data' });
        }
        const currentUser = await findUser(username);
        if(username === currentUser.username) {
            return res.status(400).json({ status: 'error', error: 'User with login already exist'});
        }
        const result = await db.query('INSERT INTO user(username, password) VALUES ($1, $2) RETURNING *', [username, password]);
        res.json(result.rows[0]);
    }

    async login(req, res) {
        const {username, password} = req.body;
        if(username == "" || password == "") {
            return res.json({ status: 'error', error: 'Invalid data' });
        }
        const currentUser = await findUser(username);
        if(!currentUser || password !== currentUser.password) {
            return res.status(400).json({ status: 'error', error: 'User not found or Invalid password' });
        }
        // функция sing принимает 3 параметра: объект с данными, помещаемый в токен,
        // секретный ключ и время существования токена
        const token = jwt.sign({userID: currentUser.id, username}, 'secret', { expiresIn: "7d" })
        return res.json({
            token,
            currentUser: {
                userID: currentUser.id,
                username: username
            }
        });
    }
}

module.exports = new userController();