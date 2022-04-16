const { requireUser } = require("./utils");
const express = require("express");
const routinesRouter = express.Router();
const { createRoutine, getAllPublicRoutines, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine } = require("../db")

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

module.exports = routinesRouter