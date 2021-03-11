import joi from 'joi';

const createNewExerciseSchema = joi.object({
    userEmail: joi.string().email().required(),
    exerciseName: joi.string().required()
});

export {
    createNewExerciseSchema,
}