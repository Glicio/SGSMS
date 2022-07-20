const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserSchema } = require("./schemas/User.js");
const User = mongoose.model("User", UserSchema);

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

//cria novo usuário
async function createUser(user) {
  //name,cpf,email,password_hash,canUseFarmacia,canUseMarcacao,isAdmin
  const {
    name,
    cpf,
    email,
    password,
    canUseFarmacia,
    canUseMarcacao,
    isAdmin,
  } = user;
  let password_hash = await bcrypt.hash(password, 10);

  const user_to_register = new User({
    name: name,
    cpf: cpf,
    email: email,
    password_hash: password_hash,
    canUseFarmacia: canUseFarmacia,
    canUseMarcacao: canUseMarcacao,
    isAdmin: isAdmin,
  });

  return user_to_register.save();
}
//retorna um único usuário baseado no id do mesmo.
async function getUserById(id) {
  const user = await User.findOne({ _id: id });

  return user.toObject();
}

//edita um usuário
async function updateUser(updatedUser) {
  const { _id, email, isAdmin, canUseFarmacia, canUseMarcacao, password } =
    updatedUser;
  if (!password || password === "") {
    return User.updateOne(
      { _id: _id },
      {
        _id: _id,
        email: email,
        isAdmin: isAdmin,
        canUseMarcacao: canUseMarcacao,
        canUseFarmacia: canUseFarmacia,
      }
    );
  }
  return User.updateOne(
    { _id: _id },
    {
      _id: _id,
      email: email,
      isAdmin: isAdmin,
      canUseMarcacao: canUseMarcacao,
      canUseFarmacia: canUseFarmacia,
      password_hash: await bcrypt.hash(password, 10),
    }
  );
}

async function getUserByCPF(cpf) {
  const user = await User.findOne({ cpf: cpf });
  if (user) return user.toObject();
  return undefined;
}

async function getUsersPaginated(search, page, limit) {
  page = page ? page : 1;
  limit = limit ? limit : 10;
  search = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { cpf: new RegExp(search, "i") },
        ],
      }
    : {};
  try {
    const count = await User.countDocuments();
    const users = await User.find(search)
      .limit(limit)
      .skip((page - 1) * limit);

    return { users, totalPages: Math.ceil(count / limit), currentPage: page };
  } catch (err) {
    console.error(err.message);
  }
}

//Refresh token bullshit - não usar no momento...
async function createRefreshToken(userId, refreshToken) {
  User.updateOne({ _id: userId }, { refresh_token: refreshToken }, (err) => {
    if (err) return false;
  });
  return true;
}

async function validateRefreshToken(refreshToken) {
  if (!refreshToken || refreshToken === null) return false;

  if (
    !jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return false;
      return true;
    })
  )
    return false;

  let user = await User.findOne({ refresh_token: refreshToken });

  if (user === null) return false;

  return true;
}

async function deleteRefreshToken(refreshToken) {
  User.updateOne(
    { refresh_token: refreshToken },
    { refresh_token: null },
    (err) => {
      if (err) return false;
    }
  );
  return true;
}

module.exports.createUser = createUser;
module.exports.getUserByCPF = getUserByCPF;
module.exports.getUserById = getUserById;
module.exports.createRefreshToken = createRefreshToken;
module.exports.validateRefreshToken = validateRefreshToken;
module.exports.deleteRefreshToken = deleteRefreshToken;
module.exports.getUsersPaginated = getUsersPaginated;
module.exports.updateUser = updateUser;
