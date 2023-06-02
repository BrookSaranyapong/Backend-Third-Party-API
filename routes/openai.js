const express = require("express");
const {
  summaryController,
  dictionary,
  dictionaryTh,
  MagicWrite,CustomizeWriting
} = require("../controllers/Openai");
const { isLogin, authenticate } = require("../middlewares/passport.js");

const router = express.Router();

//route
router.post("/summary",[isLogin], summaryController);
router.post("/dictionary",[isLogin], dictionary);
router.post("/dictionaryth",[isLogin], dictionaryTh);
router.post("/magicwrite",[isLogin], MagicWrite);
router.post("/synonym",[isLogin], CustomizeWriting);

module.exports = router;
