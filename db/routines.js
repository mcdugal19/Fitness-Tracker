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
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, isPublic, name, goal}) {
    try {
    const {
      rows: [routine],
    } = await client.query(
      `  
          UPDATE routines
          SET name=COALESCE($3, name), goal=COALESCE($4, goal), "isPublic"=COALESCE($2, "isPublic")
          WHERE id=$1
          RETURNING *;
        `,
        [id, isPublic, name, goal]
    );
    return routine;

  } 
  catch (error) {
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

async function getPublicRoutinesByActivity({ id }) {

  try {
    const allPublic = await getAllPublicRoutines();
    const newArr = allPublic.filter((routine)=>{
      for(let activity of routine.activities){
        return activity.activityId === id
      }
    })
    return newArr ;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
          DELETE
          FROM routines
          WHERE id=$1
          RETURNING *;
        `,
      [id]
    );
    const {
      rows: [routines],
    } = await client.query(
      `
          DELETE
          FROM routine_activities
          WHERE "routineId"=$1
          RETURNING *;
        `,
      [id]
    );

    return routines;
  } catch (error) {
    throw error
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
  destroyRoutine,
};
