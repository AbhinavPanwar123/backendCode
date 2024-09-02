const bcrypt = require('bcryptjs');

const decryptPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.log(err);
    }
};

module.exports = decryptPassword ;
