const config = require("../config/index");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const register = async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    //check email ซ้ำ
    const existEmail = await User.findOne({ username: username });
    if (existEmail) {
      const error = new Error("อีเมล์ซ้ำ มีผู้ใช้งานแล้ว ลองใหม่อีกครั้ง");
      error.statusCode = 400;
      throw error;
    }

    let user = new User();
    user.name = name;
    user.email = email;
    user.username = username;
    user.password = await user.encryptPassword(password);
    await user.save();

    return res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      const error = new Error("ไม่พบผู้ใช้งานในระบบ");
      error.statusCode = 404;
      throw error;
    }
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("รหัสผ่านไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    //สร้าง token
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "1 days" }
    );

    //decode วันหมดอายุ
    const expires_in = jwt.decode(token);

    res.cookie("token", token, { httpOnly: true, expires: new Date(expires_in.exp * 1000) });
    // return res.status(200).json({
    //  access_token: token, 
    //   expires_in: expires_in.exp,
    //   token_type: "Bearer",
    // });
    return res.send("Login Success")
  } catch (error) {
    next(error);
  }
};

// Add loginWithGoogle
const loginWithGoogle = async (req, res, next) => {
  // The user will be set at `req.user` if authentication was successful.
  try {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1 days" }
    );

    // decode วันหมดอายุ
    const expires_in = jwt.decode(token);

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
      user: user, // If you also want to return the user details
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
}

// const me = async (req, res, next) => {
//   try {
//     if (req.user && req.user.googleId) { // Google Login
//       const { googleId: id, displayName: name, emails, role = 'member' } = req.user;
//       const username = emails && emails[0] ? emails[0].value : null; // Check if emails[0] is defined

//       return res.status(200).json({
//         user: { id, name, username, role }
//       });
//     } else if (req.user) { // JWT Login
//       const { _id: id, name, username, role } = req.user;

//       return res.status(200).json({
//         user: { id, name, username, role }
//       });
//     } else {
//       throw new Error('User not authenticated');
//     }
//   } catch (error) {
//     // Handle the error in some way. Here, we're simply passing it to the next middleware.
//     next(error);
//   }
// };

const me = async (req, res, next) => {
  const { _id, name, username, role } = req.user;
  return res.status(200).json({
    user: {
      id: _id,
      name: name,
      username: username,
      role: role,
    },
  });
};

module.exports = { login,logout, register, me, loginWithGoogle };
