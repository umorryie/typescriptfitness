import express from 'express';
const userRouter = express.Router();
const {getUser, postUser, postExerciseProgress, modifyExerciseProgress, deleteExerciseProgressWithId} = require('../controller/UserController');
const {validateUserByBody} = require('../validations/validateUser');
const {validateExercise} = require('../requestMiddleware/validateExercise');
const {verifyToken} = require('../auth/tokenAuth');

userRouter.get('/user/getUser', [verifyToken, validateUserByBody], getUser);
userRouter.post('/user/create', postUser);
userRouter.post('/user/postExerciseProgress', [verifyToken, validateUserByBody, validateExercise], postExerciseProgress);
userRouter.put('/user/update/exercise', [verifyToken, validateUserByBody], modifyExerciseProgress);
userRouter.delete('/user/delete/exercise', [verifyToken, validateUserByBody], deleteExerciseProgressWithId);

export = {
    userRouter
}
