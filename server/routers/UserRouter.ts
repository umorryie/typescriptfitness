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
const { getUser,
    postUser,
    postExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgressWithId,
    login,
    getFriends,
    addFriends,
    deleteFriends,
    confirmFriendship } = require('../controller/UserController');
const { validateUserByBody, validateFriend } = require('../validations/validateUser');
const { validateExercise } = require('../validations/validateExercise');
const { verifyToken } = require('../auth/tokenAuth');

// credentials 
userRouter.post('/user/register', validateUserOnCreate, postUser);
userRouter.post('/user/login', validateUserOnLogin, login);


// user progress data 
userRouter.get('/user/getUser', [verifyToken, validateUserByBody, validateUserEmailSchema], getUser);
userRouter.post('/user/postExerciseProgress', [verifyToken, validateUserByBody, validateExercise, validatePostExerciseProgressSchema], postExerciseProgress);
userRouter.put('/user/update/exerciseProgress', [verifyToken, validateUserByBody, validateUpdateExerciseProgressSchema], updateExerciseProgress);
userRouter.delete('/user/delete/exerciseProgress', [verifyToken, validateUserByBody, validateDeleteExerciseProgressWithIdSchema], deleteExerciseProgressWithId);

// friendships
userRouter.get('/friends', [verifyToken, validateUserByBody, validateUserEmailSchema], getFriends);
userRouter.post('/friends/add', [verifyToken, validateUserByBody, validateFriend], addFriends);
userRouter.delete('/friends/delete', [verifyToken, validateUserByBody, validateFriend], deleteFriends);

// friendships confirmations
userRouter.post('/friends/confirmation', [verifyToken, validateUserByBody], confirmFriendship);

export = {
    userRouter
}
