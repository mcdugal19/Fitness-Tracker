const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
          INSERT INTO users(username, password) 
          VALUES($1, $2) 
          ON CONFLICT (username) DO NOTHING 
          RETURNING username, id ;
        `,
      [username, password]
    );
    console.log("user from usersDB: ", user);
    return user;
  } catch (error) {
    throw error;
  }
}
async function getUser(params) {
  try {
    const { rows } = await client.query(
      `SELECT id, username, password 
          FROM users
          WHERE username = $1
        `,
      [params.username]
    );
    const user = rows[0];
    if (user.password == params.password) {
      delete user.password;
      return user;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      ` SELECT * 
        FROM users
        WHERE id = $1;
        `,
      [userId]
    );

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
      `,
      [username]
    );

    // if (!user) {
    //   return null;
    // }

    // delete user.password;
      console.log('userDB: ', user)
    return user;
  } catch (error) {
    console.error('error getting User')
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
