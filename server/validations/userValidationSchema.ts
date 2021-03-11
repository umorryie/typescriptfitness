import joi from 'joi';

const userEmailSchema = joi.object({
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
});

const postExerciseProgressSchema = joi.object({
    exerciseName: joi.string().required(),
    sets: joi.number().integer().required(),
    weight: joi.number().integer().required(),
    reps: joi.number().integer().required(),
    userEmail: joi.string().email().required(),
    weightUnit: joi.string().required(),
    userId: joi.number().integer().required(),
    exerciseId: joi.number().integer().required(),
});

const updateExerciseProgressSchema = joi.object({
    sets: joi.number().integer().required(),
    weight: joi.number().integer().required(),
    reps: joi.number().integer().required(),
    weightUnit: joi.string().required(),
    exerciseProgressId: joi.number().integer().required(),
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
});

const deleteExerciseProgressWithIdSchema = joi.object({
    exerciseProgressId: joi.number().integer().required(),
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
});

const userEmailOnCreate = joi.object({
    userEmail: joi.string().email().required()
});

export {
    userEmailSchema,
    postExerciseProgressSchema,
    updateExerciseProgressSchema,
    deleteExerciseProgressWithIdSchema,
    userEmailOnCreate
}