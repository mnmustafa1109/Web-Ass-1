const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const {mkdirSync, existsSync} = require("fs");

const PORT = 8080; // Change this line to use port 8080

app.use(express.static(path.join(__dirname, 'dist')));

// Define where the logo files will be stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // create the 'dist/uploads' directory if it doesn't already exist
    if (!existsSync('dist/uploads')) {
      mkdirSync('dist/uploads');
    }
    cb(null, 'dist/uploads'); // Store files in the 'dist/uploads' directory
  },
  filename: function (req, file, cb) {
    // save the file with the original name
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Handle logo file uploads
// Handle logo file uploads
app.post('/upload-logo', upload.single('logo'), (req, res) => {
  // File has been uploaded and stored, send the file name as a response
  res.status(200).send(req.file.originalname);
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
