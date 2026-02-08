// Auth service entry point
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
