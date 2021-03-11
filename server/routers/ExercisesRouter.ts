import express from 'express';
import {validateCreateNewExerciseSchema} from '../validations/exerciseControllerValidations';
const exercisesRouter = express.Router();
const {getExercises, createNewExercise} = require('../controller/ExercisesController');
const {validateUserByBody} = require('../validations/validateUser');
const {verifyToken} = require('../auth/tokenAuth');

exercisesRouter.get('/getExercises/', getExercises);
exercisesRouter.post('/create/newExercise', [verifyToken, validateUserByBody, validateCreateNewExerciseSchema], createNewExercise);

export = {
    exercisesRouter
}
