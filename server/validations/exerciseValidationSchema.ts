import joi from 'joi';

const createNewExerciseSchema = joi.object({
    userEmail: joi.string().email().required(),
    exerciseName: joi.string().required(),
    userId: joi.number().required()
});

export {
    createNewExerciseSchema,
}