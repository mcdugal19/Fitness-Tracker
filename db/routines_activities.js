const client = require("./client");

async function addActivitiesToRoutines({ routineId, activityId, count, duration }) {
    try {
        const { rows: [routine_activity] } = await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [routineId, activityId, count, duration]
        )
    return routine_activity;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addActivitiesToRoutines, 
  };