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

async function updateRoutine({ id, isPublic, name, goal}) {
  console.log(id, 'testid line 27')
  try {
    const routineToBeUpdated = await getRoutineById(id)
    const {
      rows: [routine],
    } = await client.query(
      `
          UPDATE routines
          SET "isPublic"= (${isPublic}), name= (${name}), goal= (${goal})
          WHERE id=(${id})
          RETURNING *;
        `,
      [id, isPublic, name.toLowerCase(), goal.toLowerCase()]
    );
        console.log(routine, 'routine line 40')
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
      return attachActivitiesToRoutines(routines);
    }
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);

    if (user) {
      const { rows: routines } = await client.query(
        `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "creatorId" = $1 AND "isPublic" = true;
      `,
        [user.id]
      );

      return attachActivitiesToRoutines(routines);
    }
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity(activity) {
  const [id] = activity;
  try {
    const { rows : routines } = await client.query(
      `
      SELECT routines.*, routines.name AS "routineName", activities.name AS "activityName", users.username AS "creatorName", routine_activities.* 
      FROM routines, users, routine_activities
      JOIN activities ON routine_activities."activityId"=activities.id
      WHERE "isPublic"=true AND "activityId"=$1
      `,
      [id.id]
    );

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updateRoutine,
  getRoutinesWithoutActivities,
  getRoutineById,
  getAllRoutines,
  createRoutine,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
};
