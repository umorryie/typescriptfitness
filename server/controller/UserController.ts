const { convert } = require('../converters/exerciseDataConverter');
const connection = require('../database/connection');
import passwordHash from 'password-hash';
import UserRepository from '../repository/UserRepository';
const userRepository = new UserRepository(connection);
const { generateToken } = require('../auth/tokenAuth');

const getUser = async (req, res) => {
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

const postUser = async (req, res) => {
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

const postExerciseProgress = async (req, res) => {
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

const updateExerciseProgress = async (req, res) => {
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

const deleteExerciseProgressWithId = async (req, res) => {
    const { exerciseProgressId } = req.body;

    try {
        const result: any = await userRepository.deleteExerciseProgress(exerciseProgressId);
        res.status(202).json(result);
    } catch (error) {
        res.status(200).json({ error });
    }
}

const login = async (req, res) => {
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
            res.status(202).json({ match: true, token });
        } else {
            res.status(202).json({ error: { message: "Password do not match with this email.", match: false } });
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ error });
    }
}

export = {
    getUser,
    postUser,
    postExerciseProgress,
    updateExerciseProgress,
    deleteExerciseProgressWithId,
    login
};
