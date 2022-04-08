// const { getAllPublicRoutines } = require(".");
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const { getUserByUsername } = require("./users");

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
    } = await client.query(
      `
        SELECT id, "creatorId", name, goal, "isPublic"
        FROM routines
        WHERE id=$1
      `,
      [id]
    );

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
    const { rows } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id;
    `);
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "isPublic" = true;
      `);
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  // console.log(user, 'test user line:91')
  try {
    const user = await getUserByUsername(username);
    if (user) {
      const { rows: routines } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "creatorId" = $1
      `,
      [user.id]
      );

      console.log(routines, "test rows line:105");
      return attachActivitiesToRoutines(routines);
    }
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const {
      rows: [username],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE "creatorId" = ${username} AND "isPublic" = true
      Returning *;
    `,
      [username]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const {
      rows: [username],
    } = await client.query(
      `
      SELECT activities.*,routine_activities.duration, routine_activities.count,  routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."activityId" = (${id})
      RETURNING *; 
    `,
      [id]
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
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
};
