const { convert } = require('../converters/exerciseDataConverter');
const connection = require('../database/connection');
import UserRepository from '../repository/UserRepository';
const userRepository = new UserRepository(connection);

const getUser = async (req, res) => {
    const { userEmail } = req.body;
    try {
        const userArray: any = await userRepository.getAllUsersInformation(userEmail);

        if (userArray.length == 0) {
            return res.status(200).json(`User: ${userEmail} do not have any exercises yet!`)
        }

        res.status(200).json(convert(userArray, userEmail))
    } catch (error) {
        res.status(404).json({ error });
    }
}

const postUser = async (req, res) => {
    const { userEmail } = req.body;
    try {
        const result: any = await userRepository.insertUser(userEmail);
        res.status(202).json(result);
    } catch (error) {
        res.status(404).json(error);
    }
}

const postExerciseProgress = async (req, res) => {
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
    try {
        const exercises: any = await userRepository.getUsersExercise(userEmail, exerciseName);
        if (exercises.length == 0) {
            const insertedExercise: any = await userRepository.insertUserExercise(exerciseId, userId);
            const insertedId = insertedExercise.insertId;
            const result = await userRepository.insertExerciseProgress(insertedId, sets, reps, weight, weightUnit);
            res.status(202).json(result);
        } else {
            const result: any = await userRepository.insertExerciseProgress(exercises[0].id, sets, reps, weight, weightUnit);

            res.status(202).json(result);
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

const updateExerciseProgress = async (req, res) => {
    const {
        sets,
        reps,
        weight,
        weightUnit,
        exerciseProgressId
    } = req.body;
    try {
        const result: any = await userRepository.updateExerciseProgress(exerciseProgressId, sets, reps, weight, weightUnit);
        res.status(202).json(result);
    } catch (error) {
        res.status(404).json(error);
    }

}

const deleteExerciseProgressWithId = async (req, res) => {
    const { exerciseProgressId } = req.body;

    try {
        const result: any = await userRepository.deleteExerciseProgress(exerciseProgressId);
        res.status(202).json(result);
    } catch (error) {
        res.status(404).json(error);
    }
}

export = {
    getUser,
    postUser,
    postExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgressWithId
};
