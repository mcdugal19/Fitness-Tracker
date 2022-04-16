const { requireUser } = require("./utils");
const express = require("express");
const activitiesRouter = express.Router();

const { createActivity, getAllActivities, updateActivity, getPublicRoutinesByActivity, getActivityById } = require("../db") 

activitiesRouter.use((req, res, next) => {
    console.log("Request from activities");
    next();
})

activitiesRouter.get("/", async (req, res, next) => {
    try {
        const activity = await getAllActivities();
        res.send(activity);
    } catch (error) {
        next (error);
    }
})

activitiesRouter.post('/', requireUser, async (req, res, next)=> {
    const { name, description } = req.body;
    try {
        const activity = await createActivity({ name, description });
        res.send(activity);
    } catch (error) {
        next (error);
    }
})

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params
    const { name, description } = req.body
    const updateObj = { id:activityId }
    if (name){
        updateObj.name = name
    }
    if (description){
        updateObj.description = description
    }
    try {
        const updatedActivity = await updateActivity(updateObj);
        res.send( updatedActivity );
    } catch (error) {
        next(error);
    }
})

activitiesRouter.get('/:activityId/routines', async (req, res, next) =>{
    const { activityId } = req.params
    try {
        const publicRoutines = await getPublicRoutinesByActivity({id:activityId});
        console.log('publicRoutines: ',publicRoutines)
        res.send(publicRoutines);
    } catch (error) {
        next(error);
    }
})

module.exports = activitiesRouter;