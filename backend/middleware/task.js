const multer = require('multer');
const path = require('path');

// File filter should be defined before use
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'result'); // Save files to 'result' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid name conflicts
  }
});

const taskFile = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = taskFile;
