const { requireUser } = require("./utils");
const express = require("express");
const routine_activitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineActivityById,  getRoutineById, destroyRoutineActivity } = require("../db");


routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next)=>{
    const { routineActivityId }  = req.params
    const { count, duration } = req.body
    const updateObj = { id:routineActivityId, count, duration }

    try {
        const routineActivity = await getRoutineActivityById( routineActivityId );
        const routineId = routineActivity.routineId
       const routine = await getRoutineById( routineId ); 

        if (routine.creatorId === req.user.id){
            const updatedActivity = await updateRoutineActivity( updateObj )
            console.log('updatedActivity: ', updatedActivity)
            res.send(updatedActivity)
        } else {
            next({name: 'UserAuthError', message: 'You must be the creator to update this routine'})
        }  
    } catch (error) {
        next(error);
    }
}
)

routine_activitiesRouter.delete('/:routineActivityId', requireUser, async ( req, res, next)=>{
    const { routineActivityId } = req.params
    try {
        const routineActivity = await getRoutineActivityById( routineActivityId );
        const routineId = routineActivity.routineId
       const routine = await getRoutineById( routineId );

        if( routine.creatorId === req.user.id){
            const deletedRoutineActivity = await destroyRoutineActivity( routineActivityId );
            console.log('deleted: ', deletedRoutineActivity)
            res.send(deletedRoutineActivity)
        } else {next({ name: 'UserAuthError' , message:'You must be the routine creator to delete this activity' })
        }
         
    } catch (error) {
        next(error);
    }
})


module.exports = routine_activitiesRouter