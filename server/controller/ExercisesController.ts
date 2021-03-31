const connection = require('../database/connection');
import ExerciseRepository from '../repository/ExerciseRepository';
const exerciseRepository = new ExerciseRepository(connection);

const getExercises = async (req, res) => {
    try {
        const exercises: any = await exerciseRepository.getExercisesNames();//, (error, exercises) => {
        const exercisesArray = exercises.map(exercise => {
            let exerciseObject = {
                name: exercise.name,
                isCustomExercise: exercise.isCustomExercise == 0 ? false : true
            }
            return exerciseObject;
        });
        res.status(200).json(exercisesArray);
    } catch (error) {
        res.status(200).json({ error });
    }
}

const createNewExercise = async (req, res) => {
    const { exerciseName, userEmail } = req.body;
    try {
        await exerciseRepository.insertExercise(exerciseName, true)
        const result: any = await exerciseRepository.insertCustomUserExercise(exerciseName, userEmail);
        res.status(202).json(result);
    } catch (error) {
        res.status(200).json({ error });
    }
}

export = {
    getExercises,
    createNewExercise
};
