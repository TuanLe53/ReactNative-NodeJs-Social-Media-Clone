
const testMiddleware = (req, res, next) => {
    console.log('Test middleware being call')
    next()
};

module.exports = testMiddleware;

// RoomID GET/CREATE/ (DELETE)
// MESSAGE GET/CREATE/ (DELETE)