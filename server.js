const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const {mkdirSync, existsSync} = require("fs");

const PORT = 8080;
app.use(express.static(path.join(__dirname, 'dist')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!existsSync('dist/uploads')) {
      mkdirSync('dist/uploads');
    }
    cb(null, 'dist/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload-logo', upload.single('logo'), (req, res) => {
  res.status(200).send(req.file.originalname);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
