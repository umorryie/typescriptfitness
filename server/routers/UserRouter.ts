import express from 'express';
import {
    validateDeleteExerciseProgressWithIdSchema,
    validateUpdateExerciseProgressSchema,
    validatePostExerciseProgressSchema,
    validateUserEmailSchema,
    validateUserOnCreate,
    validateUserOnLogin
} from '../validations/userControllerValidations';
const userRouter = express.Router();
const { getUser, postUser, postExerciseProgress, updateExerciseProgress, deleteExerciseProgressWithId, login } = require('../controller/UserController');
const { validateUserByBody } = require('../validations/validateUser');
const { validateExercise } = require('../validations/validateExercise');
const { verifyToken } = require('../auth/tokenAuth');

userRouter.get('/user/getUser', [verifyToken, validateUserByBody, validateUserEmailSchema], getUser);
userRouter.post('/user/register', validateUserOnCreate, postUser);
userRouter.post('/user/postExerciseProgress', [verifyToken, validateUserByBody, validateExercise, validatePostExerciseProgressSchema], postExerciseProgress);
userRouter.post('/user/login', validateUserOnLogin, login);
userRouter.put('/user/update/exerciseProgress', [verifyToken, validateUserByBody, validateUpdateExerciseProgressSchema], updateExerciseProgress);
userRouter.delete('/user/delete/exerciseProgress', [verifyToken, validateUserByBody, validateDeleteExerciseProgressWithIdSchema], deleteExerciseProgressWithId);

export = {
    userRouter
}
