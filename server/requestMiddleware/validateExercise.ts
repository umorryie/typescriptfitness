const connection = require('../database/connection');
const {getExerciseId} = require('../database/sql');

const validateExercise = (req, res, next) => {
    const {exerciseName} = req.body;
    connection.query(getExerciseId(exerciseName), (error, exercise) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(404).json({error})
        } else {
            if (exercise.length == 0) {
                console.log(`No exercise: ${exerciseName}`);
                res.status(404).json(`No exercise: ${exerciseName}`);
            } else {
                req.body.exerciseId = exercise[0].id;
                next();
            }
        }
    });
}

export = {
    validateExercise
};
