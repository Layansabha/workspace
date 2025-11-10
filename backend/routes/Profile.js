const router = require("express").Router();
const ctrl = require("../controllers/profile.controller");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/me", auth, ctrl.me);
router.put("/me", auth, ctrl.updateMe);
router.put("/avatar", auth, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;
