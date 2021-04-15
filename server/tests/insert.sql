CREATE SCHEMA IF NOT EXISTS sql11401143;

USE sql11401143;

SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS exercises;

DROP TABLE IF EXISTS users_exercises;

DROP TABLE IF EXISTS exercise_progress;

DROP TABLE IF EXISTS friendships;

DROP TABLE IF EXISTS friendship_confirmations;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users(
    id int not null unique auto_increment,
    email varchar(255) unique not null,
    PRIMARY KEY (id),
    last_name varchar(255) not null,
    first_name varchar(255) not null,
    password varchar(255)
);

CREATE TABLE exercises(
    id int not null unique auto_increment,
    name varchar(255) unique,
    PRIMARY KEY (id),
    is_custom_exercise boolean
);

CREATE TABLE users_exercises(
    id int not null unique auto_increment,
    exercise_id int,
    PRIMARY KEY (id),
    user_id int,
    CONSTRAINT FK_User_Ids FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Exercise_Id FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE exercise_progress(
    id int not null unique auto_increment,
    user_exercise_id int,
    `sets` int,
    reps int,
    weight int,
    weight_unit varchar(255),
    date datetime,
    PRIMARY KEY (id),
    CONSTRAINT FK_User_Exercise_Id FOREIGN KEY (user_exercise_id) REFERENCES users_exercises(id)
);

CREATE TABLE friendships(
    id int not null unique auto_increment,
    user_id int,
    friend_id int,
    PRIMARY KEY (id),
    CONSTRAINT FK_Friendship_User_Id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_Friendship_Friend_Id FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE friendship_confirmations(
    id int not null unique auto_increment,
    confirmed boolean default false,
    friendship_id int,
    PRIMARY KEY (id),
    CONSTRAINT FK_Friendship_Id FOREIGN KEY (friendship_id) REFERENCES friendships(id)
);

ALTER TABLE
    friendships
ADD
    CONSTRAINT no_duplicated_friendships UNIQUE KEY(user_id, friend_id);

ALTER TABLE
    users_exercises
ADD
    CONSTRAINT no_duplicated_users_exercises UNIQUE KEY(user_id, exercise_id);

SET
    FOREIGN_KEY_CHECKS = 0;

DELETE FROM
    users
where
    id > 0;

DELETE FROM
    exercises
where
    id > 0;

DELETE FROM
    users_exercises
where
    id > 0;

DELETE FROM
    exercise_progress
where
    id > 0;

SET
    FOREIGN_KEY_CHECKS = 1;

INSERT INTO
    users (email, password, first_name, last_name)
VALUES
    (
        'pesjak.matej@gmail.com',
        'password1!',
        'matej',
        'pesjak'
    );

SET
    @user1Id = LAST_INSERT_ID();

INSERT INTO
    users (email, password, first_name, last_name)
VALUES
    (
        'katja.zalokar@gmail.com',
        'password1!',
        'katja',
        'zalokar'
    );

SET
    @user2Id = LAST_INSERT_ID();

INSERT INTO
    exercises (name, is_custom_exercise)
VALUES
    ('bench_press', false);

SET
    @exercise1Id = LAST_INSERT_ID();

INSERT INTO
    exercises (name, is_custom_exercise)
VALUES
    ('deadlift', false);

SET
    @exercise2Id = LAST_INSERT_ID();

INSERT INTO
    users_exercises (user_id, exercise_id)
VALUES
    (@user1Id, @exercise1Id);

INSERT INTO
    exercise_progress (
        `sets`,
        reps,
        weight,
        weight_unit,
        user_exercise_id,
        date
    )
VALUES
    (10, 10, 10, 'lbs', LAST_INSERT_ID(), NOW());

INSERT INTO
    users_exercises (user_id, exercise_id)
VALUES
    (@user1Id, @exercise2Id);

INSERT INTO
    exercise_progress (
        `sets`,
        reps,
        weight,
        weight_unit,
        user_exercise_id,
        date
    )
VALUES
    (10, 10, 10, 'lbs', LAST_INSERT_ID(), NOW());

INSERT INTO
    users_exercises (user_id, exercise_id)
VALUES
    (@user2Id, @exercise1Id);

INSERT INTO
    exercise_progress (
        `sets`,
        reps,
        weight,
        weight_unit,
        user_exercise_id,
        date
    )
VALUES
    (10, 10, 10, 'lbs', LAST_INSERT_ID(), NOW());

INSERT INTO
    users_exercises (user_id, exercise_id)
VALUES
    (@user2Id, @exercise2Id);

INSERT INTO
    exercise_progress (
        `sets`,
        reps,
        weight,
        weight_unit,
        user_exercise_id,
        date
    )
VALUES
    (10, 10, 10, 'lbs', LAST_INSERT_ID(), NOW());

INSERT INTO
    friendships(user_id, friend_id)
VALUES
    (1, 2);

INSERT INTO
    friendship_confirmations(friendship_id, confirmed)
VALUES
    (1, true);