const express = require("express");
const Product = require("../models/product");
const { transporter } = require("../utils/nodemailer/transporter");
const { generateToken, verifyToken } = require("../middleware/authToken");
const decryptPassword = require("../utils/decrypt");
const hashPassword = require("../utils/bcrypt");
const upload = require("../utils/multer");
const Checkuser = require("../middleware/validator");
const userSchema = require("../models/user");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// Random Token Generator
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomToken(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Signup
router.post("/signup", Checkuser, async (req, res) => {
  const { firstName, lastName, email, password ,isVerified} = req.body;

  try {
    const User = await userSchema.findOne({ email });
    if (User) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = generateRandomToken(5);

    const verificationLink = `http://localhost:3000/api/verify-email/${verificationToken}`;
    const mailOptions = {
      from: "coolgujjarboyabhinav@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Please click on the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "Failed to send verification email",
        });
      } else {
        console.log("Email sent: " + info.response);
        
        const hashedPassword = await hashPassword(password);

        const user = new userSchema({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          verificationToken,
          isVerified
        });
  console.log(user)
        await user.save();

        return res
          .status(200)
          .send({ success: true, message: "Email Verify Link sent" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Verify Email 
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await userSchema.findOne({ verificationToken:token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.verificationToken = null; 

    await user.save();
console.log(user)
    res.status(200).send("Email verified successfully. You can now log in.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Login 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const isMatch = await decryptPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Add Product 
router.post("/add-product", verifyToken,async (req, res) => {
  const { title, price, quantity, category ,photo} = req.body;
try{
    const product = new Product({
      title,
      price,
      quantity,
      category,
      photo,
      user_id: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get Products Grouped by Category 
router.get("/my-products", verifyToken, async (req, res) => {
    try {
      const products = await Product.aggregate([
        { 
            $match: { user_id: new mongoose.Types.ObjectId(req.user.id) } 
        },
        {
          $group: {
            _id: "$category",
            products: { $push: "$$ROOT" },
          },
        },
      ]);
  
      console.log(products);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

// Search Products by Title and Category 
router.get("/search", async (req, res) => {
  const { title, category } = req.query;
  try {
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Image Upload
router.post("/upload", upload.single("photo"), function (req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  return res.status(200).json({
    message: "File uploaded successfully.",
    file: req.file,
  });
});

module.exports = router;
