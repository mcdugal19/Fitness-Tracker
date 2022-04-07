// const { getAllPublicRoutines } = require(".");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
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
    //   `
    // );

    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM activities
        FULL JOIN routines;
      `
    );
    console.log(routine, "test line:80");
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const {
      rows: [publicRoutines],
    } = await client.query(`
        SELECT *
        FROM routines
        WHERE "isPublic" = true
        RETURNING *;
      `);
    console.log(publicRoutines, "test line:80");
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
  getAllPublicRoutines,
};
