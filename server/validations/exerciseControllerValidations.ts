import { createNewExerciseSchema } from './exerciseValidationSchema';

const validate = (schema: any, req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(200).json({ error });
    } else {
        next();
    }
}

const validateCreateNewExerciseSchema = (req, res, next) => {
    validate(createNewExerciseSchema, req, res, next);
}

export {
    validateCreateNewExerciseSchema
}