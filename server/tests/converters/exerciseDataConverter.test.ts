import 'mocha';
import 'chai';
import { expect } from 'chai';
const { convert } = require('../../converters/exerciseDataConverter');

describe('CONVERT FUNCTIONS', function () {
    describe('convert data from database to sorted data for displaying progress', function () {
        it('should convert as wanted', function () {
            // Arrange
            const inputData = [
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'spider_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-08T15:27:37.000Z'),
                    exerciseProgressId: 1
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'spider_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-08T15:27:48.000Z'),
                    exerciseProgressId: 2
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'spider_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-08T15:27:49.000Z'),
                    exerciseProgressId: 3
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'spider_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-20T15:27:49.000Z'),
                    exerciseProgressId: 3
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'spider_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-08T14:27:49.000Z'),
                    exerciseProgressId: 3
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'biceps_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-08T15:27:37.000Z'),
                    exerciseProgressId: 1
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'biceps_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-31T22:27:37.000Z'),
                    exerciseProgressId: 1
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'biceps_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-31T15:27:37.000Z'),
                    exerciseProgressId: 1
                },
            ];
            const bicepsData = [
                {
                    date: "2021-03-08",
                    exerciseInputForTheDay: [
                        {
                            email: 'pesjak.matej@gmail.com',
                            exerciseName: 'biceps_curl',
                            reps: 10,
                            sets: 4,
                            weight: 200,
                            weight_unit: '123',
                            date: new Date('2021-03-08T15:27:37.000Z'),
                            exerciseProgressId: 1
                        },
                    ]
                },
                {
                    date: "2021-03-31",
                    exerciseInputForTheDay: [
                        {
                            email: 'pesjak.matej@gmail.com',
                            exerciseName: 'biceps_curl',
                            reps: 10,
                            sets: 4,
                            weight: 200,
                            weight_unit: '123',
                            date: new Date('2021-03-31T15:27:37.000Z'),
                            exerciseProgressId: 1
                        },
                        {
                            email: 'pesjak.matej@gmail.com',
                            exerciseName: 'biceps_curl',
                            reps: 10,
                            sets: 4,
                            weight: 200,
                            weight_unit: '123',
                            date: new Date('2021-03-31T22:27:37.000Z'),
                            exerciseProgressId: 1
                        },
                    ]
                }];
            const spiderCurlData = [{
                date: "2021-03-08",
                exerciseInputForTheDay: [
                    {
                        email: 'pesjak.matej@gmail.com',
                        exerciseName: 'spider_curl',
                        reps: 10,
                        sets: 4,
                        weight: 200,
                        weight_unit: '123',
                        date: new Date('2021-03-08T14:27:49.000Z'),
                        exerciseProgressId: 3
                    },
                    {
                        email: "pesjak.matej@gmail.com",
                        exerciseName: "spider_curl",
                        reps: 10,
                        sets: 4,
                        weight: 200,
                        weight_unit: "123",
                        date: new Date('2021-03-08T15:27:37.000Z'),
                        exerciseProgressId: 1
                    },
                    {
                        email: "pesjak.matej@gmail.com",
                        exerciseName: "spider_curl",
                        reps: 10,
                        sets: 4,
                        weight: 200,
                        weight_unit: "123",
                        date: new Date('2021-03-08T15:27:48.000Z'),
                        exerciseProgressId: 2
                    },
                    {
                        email: "pesjak.matej@gmail.com",
                        exerciseName: "spider_curl",
                        reps: 10,
                        sets: 4,
                        weight: 200,
                        weight_unit: "123",
                        date: new Date('2021-03-08T15:27:49.000Z'),
                        exerciseProgressId: 3
                    }
                ]
            },
            {
                date: '2021-03-20',
                exerciseInputForTheDay: [
                    {
                        email: 'pesjak.matej@gmail.com',
                        exerciseName: 'spider_curl',
                        reps: 10,
                        sets: 4,
                        weight: 200,
                        weight_unit: '123',
                        date: new Date('2021-03-20T15:27:49.000Z'),
                        exerciseProgressId: 3
                    },
                ]
            }
            ]

            // Act
            const convertedOutput = convert(inputData, 'pesjak.matej@gmail.com');

            // Assert
            expect(convertedOutput).not.to.equal(null);
            expect(convertedOutput).not.to.equal(undefined);
            expect(convertedOutput.email).not.to.equal(undefined);
            expect(convertedOutput.email).not.to.equal(null);
            expect(convertedOutput.email).to.equal('pesjak.matej@gmail.com');
            expect(convertedOutput.exercises).not.to.equal(undefined);
            expect(convertedOutput.exercises).not.to.equal(null);
            expect(convertedOutput.exercises['spider_curl'].length).to.equal(2);
            expect(convertedOutput.exercises['biceps_curl']).to.eql(bicepsData);
            expect(convertedOutput.exercises['spider_curl']).to.eql(spiderCurlData);
        });
    });
});