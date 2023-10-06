const express = require('express');
const app = express();
const path = require('path');

const PORT = 8080; // Change this line to use port 8080

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
