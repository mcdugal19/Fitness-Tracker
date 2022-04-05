const { Client } = require("pg");

const client = new Client(
    process.env.DATABASE_URL || "postgres://localhost:5432/UNIV_FitnessTrackr_Starter"
  );

async function createUser({ username, password }) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
          INSERT INTO users(username, password) 
          VALUES($1, $2) 
          ON CONFLICT (username) DO NOTHING 
          RETURNING *;
        `,
        [username, password]
      );
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  async function getUser() {
    try {
      const { rows } = await client.query(
        `SELECT id, username, password 
          FROM users;
        `
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(userId) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `SELECT id, username 
          FROM users WHERE id=${userId};
        `
      );
  
      if (!user) {
        return null;
      }
  
      user.posts = await getPostsByUser(userId);
  
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
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    client,
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  };