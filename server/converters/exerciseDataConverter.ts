const convert = (arrayOfExercises, userEmail) => {
    const response: any = {};
    response.email = userEmail;
    response.exercises = getExercisesKeysObject(arrayOfExercises);

    return response;
}

const getExercisesKeysObject = (arrayOfExercises) => {
    const exerciseObject = {};
    const exercisesSet: Set<String> = new Set();
    arrayOfExercises.forEach(element => {
        exercisesSet.add(element.exerciseName);
    })
    for (let item of exercisesSet) {
        const exerciseBelongingData = arrayOfExercises.filter(exercise => exercise.exerciseName == item).sort((a, b) => {
            const day1: any = new Date(a.date);
            const day2: any = new Date(b.date);

            const result = day1 - day2;
            return result;
        });
        const groups = exerciseBelongingData.reduce((groups, exerciseInput) => {
            const date = exerciseInput.date.toISOString().split('T')[0]
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(exerciseInput);
            return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((date) => {
            return { date, exerciseInputForTheDay: groups[date] };
        });
        const exerciseNameFromItem: any = item;
        exerciseObject[exerciseNameFromItem] = groupArrays;
    }
    return exerciseObject;
}

export = {
    convert
}
