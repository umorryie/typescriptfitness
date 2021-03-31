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
                    date: new Date('2021-02-08T15:27:37.000Z'),
                    exerciseProgressId: 1
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'biceps_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-03-31T21:27:37.000Z'),
                    exerciseProgressId: 1
                },
                {
                    email: 'pesjak.matej@gmail.com',
                    exerciseName: 'biceps_curl',
                    reps: 10,
                    sets: 4,
                    weight: 200,
                    weight_unit: '123',
                    date: new Date('2021-04-30T15:27:37.000Z'),
                    exerciseProgressId: 1
                },
            ];

            // Act
            const convertedOutput = convert(inputData, 'pesjak.matej@gmail.com');

            // Assert
            expect(convertedOutput).not.to.equal(null);
            expect(convertedOutput).not.to.equal(undefined);
            expect(convertedOutput.email).not.to.equal(undefined);
            expect(convertedOutput.email).not.to.equal(null);
            expect(convertedOutput.email).to.equal('pesjak.matej@gmail.com');
            expect(convertedOutput.exercises[0].exerciseName).to.equal("spider_curl");
            expect(convertedOutput.exercises[1].exerciseName).to.equal("biceps_curl");
            expect(convertedOutput.exercises[0].years.length).to.equal(1);
            expect(convertedOutput.exercises[1].years.length).to.equal(1);
            expect(convertedOutput.exercises[1].years[0].yearNumber).to.equal(2021);
            expect(convertedOutput.exercises[0].years[0].yearNumber).to.equal(2021);
            expect(convertedOutput.exercises[0].years[0].months.length).to.equal(1);
            expect(convertedOutput.exercises[1].years[0].months.length).to.equal(3);
            expect(convertedOutput.exercises[0].years[0].months[0].options.dataPoints.length).to.equal(5);
            expect(convertedOutput.exercises[1].years[0].months[0].options.dataPoints.length).to.equal(1);
            expect(convertedOutput.exercises[1].years[0].months[1].options.dataPoints.length).to.equal(1);
            expect(convertedOutput.exercises[1].years[0].months[2].options.dataPoints.length).to.equal(1);
            expect(convertedOutput.originalExercises.length).to.equal(8);
        });
    });
});