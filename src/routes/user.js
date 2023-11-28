const express = require('express');
const { getUsers, getUserById, insertUser, updateUser, deleteUser } = require('./../controller/user.ctrl');


const router = express.Router();

// router.get('/', (req, res) => {
//   res.send('hello user router');
// });

router.route('/')
  .get(getUsers)
  .post(insertUser);

router.route('/:id')
  .get(getUserById)
  .post(updateUser)
  .delete(deleteUser);

module.exports = router;