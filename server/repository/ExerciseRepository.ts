const { getExercisesNames, insertExercise, insertCustomUserExercise } = require('../database/sql');
import { IExerciseRepository } from '../interfaces/IExerciseRepository';

export default class ExerciseRepository implements IExerciseRepository {
    constructor(db) {
        this.db = db;
    }

    db: any;

    getExercisesNames() {
        return new Promise((resolve, reject) => {
            this.db.query(getExercisesNames, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    insertExercise(exerciseName: string, isCustomExercise: boolean) {
        return new Promise((resolve, reject) => {
            this.db.query(insertExercise(exerciseName, isCustomExercise), (error, result) => {
                if (error) {
                    console.log(`Error inserting exercise: ${exerciseName}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    insertCustomUserExercise(exerciseName: string, userEmail: string) {
        return new Promise((resolve, reject) => {
            this.db.query(insertCustomUserExercise(exerciseName, userEmail), (error, result) => {
                if (error) {
                    console.log(`Error inserting exerciseUser with user: ${userEmail}, and exercise name: ${exerciseName}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    customQuery(queryString) {
        return new Promise((resolve, reject) => {
            this.db.query(queryString, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}