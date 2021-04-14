const connection = require('../database/connection');
const { getFriendship } = require('../database/sql');

const validateFriendConfirmationLegality = (req, res, next) => {
    const { friendshipId, userId } = req.body;

    connection.query(getFriendship(friendshipId), (error, friendship) => {
        if (error) {
            console.log(`Error retrieving friendship with error: ${error}`);
            return res.status(200).json({ error })
        } else {
            if (friendship && friendship.length == 0) {
                console.log(`No friendship`);
                return res.status(200).json({
                    error: {
                        message: `No friendship`
                    }
                });
            } else {
                if (friendship[0].friend_id === userId) {
                    req.body.friendId = friendship[0].user_id;
                    next();
                } else {
                    res.status(403).json({
                        error: {
                            message: `Not authorized to confirm friendship.`
                        }
                    });
                }
            }
        }
    });
};

export = {
    validateFriendConfirmationLegality
};