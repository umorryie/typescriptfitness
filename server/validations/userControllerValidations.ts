import {
    userEmailSchema,
    postExerciseProgressSchema,
    updateExerciseProgressSchema,
    deleteExerciseProgressWithIdSchema,
    userEmailOnCreate
} from './userValidationSchema';

const validate = (schema: any, req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error });
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

const validateUserEmailOnCreate = (req, res, next) => {
    validate(userEmailOnCreate, req, res, next);
}

export {
    validateDeleteExerciseProgressWithIdSchema,
    validateUpdateExerciseProgressSchema,
    validatePostExerciseProgressSchema,
    validateUserEmailSchema,
    validateUserEmailOnCreate
}