import express from 'express';
import {
    validateDeleteExerciseProgressWithIdSchema,
    validateUpdateExerciseProgressSchema,
    validatePostExerciseProgressSchema,
    validateUserEmailSchema,
    validateUserOnCreate,
    validateUserOnLogin,
    validateFriendAddOrEdit,
    validateFriendshipConfirmationSchema,
    validateFriendDelete
} from '../validations/userControllerValidations';
const { validateFriendConfirmationLegality } = require('../validations/validateFriendConfirmationLegality');
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
    confirmFriendship,
    getAllUsers } = require('../controller/UserController');
const { validateUserByBody, validateFriend } = require('../validations/validateUser');
const { validateExercise } = require('../validations/validateExercise');
const { verifyToken } = require('../auth/tokenAuth');
const { validateAddingFriendLegality } = require('../validations/validateAddingFriendLegality')

// credentials 
userRouter.post('/user/register', validateUserOnCreate, postUser);
userRouter.post('/user/login', validateUserOnLogin, login);


// user progress data 
userRouter.get('/user/getUser', [verifyToken, validateUserByBody, validateUserEmailSchema], getUser);
userRouter.get('/all', [verifyToken, validateUserByBody, validateUserEmailSchema], getAllUsers);
userRouter.post('/user/postExerciseProgress', [verifyToken, validateUserByBody, validateExercise, validatePostExerciseProgressSchema], postExerciseProgress);
userRouter.put('/user/update/exerciseProgress', [verifyToken, validateUserByBody, validateUpdateExerciseProgressSchema], updateExerciseProgress);
userRouter.delete('/user/delete/exerciseProgress', [verifyToken, validateUserByBody, validateDeleteExerciseProgressWithIdSchema], deleteExerciseProgressWithId);

// friendships
userRouter.get('/friends', [verifyToken, validateUserByBody, validateUserEmailSchema], getFriends);
userRouter.post('/friends/add', [verifyToken, validateUserByBody, validateFriend, validateAddingFriendLegality, validateFriendAddOrEdit], addFriends);
userRouter.delete('/friends/delete', [verifyToken, validateUserByBody, validateFriend, validateFriendDelete], deleteFriends);

// friendships confirmations
userRouter.put('/friends/confirmation', [verifyToken, validateUserByBody, validateFriendshipConfirmationSchema, validateFriendConfirmationLegality], confirmFriendship);

export = {
    userRouter
}
