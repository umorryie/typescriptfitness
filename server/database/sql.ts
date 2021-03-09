const createSchema: string = `create schema fitness`;

const selectFitnessSchema: string = 'use fitness;';

const getExercisesNames: string = 'select name, is_custom_exercise as isCustomExercise from exercises;';

const insertUser = (userEmail: string): string => {
    return `insert into users (email) values ('${userEmail}')`;
};

const insertExercise = (exerciseName: string, isCustomExercise: boolean): string => {
    return `insert into exercises (name, is_custom_exercise) values ('${exerciseName}', ${isCustomExercise})`;
}

const getUserByEmail = (userEmail: string): string => {
    return `select * from users where email = '${userEmail}'`;
};

const getUsersExercise = (userEmail: string, exerciseName: string): string => {
    return `
    select * from users_exercises ue 
    where ue.user_id = (
        select id from users where email = '${userEmail}') 
        and ue.exercise_id = (
            select id from exercises e2 where name = '${exerciseName}'
        )`;
};

const insertUserExercise = (exerciseId: number, userId: number): string => {
    return `insert into users_exercises (exercise_id, user_id) values ('${exerciseId}', '${userId}')`;
}

const insertCustomUserExercise = (exerciseName: string, userEmail: string): string => {
    return `
        insert into users_exercises (exercise_id, user_id)
        values (
            (select id from exercises where name = '${exerciseName}'),
            (select id from users where email = '${userEmail}')
        )`;
}

const insertExerciseProgress = (userExerciseId: number, sets: number, reps: number, weight: number, weightUnit: string): string => {
    return `
        insert into exercise_progress (user_exercise_id, \`sets\`, reps, weight, weight_unit, date)
        values (${userExerciseId}, ${sets}, ${reps}, ${weight}, '${weightUnit}', NOW())`;
}

const updateExerciseProgress = (exerciseProgressId: number, sets: number, reps: number, weight: number, weightUnit: string): string => {
    return `
        update exercise_progress
        set \`sets\` = ${sets}, reps = ${reps}, weight = ${weight}, weight_unit = '${weightUnit}'
        where id = ${exerciseProgressId}
    `;
}

const deleteExerciseProgress = (exerciseProgressId: number): string => {
    return `delete from exercise_progress where id = ${exerciseProgressId}`;
}

const getAllUsersInformation = (userEmail: string): string => {
    return `
    select u.email, e.name as exerciseName, ep.reps, ep.\`sets\`, ep.weight, ep.weight_unit, ep.weight_unit, ep.date, ep.id as exerciseProgressId
    from users u
        inner join
        users_exercises ue
        on u.id = ue.user_id 
        inner join
        exercise_progress ep
        on ep.user_exercise_id = ue.id
        inner join
        exercises e
        on e.id = ue.exercise_id
        where u.email = '${userEmail}'`;
}

const getExerciseId = (exerciseName: string): string => {
    return `select id from exercises where name = '${exerciseName}'`;
}

export = {
    createSchema,
    selectFitnessSchema,
    getExercisesNames,
    insertExercise,
    deleteExerciseProgress,
    insertUser,
    getUserByEmail,
    getUsersExercise,
    insertUserExercise,
    insertExerciseProgress,
    getAllUsersInformation,
    getExerciseId,
    updateExerciseProgress,
    insertCustomUserExercise
};
