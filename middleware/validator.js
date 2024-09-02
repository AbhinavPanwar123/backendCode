const { body, validationResult } = require("express-validator");

const userValidation = (req, res, next) => {
    let errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        return res.status(400).send({ message: errors.errors[0].msg });
    }
};

const Checkuser = [
    body("firstName")
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long")
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Last name must be at least 3 characters long")
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid Email")
        .notEmpty()
        .withMessage("Email is required"),

    body("password")
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long")
        .isStrongPassword({
            minLength: 5,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage("Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"),

    userValidation
];

module.exports = Checkuser;
