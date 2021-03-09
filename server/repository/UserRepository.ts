const {
    getAllUsersInformation,
    insertUser,
    getUsersExercise,
    insertUserExercise,
    insertExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgress } = require('../database/sql');
import { IUserRepository } from '../interfaces/IUserRepository';

export default class UserRepository implements IUserRepository {
    constructor(db) {
        this.db = db;
    }

    db: any;

    getAllUsersInformation(userEmail: string) {
        return new Promise((resolve, reject) => {
            this.db.query(getAllUsersInformation(userEmail), (error, result) => {
                if (error) {
                    console.log(`Error retrieving user with error: ${error}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    insertUser(userEmail: string) {
        return new Promise((resolve, reject) => {
            this.db.query(insertUser(userEmail), (error, result) => {
                if (error) {
                    console.log(`Error inserting user ${userEmail} with error: ${error}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    getUsersExercise(userEmail: string, exerciseName: string) {
        return new Promise((resolve, reject) => {
            this.db.query(getUsersExercise(userEmail, exerciseName), (error, result) => {
                if (error) {
                    console.log(`Error getting users exercises for user: ${userEmail} with error: ${error}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    deleteExerciseProgress(exerciseProgressId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(deleteExerciseProgress(exerciseProgressId), (error, result) => {
                if (error) {
                    console.log(`Error deleting exercise progress for exercise with id: ${exerciseProgressId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    updateExerciseProgress(exerciseProgressId: number, sets: number, reps: number, weight: number, weightUnit: string) {
        return new Promise((resolve, reject) => {
            this.db.query(updateExerciseProgress(exerciseProgressId, sets, reps, weight, weightUnit), (error, result) => {
                if (error) {
                    console.log(`Error updating progress for exercise with id: ${exerciseProgressId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    insertUserExercise(exerciseId: number, userId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(insertUserExercise(exerciseId, userId), (error, result) => {
                if (error) {
                    console.log(`Error inserting exerciseUser with userID: ${userId}, and exercise ID: ${exerciseId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    insertExerciseProgress(userExerciseId: number, sets: number, reps: number, weight: number, weightUnit: string) {
        return new Promise((resolve, reject) => {
            this.db.query(insertExerciseProgress(userExerciseId, sets, reps, weight, weightUnit), (error, result) => {
                if (error) {
                    console.log(`Error inserting users exercises for user with error: ${error}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}