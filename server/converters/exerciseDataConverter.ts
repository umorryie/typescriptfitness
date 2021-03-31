const convert = (arrayOfExercises, userEmail: string) => {
    const response: any = {};
    //const exercises = convertToClientVersion(arrayOfExercises);
    response.email = userEmail;
    //response.exercises = getExercisesKeysObject(arrayOfExercises);
    response.exercises = convertToClientVersion(arrayOfExercises);
    response.originalExercises = arrayOfExercises;

    return response;
}

const getExercisesKeysObject = (arrayOfExercises) => {
    const exerciseObject = {};
    const exercisesSet: Set<string> = new Set();
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

const groupDaysByYearMonth = (responseObject) => {
    let result = {
        email: responseObject.email
    }
    let exercise: any = {};
    Object.keys(responseObject.exercises).forEach((key: string) => {
        exercise.exerciseName = key;
        const exercisesSet: Set<string> = new Set();
        responseObject.exercises[key].forEach(element => {
            exercisesSet.add(element.date.substring(0, 4));
        });
        for (let item of exercisesSet) {

        }

    })
}


const convertToClientVersion = (sqlArray: object[]) => {
    let results: any = {};
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let years: any[] = [];
    let exercises: any = [];
    for (let index = 0; index < sqlArray.length; index++) {
        const element: any = sqlArray[index];
        let exercise: any = null;
        const date = new Date(element.date);
        const yearNumber = date.getFullYear();
        const day = date.getDate();
        const monthName = monthsArray[date.getMonth()];
        const exerciseName = element.exerciseName;
        const suffix = element.weight_unit;
        const exercisesIncludeExerciseIndex: number = exercises.findIndex(el => el.exerciseName === exerciseName);
        const elementWeight = element.weight;
        const elementSets = element.sets;
        const elementReps = element.reps;

        if (exercisesIncludeExerciseIndex && exercisesIncludeExerciseIndex === -1) {
            exercise = {
                exerciseName,
                years: [{
                    yearNumber,
                    months: [{
                        monthName,
                        options: {
                            suffix,
                            dataPoints: [{
                                x: day,
                                y: elementWeight,
                                sets: elementSets,
                                reps: elementReps,
                                dateName: `${day} ${monthName} ${yearNumber}`,
                                suffix
                            }],
                        }
                    }]
                }]
            }
            exercises.push(exercise);
        } else if (exercisesIncludeExerciseIndex > -1) {
            const alreadyExistingYear = exercises[exercisesIncludeExerciseIndex].years.findIndex(el => el.yearNumber === yearNumber);
            if (alreadyExistingYear && alreadyExistingYear === -1) {
                exercises[exercisesIncludeExerciseIndex].years.push(
                    {
                        yearNumber,
                        months: [{
                            monthName,
                            options: {
                                suffix,
                                dataPoints: [{
                                    x: day,
                                    y: elementWeight,
                                    sets: elementSets,
                                    reps: elementReps,
                                    dateName: `${day} ${monthName} ${yearNumber}`,
                                    suffix
                                }],
                            }
                        }]
                    }
                )
            } else if (alreadyExistingYear > -1) {
                const alreadyExistingMonth = exercises[exercisesIncludeExerciseIndex].years[alreadyExistingYear].months.findIndex(el => el.monthName === monthName);

                if (alreadyExistingMonth && alreadyExistingMonth === -1) {
                    exercises[exercisesIncludeExerciseIndex].years[alreadyExistingYear].months.push({
                        monthName,
                        options: {
                            suffix,
                            dataPoints: [{
                                x: day,
                                y: elementWeight,
                                sets: elementSets,
                                reps: elementReps,
                                dateName: `${day} ${monthName} ${yearNumber}`,
                                suffix
                            }],
                        }
                    })
                } else if (alreadyExistingMonth > -1) {
                    exercises[exercisesIncludeExerciseIndex].years[alreadyExistingYear].months[alreadyExistingMonth].options.dataPoints.push({
                        x: day,
                        y: elementWeight,
                        sets: elementSets,
                        reps: elementReps,
                        dateName: `${day} ${monthName} ${yearNumber}`,
                        suffix
                    });

                }
            }
        }
    }

    return exercises;
}

export = {
    convert
}
