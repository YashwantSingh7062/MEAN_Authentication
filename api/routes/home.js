const express = require('express');
const router = express.Router();

const User = require('../models/user');

const checkAuth = require('../middleware/checkAuth');

router.get('/',checkAuth,(req,res) => {
    User.findOne({_id : req.user._id})
        .then(result => {
            res.status(200).json({
                _id : result._id,
                email : result.email,
                userImage : result.userImage
            })
        })
        .catch(err => console.log(err));
})

module.exports = router;