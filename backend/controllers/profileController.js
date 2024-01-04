const pool = require('../db/db');

const getProfiles = async (req, res) => {
    const { id } = req.user;

    try {
        const data = await pool.query('SELECT id, username, avatar FROM account WHERE id != $1', [id])
        const profiles = data.rows

        return res.status(200).json(profiles)
    } catch (err) {
        res.status(500).json({message: 'Server Error'})
    }
}

const getProfile = async (req, res) => {
    const { id } = req.params
    
    try {
        const data = await pool.query('SELECT id, username, bio, avatar, acc_location, cover_photo FROM account WHERE id = $1', [id])
        const profile = data.rows[0]

        const follower = (await pool.query('SELECT COUNT(follower) FROM follow WHERE user_id = $1', [id])).rows[0]
        const following = (await pool.query('SELECT COUNT(follower) FROM follow WHERE follower = $1', [id])).rows[0]

        if (profile.length === 0) {
            return res.status(404).json({error:"Profile doesn't exist"})
        } else {
            profile.follower = follower.count;
            profile.following = following.count;
            return res.status(200).json(profile)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Database error'})
    }
}

const updateBio = async (req, res) => {
    const { newBio } = req.body
    const { id } = req.user

    try {
        const result = await pool.query('UPDATE account SET bio = $1 WHERE id = $2 RETURNING bio', [newBio, id])
        const bio = result.rows[0]
        res.status(200).json({
            message: 'Bio updated',
            bio: bio.bio
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Database error'})
    }
}

const updateAvatar = async (req, res) => {
    const { id } = req.user
    const url = 'http://192.168.1.138:8080/images/avatar/' + req.file.filename

    pool.query('UPDATE account SET avatar = $1 WHERE id = $2', [url, id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        return res.status(200).json({
            message: 'Avatar uploaded',
            url: url
        });
    })
};

const updateCover = async (req, res) => {
    const { id } = req.user
    const url = 'http://192.168.1.138:8080/images/cover/' + req.file.filename

    pool.query('UPDATE account SET cover_photo = $1 WHERE id = $2', [url, id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        return res.status(200).json({
            message: 'Avatar uploaded',
            url: url
        });
    })
}

const isFollow = async (req, res) => {
    const { id } = req.user;
    const { profile_id } = req.params;

    try {
        const data = await pool.query('SELECT * FROM follow WHERE user_id = $1 AND follower = $2', [profile_id, id])
        if (data.rows.length !== 0) {
            return res.status(200).json({message: 'Is follow'})
        }
        res.status(404).json({message: 'Not follow yet.'})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Server error'})
    }
}

const followUser = async (req, res) => {
    const { id } = req.user;
    const { profile_id } = req.params;

    pool.query('INSERT INTO follow (user_id, follower) VALUES($1, $2)', [profile_id, id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: 'Server error'})
        }
        res.status(201).json({message: 'Followed'})
    })
}

const unFollowUser = async (req, res) => {
    const { id } = req.user;
    const { profile_id } = req.params;

    pool.query('DELETE FROM follow WHERE user_id = $1 AND follower = $2', [profile_id, id], (err) => {
        if (err) {
            console.log(res)
            return res.status(500).json({error: 'Server error'})
        }
        res.status(200).json({message: 'Unfollowed'})
    })
}

module.exports = { getProfile, updateBio, updateAvatar, updateCover, isFollow, followUser, unFollowUser, getProfiles };