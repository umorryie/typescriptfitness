import 'mocha';
import 'chai';
import { expect } from 'chai';
import fs from 'fs';
import mysql from 'mysql';
import path from 'path';
const testConfig = require('./testDatabaseConfig');
import ExerciseRepository from '../repository/ExerciseRepository';
import UserRepository from '../repository/UserRepository';
import app from '../server';
import request = require('supertest');
const { generateToken } = require('../auth/tokenAuth');
const token = generateToken({ userEmail: "pesjak.matej@gmail.com" });

describe('api/user', function () {
    let mysqlTestConnection;
    let exerciseRepository;
    before(async function () {
        mysqlTestConnection = mysql.createPool({
            user: testConfig.user,
            database: testConfig.database,
            password: testConfig.password,
            host: testConfig.host,
            port: testConfig.port,
            multipleStatements: true
        });

        exerciseRepository = new ExerciseRepository(mysqlTestConnection);
    })

    describe('GET', async function () {
        it('authorized - /api/users/user/getUser', async function () {
            // Act
            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer ${token}`);
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.email).to.equal('pesjak.matej@gmail.com');
            expect(response.exercises).not.to.equal(null);
            expect(response.exercises['deadlift']).not.to.equal(null);
            expect(response.exercises['bench_press:']).not.to.equal(null);
            expect(response.exercises['deadlift'].length).to.equal(1);
            expect(response.exercises['bench_press'].length).to.equal(1);
            expect(response.exercises['bench_press'][0].exerciseInputForTheDay.length).to.equal(1);
            expect(response.exercises['deadlift'][0].exerciseInputForTheDay.length).to.equal(1);
        });
    });
    describe('GET', async function () {
        it('no token - /api/users/user/getUser', async function () {
            // Act
            let response = await request(app).get("/api/users/user/getUser");
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response).to.equal("No token specified.");
        });
    });
    describe('GET', async function () {
        it('wrong token - /api/users/user/getUser', async function () {
            // Act
            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer asd${token}`);
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.error).not.to.equal(null);
            expect(response.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('POST', async function () {
        it('/api/users/user/create', async function () {
            // Act
            await request(app).post("/api/users/user/create").send({ "userEmail": "test@gmail.com" });
            const user = await exerciseRepository.customQuery(`select * from users where email = 'test@gmail.com'`);

            // Assert
            expect(user).not.to.equal(null);
            expect(user.length).to.equal(1);
            expect(user[0].email).to.equal('test@gmail.com');
        });
    });
    describe('POST', function () {
        it('authorized - /api/users/user/postExerciseProgress', async function () {
            // Act
            await request(app).post("/api/users/user/postExerciseProgress").set('Authorization', `Bearer ${token}`).send({
                "exerciseName": "deadlift", "sets": 4, "weight": "200", "reps": 10, "weightUnit": 123
            });
            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer ${token}`);
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.email).to.equal('pesjak.matej@gmail.com');
            expect(response.exercises).not.to.equal(null);
            expect(response.exercises['deadlift']).not.to.equal(null);
            expect(response.exercises['bench_press:']).not.to.equal(null);
            expect(response.exercises['deadlift'].length).to.equal(1);
            expect(response.exercises['bench_press'].length).to.equal(1);
            expect(response.exercises['bench_press'][0].exerciseInputForTheDay.length).to.equal(1);
            expect(response.exercises['deadlift'][0].exerciseInputForTheDay.length).to.equal(2);
        });
    });
    describe('POST', function () {
        it('wrong token - /api/users/user/postExerciseProgress', async function () {
            // Act
            let response = await request(app).post("/api/users/user/postExerciseProgress").set('Authorization', `Bearer asd${token}`);
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.error).not.to.equal(null);
            expect(response.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('POST', function () {
        it('no token - /api/users/user/postExerciseProgress', async function () {
            // Act
            let response = await request(app).post("/api/users/user/postExerciseProgress");
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response).to.equal("No token specified.");
        });
    });
    describe('PUT', function () {
        it('authorized - /api/users/user/update/exercise', async function () {
            // Arrange
            const exerciseProgress = await exerciseRepository.customQuery('select * from exercise_progress');
            const exerciseProgressId = exerciseProgress[exerciseProgress.length - 1].id;

            // Act
            await request(app).put("/api/users/user/update/exercise").set('Authorization', `Bearer ${token}`).send({
                "sets": 666, "weight": 666, "reps": 666, "weightUnit": "kg", "exerciseProgressId": exerciseProgressId
            });
            const exerciseCheck = await exerciseRepository.customQuery(`select * from exercise_progress where id = ${exerciseProgressId}`);

            // Assert
            expect(exerciseCheck).not.to.equal(null);
            expect(exerciseCheck.length).to.equal(1);
            expect(exerciseCheck[0].sets).to.equal(666);
            expect(exerciseCheck[0].weight).to.equal(666);
            expect(exerciseCheck[0].reps).to.equal(666);
            expect(exerciseCheck[0].weight_unit).to.equal('kg');
        });
    });
    describe('PUT', function () {
        it('no token - /api/users/user/update/exercise', async function () {
            // Act
            let response = await request(app).put("/api/users/user/update/exercise");
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response).to.equal("No token specified.");
        });
    });
    describe('PUT', function () {
        it('wrong token - /api/users/user/update/exercise', async function () {
            // Act
            let response = await request(app).put("/api/users/user/update/exercise").set('Authorization', `Bearer asd${token}`).send({ "exerciseName": "newExerciseTest" });
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.error).not.to.equal(null);
            expect(response.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('DELETE', async function () {
        it('authorized - /api/users/user/delete/exercise', async function () {
            // Act
            const exerciseProgress = await exerciseRepository.customQuery('select * from exercise_progress');
            const exerciseProgressId = exerciseProgress[0].id;
            await request(app).delete("/api/users/user/delete/exercise").set('Authorization', `Bearer ${token}`).send({ "exerciseProgressId": exerciseProgressId });
            const exerciseProgressCheck = await exerciseRepository.customQuery(`select * from exercise_progress where id = ${exerciseProgressId}`);

            // Assert
            expect(exerciseProgressCheck).not.to.equal(null);
            expect(exerciseProgressCheck.length).to.equal(0);
        });
    });
    describe('DELETE', async function () {
        it('no token - /api/users/user/delete/exercise', async function () {
            // Act
            let response = await request(app).delete("/api/users/user/delete/exercise");
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response).to.equal("No token specified.");
        });
    });
    describe('DELETE', async function () {
        it('wrong token - /api/users/user/delete/exercise', async function () {
            // Act
            let response = await request(app).delete("/api/users/user/delete/exercise").set('Authorization', `Bearer asd${token}`)
            response = response.body;

            // Assert
            expect(response).not.to.equal(null);
            expect(response.error).not.to.equal(null);
            expect(response.error.name).to.equal("JsonWebTokenError");
        });
    });
});

describe('api/exercises', function () {
    this.timeout(20000);
    let mysqlTestConnection;
    let exerciseRepository;
    before(function () {
        mysqlTestConnection = mysql.createPool({
            user: testConfig.user,
            database: testConfig.database,
            password: testConfig.password,
            host: testConfig.host,
            port: testConfig.port,
            multipleStatements: true
        });
        exerciseRepository = new ExerciseRepository(mysqlTestConnection);
    })
    describe('POST', function () {
        it('insertExercise', async function () {
            // Arrange
            await exerciseRepository.insertExercise("newExercise", true);

            // Act
            const exercise = await exerciseRepository.customQuery("select * from exercises where name = 'newExercise'");

            // Assert
            expect(exercise).not.to.equal(null);
            expect(exercise.length).to.equal(1);
            expect(exercise[0].name).to.equal('newExercise');
            expect(exercise[0].is_custom_exercise).to.equal(1);
        });
    });
    describe('GET', function () {
        it('getExercisesNames - api/exercises/getExercises/', async function () {
            // Act
            let exercises = await request(app).get("/api/exercises/getExercises/");
            exercises = exercises.body;

            // Assert
            expect(exercises).not.to.equal(null);
            expect(exercises.length).to.equal(3);
            expect(exercises[0].name).to.equal('bench_press');
            expect(exercises[0].isCustomExercise).to.equal(false);
            expect(exercises[1].name).to.equal('deadlift');
            expect(exercises[1].isCustomExercise).to.equal(false);
            expect(exercises[2].name).to.equal('newExercise');
            expect(exercises[2].isCustomExercise).to.equal(true);
        });
    });
    describe('POST', function () {
        it('insertCustomUserExercise - when authorized - url: /api/exercises/create/newExercise', async function () {
            // Act

            let response = await request(app).post("/api/exercises/create/newExercise").set('Authorization', `Bearer ${token}`).send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;
            const result = await exerciseRepository.customQuery(`
            select * from users_exercises ue 
            where ue.user_id = (
                select id from users where email = 'pesjak.matej@gmail.com') 
                and ue.exercise_id = (
                    select id from exercises e2 where name = 'newExerciseTest'
                )`);
            const userId = await exerciseRepository.customQuery(`select id from users where email = 'pesjak.matej@gmail.com'`);
            const exerciseId = await exerciseRepository.customQuery(`select id from exercises where name = 'newExerciseTest'`);

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).to.equal(undefined);
            expect(responseBody.affectedRows).to.equal(1);
            expect(responseBody.insertId).not.to.equal(null);
            expect(response).not.to.equal(null);
            expect(response.statusCode).to.equal(202);
            expect(result).not.to.equal(null);
            expect(result.length).to.equal(1);
            expect(result[0].user_id).to.equal(userId[0].id);
            expect(result[0].exercise_id).to.equal(exerciseId[0].id);
        });
        it('insertCustomUserExercise - when wrong token - url: /api/exercises/create/newExercise', async function () {
            // Act
            let response = await request(app).post("/api/exercises/create/newExercise").set('Authorization', `Bearer sdffsfd`).send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
        it('insertCustomUserExercise - when no token - url: /api/exercises/create/newExercise', async function () {
            // Act
            let response = await request(app).post("/api/exercises/create/newExercise").send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(responseBody).to.equal("No token specified.");
        });
    });
});