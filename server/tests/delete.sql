SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM users where id > 0;
DELETE FROM exercises where id > 0;
DELETE FROM users_exercises where id > 0;
DELETE FROM exercise_progress where id > 0;
DELETE FROM friendships where id > 0;
DELETE FROM  friendship_confirmations where id > 0;
SET FOREIGN_KEY_CHECKS = 1;