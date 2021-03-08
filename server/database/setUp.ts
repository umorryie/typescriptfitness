const fs = require('fs');
const path = require('path');
import connection from './connection';
const {
    insertExercise,
    createSchema,
} = require('./sql');

const getExercises = () => {
    const exercises = fs.readFileSync('../../server/exercises.json');
    const jsonExercises = JSON.parse(exercises);
    return Object.keys(jsonExercises);
}

const setUpTables = async (dbConnection) => {
    try {
        const file = fs.readFileSync(path.join(__dirname, '../../server/database/createDataBase.sql')).toString();

        await dbConnection.query(file, (error, result) => {
            if (error) {
                console.log(error)
            }
            setUpExercises(dbConnection);
        });
    } catch (error) {
        console.log(`Setting up tables error: ${error}`)
        return error;
    }
}

const setUpExercises = async (dbConnection) => {
    try {
        const exercises = getExercises();
        for (let index = 0; index < exercises.length; index++) {
            const exerciseName = exercises[index].toLowerCase();
            await dbConnection.query(insertExercise(exerciseName, false));
        }
    } catch (error) {
        console.log(`Setting up exercises error: ${error}`)
        return error;
    }
}

const setUpDataBase = async (dbConnection) => {
    try {
        await setUpTables(dbConnection);
    } catch (error) {
        console.log(`Setting up database error: ${error}`)
        return error;
    }
}

const createFitnessSchema = (dbConnection) => {
    dbConnection.query(createSchema, (error, result) => {
        if (error) {
            console.log(error)
        }
    });
}

/*
** STEPS TO CREATE DATABASE:
** 1) create schema in database with connection where database is not defined
**  
** EXAMPLE: createFitnessSchema(connection);
**
** 2) add database to connection and create tables
**
** EXAMPLE: setUpDataBase(connection);
**
*/


// createFitnessSchema(connection);
// setUpDataBase(connection);
