const connection = require('../database/connection');
const { getExerciseId, insertExercise } = require('../database/sql');

const validateExercise = (req, res, next) => {
    const { exerciseName } = req.body;
    connection.query(getExerciseId(exerciseName), (error, exercise) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(200).json({ error })
        } else {
            if (exercise.length == 0) {
                connection.query(insertExercise(exerciseName, true), (error, insertedExercise) => {
                    if (error) {
                        console.log(`Error retrieving user with error: ${error}`);
                        return res.status(200).json({ error });
                    }
                    const insertedId = insertedExercise.insertId;
                    if (insertedId) {
                        req.body.exerciseId = insertedId
                        next();
                    } else {
                        return res.status(200).json({ error: { message: 'Something went wrong when inserting exercise' } });
                    }
                });
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
