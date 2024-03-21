const pool = require('../db/db');

const getPosts = async (req, res) => {
    const { id } = req.user;

    let posts = [];
    await Promise.all(res.paginatedResults['data'].map(async (item) => {
        const postQuery = await pool.query('SELECT post.*, account.username, account.avatar FROM post LEFT JOIN account ON post.created_by = account.id WHERE post.id = $1 ORDER BY created_at', [item.id]);
        const post = postQuery.rows[0];
        
        const imagesQuery = await pool.query('SELECT img_url FROM post_image WHERE post_id = $1', [item.id]);
        post.images = imagesQuery.rows;

        const likeQuery = await pool.query('SELECt * FROM like_post WHERE post_id = $1 AND user_id = $2', [item.id, id]);
        if (likeQuery.rows.length !== 0) {
            post.is_like = true;
        } else {
            post.is_like = false;
        }

        posts.push(post)
    }));

    //Update data with new posts array
    res.paginatedResults['data'] = posts;

    res.status(200).json(res.paginatedResults);
}

const getPostsByUser = async (req, res) => {
    const { user_id } = req.params;
    const { id } = req.user;

    let posts = []

    try {
        const data = await pool.query('SELECT post.*, account.username, account.avatar FROM post LEFT JOIN account ON post.created_by = account.id WHERE created_by = $1', [user_id]);
        if (data.rows.length === 0) {
            return res.status(200).json(posts)
        }

        await Promise.all(data.rows.map(async (post) => {
            let data = await pool.query('SELECT img_url FROM post_image WHERE post_id = $1', [post.id])
            post.images = data.rows

            let like = await pool.query('SELECT * FROM like_post WHERE post_id = $1 AND user_id = $2', [post.id, id]);
            if (like.rows.length === 0) {
                post.is_like = false
            } else {
                post.is_like = true;
            }

            posts.push(post)
        }))

        res.status(200).json(posts)

    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Database error'})
    }

}

const getPostByID = async (req, res) => {
    const { post_id } = req.params;
    const { id } = req.user;

    try {
        const postData = await pool.query('SELECT post.*, account.username, account.avatar FROM post LEFT JOIN account ON post.created_by = account.id WHERE post.id=$1', [post_id]);
        const post = postData.rows[0];
        
        const imgData = await pool.query('SELECT img_url FROM post_image WHERE post_id = $1', [post_id]);
        const images = imgData.rows;
        
        const likeData = await pool.query('SELECT * FROM like_post WHERE post_id = $1 AND user_id = $2', [post_id, id])
        if (likeData.rows.length === 0) {
            post.is_like = false;
        } else {
            post.is_like = true;
        }

        if (post.length === 0) return res.status(404).json({ message: 'Post not found' });

        post.images = images
        
        res.status(200).json(post)
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Database error' });
    }
}

const createPost = async (req, res) => {
    const { id } = req.user;
    const { content } = req.body;
    const serverURL = 'http://192.168.1.138:8080/images/post/';
    let photos = [];

    req.files.map((photo) => {
        let url = serverURL + photo.filename
        photos.push(url)
    })
    
    pool.query('INSERT INTO post(content, created_by) VALUES($1, $2) RETURNING id', [content, id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Database error' });
        }

        let post_id = result.rows[0].id;
        photos.map((photo) => {
            pool.query('INSERT INTO post_image(post_id, img_url) VALUES($1, $2)', [post_id, photo], (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({message: 'Database error'})
                }
            })
        })
        
        res.status(201).json({
            message: 'Post created',
            post_id
        })
    })
}

const LikePost = async (req, res) => {
    const { id } = req.user;
    const { post_id } = req.params;

    pool.query('INSERT INTO like_post(post_id, user_id) VALUES($1, $2)', [post_id, id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Server Error' })
        }

        res.status(201).json({message: 'Success'})
    });
}

const UnlikePost = async (req, res) => {
    const { id } = req.user;
    const { post_id } = req.params;

    pool.query('DELETE FROM like_post WHERE post_id = $1 AND user_id = $2', [post_id, id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Server Error' })
        }

        res.status(200).json({message: 'Success'})
    })
}

const DeletePost = async (req, res) => {
    const { post_id } = req.params;

    pool.query('DELETE FROM post WHERE id = $1', [post_id], (err) => {
        if (err) {
            return res.status(500).json({error: "Server error"})
        }

        res.status(200).json({message: 'Success'})
    })
}

module.exports = { getPosts, getPostByID, createPost, getPostsByUser, LikePost, UnlikePost, DeletePost };