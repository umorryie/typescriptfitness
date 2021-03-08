const {
    getAllUsersInformation,
    insertUser,
    getUsersExercise,
    insertUserExercise,
    insertExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgress
} = require('../database/sql');
const { convert } = require('../converters/exerciseDataConverter');
const connection = require('../database/connection');

const getUser = (req, res) => {
    const { userEmail } = req.body;
    connection.query(getAllUsersInformation(userEmail), (error, userArray) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            return res.status(404).json({ error })
        }
        if (userArray.length == 0) {
            console.log(`Error retrieving user with error: ${error}`);
            return res.status(200).json(`User: ${userEmail} do not have any exercises yet!`)
        }

        res.status(200).json(convert(userArray, userEmail))
    });
}

const postUser = (req, res) => {
    const { userEmail } = req.body;
    connection.query(insertUser(userEmail), (error, response) => {
        if (error) {
            console.log(`Error inserting user ${userEmail} with error: ${error}`);
            res.status(404).json({ error })
        } else {
            res.status(201).json(response)
        }
    });
}

const postExerciseProgress = (req, res) => {
    const {
        exerciseName,
        sets,
        weight,
        reps,
        userEmail,
        weightUnit,
        userId,
        exerciseId
    } = req.body;

    connection.query(getUsersExercise(userEmail, exerciseName), (error, exercises) => {
        if (error) {
            console.log(`Error getting users exercises for user: ${userEmail} with error: ${error}`);
            return res.status(404).json({ error });
        }

        if (exercises.length == 0) {
            connection.query(insertUserExercise(exerciseId, userId), (error, result) => {
                if (error) {
                    console.log(`Error inserting users exercises for user: ${userEmail} with error: ${error}`);
                    return res.status(404).json({ error });
                } else {
                    const insertedId = result.insertId;
                    connection.query(insertExerciseProgress(insertedId, sets, reps, weight, weightUnit), (error, result) => {
                        if (error) {
                            console.log(`Error inserting users exercises for user: ${userEmail} with error: ${error}`);
                            return res.status(404).json({ error });
                        }
                        res.json(result);
                    })
                }
            })
        } else {
            connection.query(insertExerciseProgress(exercises[0].id, sets, reps, weight, weightUnit), (error, result) => {
                if (error) {
                    console.log(`Error inserting users exercises for user: ${userEmail} with error: ${error}`);
                    return res.status(404).json({ error });
                }
                res.json(result);
            })
        }
    });
}

const modifyExerciseProgress = (req, res) => {
    const {
        sets,
        reps,
        weight,
        weightUnit,
        exerciseProgressId
    } = req.body;

    connection.query(updateExerciseProgress(exerciseProgressId, sets, reps, weight, weightUnit), (error, result) => {
        if (error) {
            console.log(`Error updating progress for exercise with id: ${exerciseProgressId}`);
            return res.status(404).json({ error });
        }
        res.json(result);
    })
}

const deleteExerciseProgressWithId = (req, res) => {
    const { exerciseProgressId } = req.body;

    connection.query(deleteExerciseProgress(exerciseProgressId), (error, result) => {
        if (error) {
            console.log(`Error deleting exercise progress for exercise with id: ${exerciseProgressId}`);
            return res.status(404).json({ error });
        }
        res.status(202).json(result);
    })
}

export = {
    getUser,
    postUser,
    postExerciseProgress,
    modifyExerciseProgress,
    deleteExerciseProgressWithId
};
