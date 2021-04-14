const { convert } = require('../converters/exerciseDataConverter');
const connection = require('../database/connection');
import passwordHash from 'password-hash';
import UserRepository from '../repository/UserRepository';
const userRepository = new UserRepository(connection);
const { generateToken } = require('../auth/tokenAuth');
import { Request, Response } from 'express';

const getUser = async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    try {
        const userArray: any = await userRepository.getAllUsersInformation(userEmail);

        if (userArray.length == 0) {
            return res.status(200).json({ exercises: [], originalExercises: [] });
        }

        res.status(200).json(convert(userArray, userEmail))
    } catch (error) {
        res.status(200).json({ error });
    }
}

const postUser = async (req: Request, res: Response) => {
    const { userEmail, password, repassword } = req.body;

    if (password !== repassword) {
        return res.status(200).json({ error: { message: 'Passwords do not match' } });
    }
    const hashedPassword: string = passwordHash.generate(password);

    try {
        const result: any = await userRepository.insertUser(userEmail, hashedPassword);
        if (result.affectedRows === 1) {
            const token = generateToken({ userEmail });
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(202).json({ userEmail, token });
        } else {
            res.status(200).json({ error: { message: 'User was not inserted!' } });
        }
        //res.status(202).json(result);
    } catch (error) {
        res.status(200).json({ error });
    }
}

const postExerciseProgress = async (req: Request, res: Response) => {
    const {
        exerciseName,
        sets,
        weight,
        reps,
        userEmail,
        weightUnit,
        userId,
        exerciseId,
        date
    } = req.body;
    try {
        const exercises: any = await userRepository.getUsersExercise(userEmail, exerciseName);
        if (exercises.length == 0) {
            const insertedExercise: any = await userRepository.insertUserExercise(exerciseId, userId);
            const insertedId = insertedExercise.insertId;
            const result = await userRepository.insertExerciseProgress(insertedId, sets, reps, weight, weightUnit, date);
            res.status(202).json(result);
        } else {
            const result: any = await userRepository.insertExerciseProgress(exercises[0].id, sets, reps, weight, weightUnit, date);

            res.status(202).json(result);
        }
    } catch (error) {
        res.status(200).json({ error });
    }
}

const updateExerciseProgress = async (req: Request, res: Response) => {
    const {
        sets,
        reps,
        weight,
        weightUnit,
        exerciseProgressId,
        date
    } = req.body;
    try {
        const result: any = await userRepository.updateExerciseProgress(exerciseProgressId, sets, reps, weight, weightUnit, date);
        res.status(202).json(result);
    } catch (error) {
        res.status(200).json({ error });
    }

}

const deleteExerciseProgressWithId = async (req: Request, res: Response) => {
    const { exerciseProgressId } = req.body;

    try {
        const result: any = await userRepository.deleteExerciseProgress(exerciseProgressId);
        res.status(202).json(result);
    } catch (error) {
        res.status(200).json({ error });
    }
}

const login = async (req: Request, res: Response) => {
    const { userEmail, password } = req.body;

    try {
        const result: any = await userRepository.getUserPassword(userEmail);

        if (result && result.length == 0) {
            return res.status(200).json({ error: { message: "User with this email does not exist." } })
        }
        const passwordMatch = passwordHash.verify(password, result[0].password);
        if (passwordMatch) {
            const token = generateToken({ userEmail });
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({ match: true, token });
        } else {
            res.status(200).json({ error: { message: "Password do not match with this email.", match: false } });
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ error });
    }
}

const getFriends = async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
        const result: any = await userRepository.getFriends(userId);

        if (result && result.length > 0) {
            res.status(200).json({
                friends: result.map((friend: any) => {
                    return {
                        friendId: friend.friend_id,
                        confirmed: friend.confirmed === 1 ? true : false,
                        email: friend.email
                    }
                })
            });
        } else {
            res.status(200).json({ friends: [] });
        }
    } catch (error) {
        res.status(200).json({ error });
    }
};

const addFriends = async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;

    try {
        const result: any = await userRepository.addFriend(userId, friendId);

        if (result && result.length === 2 && result[0].affectedRows === 1 && result[1].affectedRows === 1) {
            res.status(202).json({ message: 'Friendship inserted.' });
        } else {
            res.status(200).json({ error: { message: 'Friend ship could not have been inserted.' } });
        }
    } catch (error) {
        res.status(200).json({ error });
    }
};

const deleteFriends = async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;

    try {
        const result: any = await userRepository.deleteFriendship(userId, friendId);

        if (result && result.length === 2 && result[0].affectedRows === 1 && result[1].affectedRows === 1) {
            res.status(200).json({ message: 'Friendship deleted.' });
        } else {
            res.status(200).json({ error: { message: 'Friend ship could not have been deleted.' } });
        }
    } catch (error) {
        res.status(200).json({ error });
    }
};

const confirmFriendship = async (req: Request, res: Response) => {
    const { friendshipId } = req.body;

    try {
        const result: any = await userRepository.confirmFriendship(friendshipId);

        if (result && result.affectedRows === 1) {
            res.status(200).json({ message: 'Friendship confirmed.' });
        } else {
            res.status(200).json({ error: { message: 'Friend ship could not have been confirmed.' } });
        }
    } catch (error) {
        res.status(200).json({ error });
    }
};

export = {
    getUser,
    postUser,
    postExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgressWithId,
    login,
    getFriends,
    addFriends,
    deleteFriends,
    confirmFriendship
};
