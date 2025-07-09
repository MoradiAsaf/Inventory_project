const jwt = require("jsonwebtoken")
const secretKey = process.env.secret_key

const generateToken = (customerId)=> {
    return jwt.sign({id: customerId}, secretKey, {expiresIn: '1h'})
}

module.exports = generateToken

