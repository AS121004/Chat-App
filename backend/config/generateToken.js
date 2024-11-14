const jwt = require("jsonwebtoken");
xyz = "string";
const generateToken = (id) => {
    return jwt.sign({ id }, xyz, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;