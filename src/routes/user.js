const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello user router');
});

router.get('/:id', (req, res) => {
  console.log('params: ', req.params);
  console.log('query: ', req.query);

  res.status(200).cookie('name', 'test').json({ name: 'song' });
});

module.exports = router;