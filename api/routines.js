const { requireUser } = require("./utils");
const express = require("express");
const routinesRouter = express.Router();
const { createRoutine, getAllPublicRoutines, updateRoutine, destroyRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine } = require("../db")

routinesRouter.get('/', async ( req, res, next) =>{
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    } catch (error){
        next (error);
    }
})

routinesRouter.post('/', requireUser, async ( req, res, next) => {
    try {
        const { name, goal, isPublic } = req.body
        const creatorId = req.user.id
        const newRoutine = await createRoutine({ creatorId, name, goal, isPublic});
        res.send (newRoutine);
    } catch (error) {
        next (error);
    }
})

routinesRouter.patch('/:routineId', requireUser, async (req, res, next)=>{
        const { routineId } = req.params
        const { isPublic, name, goal } = req.body
        const updateObj = { id:routineId }
        if (name){
            updateObj.name = name
        }
        if (goal){
            updateObj.goal = goal
        }
        if (typeof isPublic === 'boolean'){
            updateObj.isPublic = isPublic
        }
        try {
       
        const updatedRoutine = await updateRoutine( updateObj );
        res.send( updatedRoutine );
         
    } catch (error) {
        next(error);
    }
})

routinesRouter.delete('/:routineId', requireUser, async ( req, res, next) => {
    const { routineId } = req.params
    try {
        const deletedRoutine = await destroyRoutine(routineId);
        res.send(deletedRoutine);
    } catch (error) {
        next(error);
    }
})

routinesRouter.post('/:routineId/activities', requireUser, async( req, res, next) => {
    const { routineId } = req.params
    const { activityId, count, duration } = req.body
    const activityObj = { routineId, activityId, count, duration }
    const routineIdObj = { id:routineId }
    try {
        const newArr = await getRoutineActivitiesByRoutine(routineIdObj)
        const filteredNewArr = newArr.filter(( routineActivity )=>{
            return routineActivity.activityId === activityId
        })
        if ( filteredNewArr.length === 0){
            const newActivity = await addActivityToRoutine(activityObj);
            res.send(newActivity) 
        } else {
            next({ name: 'Activity Pair Error' , message: 'This activity already exists on this routine.'})
        }
               
    } catch (error) {
        next(error);
    }
})
module.exports = routinesRouter