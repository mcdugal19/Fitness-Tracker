const { Client } = require("pg");

const client = new Client(
    process.env.DATABASE_URL || "postgres://localhost:5432/UNIV_FitnessTrackr_Starter"
  );

  async function getActivityById(id) {
    try {
      const { rows } = await client.query(
        `SELECT id, name, description,
        FROM activities WHERE id=${id};
        `
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getAllActivities() {
    try {
      const { rows } = await client.query(
        `SELECT id, name, description,
          FROM activities;
        `
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function createActivity({ name, description }) {
    
    try {
      const {
        rows: [activity],
      } = await client.query(
        `
          INSERT INTO activities(name, description) 
          VALUES($1, $2) 
          ON CONFLICT (name) DO NOTHING 
          RETURNING *;
        `,
        [name.toLowerCase(), description.toLowerCase()]
      );
  
      return activity;
    } catch (error) {
      throw error;
    }
  }

  async function updateActivity(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {
        rows: [activity],
      } = await client.query(
        `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
  
      return activity;
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    client,
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity,
  };