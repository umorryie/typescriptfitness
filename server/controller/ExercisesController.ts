const {getExercisesNames, insertExercise, insertCustomUserExercise} = require('../database/sql');
const connection = require('../database/connection');

const getExercises = (req, res) => {
    connection.query(getExercisesNames, (error, exercises) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(404).json({error})
        } else {
            const exercisesArray = exercises.map(exercise => {
                let exerciseObject = {
                    name: exercise.name,
                    isCustomExercise: exercise.isCustomExercise == 0 ? false : true
                }
                return exerciseObject;
            });
            res.status(200).json(exercisesArray);
        }
    });
}

const createNewExercise = (req, res) => {
    const {exerciseName, userEmail} = req.body;
    connection.query(insertExercise(exerciseName, true), (error, result) => {
        if (error) {
            console.log(`Error inserting exercise: ${exerciseName}`);
            return res.status(404).json({error});
        }

        connection.query(insertCustomUserExercise(exerciseName, userEmail), (error, result) => {
            if (error) {
                console.log(`Error inserting exerciseUser with user: ${userEmail}, and exercise name: ${exerciseName}`);
                return res.status(404).json({error});
            }
            res.status(202).json(result);
        })
    })
}

export = {
    getExercises,
    createNewExercise
};
