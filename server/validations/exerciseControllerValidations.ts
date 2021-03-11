import { createNewExerciseSchema } from './exerciseValidationSchema';

const validate = (schema: any, parameters: object, res, next) => {
    const { error, value } = schema.validate(parameters);
    if (error) {
        return res.status(400).json({ error });
    } else {
        next();
    }
}

const validateCreateNewExerciseSchema = (req, res, next) => {
    const { exerciseName, userEmail } = req.body;
    validate(createNewExerciseSchema, { userEmail, exerciseName }, res, next);
}

export {
    validateCreateNewExerciseSchema
}