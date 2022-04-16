// require and re-export all files in this db directory (users, activities...)
const client = require('./client');
const {createActivity,
  getAllActivities,
  updateActivity,
  getActivityById,} = require('./activities');
const {addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,} = require('./routine_activities');
const {createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
  } =  require('./routines');

const {createUser, getUser, getUserById, getUserByUsername} =  require('./users');


module.exports = {
  client,
  createUser,
  getUserByUsername,
  createActivity,
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
  addActivityToRoutine,
  getUser,
  getUserById,
  updateActivity,
  getActivityById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
};
