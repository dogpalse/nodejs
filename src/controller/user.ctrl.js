const User = require('./../../models/user');

// 유저 리스트 조회
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'desc']]
    });
    console.log('users: ', users);

    res.json(users);
  } catch(err) {
    console.error(e);
    next(err);
  }
};

// id로 유저 조회
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!user) {
      console.error('해당 유저가 없습니다.');
      return res.status(400).send('일치하는 유저가 없습니다.');
    }
    console.log('user: ', user);
    res.json(user);
  } catch(err) {
    console.error(err);

    next(err);
  }
};

// 유저 추가
const insertUser = async (req, res, next) => {
  try {
    console.log('req data: ', req.body);
    const user = {
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
      comment: req.body.comment,
    };

    await User.create(user);
    res.status(201).json(user);
  } catch(err) {
    console.error(err);

    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    console.log('user: ', user);

    if(!user) {
      console.error('해당 유저가 없습니다.');
      return res.status(400).json('해당 유저가 없습니다.');
    }

    await User.update({
      name: req.body.name
    }, {
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(user);
  } catch(err) {
    console.error(err);

    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!user) {
      console.error('해당 유저가 없습니다.');
      return res.status(400).json('해당 유저가 없습니다.');
    }

    await User.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(user);
  } catch(err) {
    console.error(err);

    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  insertUser,
  updateUser,
  deleteUser
};