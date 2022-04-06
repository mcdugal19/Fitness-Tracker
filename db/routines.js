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
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE id=$1;
      `,
      [routine]
    );

    const { rows } = await client.query(
      `
        SELECT activities.*,
        FROM activities
        LEFT JOIN routine_activities ON activities.id=routine_activities."activitiesId"
        SELECT routines.*, 
        FROM routines
        LEFT JOIN routine_activities ON routine.
        id=routine_activities."routineId"
      `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}
