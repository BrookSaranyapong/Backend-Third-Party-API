//Router
const express = require("express");
const { body } = require("express-validator");
const { isLogin,authenticate } = require("../middlewares/passport.js");
const {
  login,
  register,
  me,
  loginWithGoogle,
  logout,
} = require("../controllers/User.js");
const passport = require('passport');
const router = express.Router();

router.post("/login", login);
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อ"),
    body("email").not().isEmpty().withMessage("กรุณากรอกอีเมล์").isEmail().withMessage("รูปแบบอีเมล์ไม่ถูกต้อง"),
    body("username").not().isEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("กรุณากรอกรหัสผ่าน")
      .isLength({ min: 8 })
      .withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  ],
  register
);
router.get("/me", [isLogin], me);
router.get("/logout", logout);

router.get("/auth/google", authenticate);
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    loginWithGoogle
  );

module.exports = router;
