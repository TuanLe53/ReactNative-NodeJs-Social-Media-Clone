const pool = require('../db/db');

const paginatedResults = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const totalRows = (await pool.query(`SELECT COUNT(*) FROM ${model}`)).rows[0].count;

        const results = {};
    
        if (endIndex < totalRows) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        const dataQuery = await pool.query(`SELECT * FROM ${model} LIMIT $1 OFFSET $2`, [limit, startIndex]);
        results.data = dataQuery.rows;

        res.paginatedResults = results;
        next()
    }
}

module.exports = paginatedResults;