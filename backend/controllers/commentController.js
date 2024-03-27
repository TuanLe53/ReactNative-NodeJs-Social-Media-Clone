const pool = require('../db/db');

const getComment = async (req, res) => {
    const { post_id } = req.params;

    const commentsData = await pool.query('SELECT comment.id, comment, created_by, created_at, parent_id, account.username, account.avatar FROM comment LEFT JOIN account ON comment.created_by = account.id WHERE post_id = $1 AND parent_id IS NULL', [post_id]);
    const comments = commentsData.rows;


    await Promise.all(comments.map(async (comment) => {
        let reply = await pool.query('SELECT id FROM comment WHERE parent_id = $1', [comment.id]);
        comment.has_reply = reply.rows.length !== 0;
    }))

    res.status(200).json(comments);
}

const getReply = async (req, res) => {
    const { comment_id } = req.params;

    const replyData = await pool.query('SELECT comment.id, comment, created_by, created_at, parent_id, account.username, account.avatar FROM comment LEFT JOIN account ON comment.created_by = account.id WHERE parent_id = $1 ORDER BY created_at', [comment_id])
    const reply = replyData.rows

    res.status(200).json(reply)
}

const createComment = async (req, res) => {
    const { id } = req.user;
    const { post_id } = req.params;
    const { comment, parent_id } = req.body;

    let parentID = parent_id ? parent_id : null;

    try {
        const result = await pool.query('INSERT INTO comment(comment, post_id, created_by, parent_id) VALUES($1, $2, $3, $4) RETURNING id, parent_id', [comment, post_id, id, parentID])
        const commentID = await result.rows[0].id
       
        const data = await pool.query('SELECT comment.id, comment, created_by, created_at, parent_id, account.username, account.avatar FROM comment LEFt JOIN account ON comment.created_by = account.id WHERE comment.id = $1', [commentID])
        const newComment = await data.rows[0]

        res.status(201).json(newComment);
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
}

module.exports = { createComment, getComment, getReply };