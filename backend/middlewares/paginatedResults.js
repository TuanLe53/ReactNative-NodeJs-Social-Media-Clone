const pool = require('../db/db');

const queries = async (model, limit, startIndex, id = null) => {
    let countQuery = 'SELECT COUNT(*) FROM ';
    let countQueryVars = [];

    let dataQuery = 'SELECT * FROM ';
    let dataQueryVars = [];

    switch (model) {
        case 'post':
            countQuery += 'post'
            dataQuery += `post LIMIT $1 OFFSET $2`
            dataQueryVars.push(limit, startIndex)
            break;
        case 'postByUser':
            countQuery += 'post WHERE created_by = $1'
            countQueryVars.push(id)
            dataQuery += 'post WHERE created_by = $1 LIMIT $2 OFFSET $3'
            dataQueryVars.push(id, limit, startIndex)
            break;
    }
    
    const totalRows = (await pool.query(countQuery, countQueryVars)).rows[0].count;
    const data = (await pool.query(dataQuery, dataQueryVars)).rows;

    return { totalRows, data }
}

const paginatedResults = (model) => {
    return async (req, res, next) => {
        const user_id = req.params.user_id ? req.params.user_id : '';

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let {totalRows, data} = await queries(model, limit, startIndex, user_id);

        const results = {};
        results.data = data;
    
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

        res.paginatedResults = results;
        next()
    }
}

module.exports = paginatedResults;