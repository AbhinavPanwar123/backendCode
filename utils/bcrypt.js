const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    try {
        console.log("--->>>",password);
        const hashedPassword = await bcrypt.hash(password, 12);//12 is salt round means how many times my password is strong.
        return hashedPassword;
    } catch (err) {
        console.log(err);
    }
};
module.exports = hashPassword;
