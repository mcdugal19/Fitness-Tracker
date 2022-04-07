const client = require("./client");

async function createRoutine(
  { creatorId, 
    isPublic,
     name, 
     goal }) 
{
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
          INSERT INTO routines ("creatorId", "isPublic", name, goal) 
          VALUES($1, $2, $3, $4) 
          ON CONFLICT (name) DO NOTHING 
          RETURNING *;
        `,
      [creatorId, isPublic, name.toLowerCase(), goal.toLowerCase()]
    );
    console.log(routine, 'testroutine line:17')
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
        SELECT id, "creatorId", name, goal, "isPublic"
        FROM routines
        WHERE id=${id}
      `);

    if (!routine) {
      return null;
    }

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `SELECT id, "creatorId", name, "isPublic", goal
          FROM routines
        `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    // const {
    //   rows: [routine],
    // } = await client.query(
    //   `
    //     SELECT *
    //     FROM routines
    //   `,
    //   [routine]
    // );

    const { rows } = await client.query(
      `
        SELECT *
        FROM routines,
        LEFT JOIN activities
        ON routines.* = activities.*;
      `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutinesWithoutActivities,
  getRoutineById,
  getAllRoutines,
  createRoutine,
};