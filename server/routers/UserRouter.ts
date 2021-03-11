import express from 'express';
import {
    validateDeleteExerciseProgressWithIdSchema,
    validateUpdateExerciseProgressSchema,
    validatePostExerciseProgressSchema,
    validateUserEmailSchema,
    validateUserEmailOnCreate
} from '../validations/userControllerValidations';
const userRouter = express.Router();
const {getUser, postUser, postExerciseProgress, updateExerciseProgress, deleteExerciseProgressWithId} = require('../controller/UserController');
const {validateUserByBody} = require('../validations/validateUser');
const {validateExercise} = require('../validations/validateExercise');
const {verifyToken} = require('../auth/tokenAuth');

userRouter.get('/user/getUser', [verifyToken, validateUserByBody, validateUserEmailSchema], getUser);
userRouter.post('/user/create', validateUserEmailOnCreate, postUser);
userRouter.post('/user/postExerciseProgress', [verifyToken, validateUserByBody, validateExercise, validatePostExerciseProgressSchema], postExerciseProgress);
userRouter.put('/user/update/exercise', [verifyToken, validateUserByBody, validateUpdateExerciseProgressSchema], updateExerciseProgress);
userRouter.delete('/user/delete/exercise', [verifyToken, validateUserByBody, validateDeleteExerciseProgressWithIdSchema], deleteExerciseProgressWithId);

export = {
    userRouter
}
