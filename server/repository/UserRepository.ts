const {
    getAllUsersInformation,
    insertUser,
    getUsersExercise,
    insertUserExercise,
    insertExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgress,
    getUserPassword,
    getFriends,
    addFriend,
    deleteFriendship,
    confirmFriendship } = require('../database/sql');
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

    insertUser(userEmail: string, password: string, firstName: string, lastName: string) {
        return new Promise((resolve, reject) => {
            this.db.query(insertUser(userEmail, password, firstName, lastName), (error, result) => {
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

    updateExerciseProgress(exerciseProgressId: number, sets: number, reps: number, weight: number, weightUnit: string, date: (string | null)) {
        return new Promise((resolve, reject) => {
            this.db.query(updateExerciseProgress(exerciseProgressId, sets, reps, weight, weightUnit, date), (error, result) => {
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

    insertExerciseProgress(userExerciseId: number, sets: number, reps: number, weight: number, weightUnit: string, date: (string | null)) {
        return new Promise((resolve, reject) => {
            this.db.query(insertExerciseProgress(userExerciseId, sets, reps, weight, weightUnit, date), (error, result) => {
                if (error) {
                    console.log(`Error inserting users exercises for user with error: ${error}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    getUserPassword(userEmail: string) {
        return new Promise((resolve, reject) => {
            this.db.query(getUserPassword(userEmail), (error, result) => {
                if (error) {
                    console.log(`Error getting password for user ${userEmail}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    getFriends(userId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(getFriends(userId), (error, result) => {
                if (error) {
                    console.log(`Error getting friendships for user with id ${userId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    addFriend(userId: number, friendId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(addFriend(userId, friendId), (error, result) => {
                if (error) {
                    console.log(`Error adding friendships for user with id ${userId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    deleteFriendship(userId: number, friendId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(deleteFriendship(userId, friendId), (error, result) => {
                if (error) {
                    console.log(`Error deleting friendships for user with id ${userId}`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    confirmFriendship(friendshipId: number, userId: number, friendId: number) {
        return new Promise((resolve, reject) => {
            this.db.query(confirmFriendship(friendshipId, userId, friendId), (error, result) => {
                if (error) {
                    console.log(`Error confirming friendships`);
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}