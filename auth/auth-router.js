const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

// For some odd reason these didn't get pushed through, they were in here when I pushed yesterday... weird

router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);

    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch(error => {
        res.status(500).json(error)
    })
});



router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({
                message: `Welcome ${user.username}`
            })
        } else {
            res.status(401).json({
                errorMessage: 'You Shall Not Pass'
            })
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
});

module.exports = router; 