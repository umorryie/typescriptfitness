import joi from 'joi';

const userEmailSchema = joi.object({
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
});

const postExerciseProgressSchema = joi.object({
    exerciseName: joi.string().required(),
    sets: joi.number().integer().required().min(1),
    weight: joi.number().integer().required().min(1),
    reps: joi.number().integer().required().min(1),
    userEmail: joi.string().email().required(),
    weightUnit: joi.string().required(),
    userId: joi.number().integer().required(),
    exerciseId: joi.number().integer().required(),
    date: joi.string()
});

const updateExerciseProgressSchema = joi.object({
    sets: joi.number().integer().required().min(1),
    weight: joi.number().integer().required().min(1),
    reps: joi.number().integer().required().min(1),
    weightUnit: joi.string().required(),
    exerciseProgressId: joi.number().integer().required(),
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
    date: joi.string()
});

const deleteExerciseProgressWithIdSchema = joi.object({
    exerciseProgressId: joi.number().integer().required(),
    userEmail: joi.string().email().required(),
    userId: joi.number().integer().required(),
});

const userOnCreate = joi.object({
    userEmail: joi.string().email().required(),
    password: joi.string().required().min(8),
    repassword: joi.string().required().min(8),
});

const userOnLogin = joi.object({
    userEmail: joi.string().email().required(),
    password: joi.string().required().min(8)
});

export {
    userEmailSchema,
    postExerciseProgressSchema,
    updateExerciseProgressSchema,
    deleteExerciseProgressWithIdSchema,
    userOnCreate,
    userOnLogin
}