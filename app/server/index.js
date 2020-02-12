const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('build'));

app.listen(process.env.PORT || 3001, () => { console.log('Server Started!'); })
