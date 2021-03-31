import {
    userEmailSchema,
    postExerciseProgressSchema,
    updateExerciseProgressSchema,
    deleteExerciseProgressWithIdSchema,
    userOnCreate,
    userOnLogin
} from './userValidationSchema';

const validate = (schema: any, req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(200).json({ error });
    } else {
        next();
    }
}

const validateUserEmailSchema = (req, res, next) => {
    validate(userEmailSchema, req, res, next);
}

const validatePostExerciseProgressSchema = async (req, res, next) => {
    validate(
        postExerciseProgressSchema,
        req,
        res,
        next);
}

const validateUpdateExerciseProgressSchema = (req, res, next) => {
    validate(updateExerciseProgressSchema, req, res, next);
}

const validateDeleteExerciseProgressWithIdSchema = (req, res, next) => {
    validate(deleteExerciseProgressWithIdSchema, req, res, next);
}

const validateUserOnCreate = (req, res, next) => {
    validate(userOnCreate, req, res, next);
}

const validateUserOnLogin = (req, res, next) => {
    validate(userOnLogin, req, res, next);
}

export {
    validateDeleteExerciseProgressWithIdSchema,
    validateUpdateExerciseProgressSchema,
    validatePostExerciseProgressSchema,
    validateUserEmailSchema,
    validateUserOnCreate,
    validateUserOnLogin
}