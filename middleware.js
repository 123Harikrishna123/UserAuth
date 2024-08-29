const jwt =require('jsonwebtoken');

module.exports = function(req, res, next){
    try{
        let token = req.header('x-token');
        if(!token){
            return res.status(400).send('Token not found');
        }
        let decode = jwt.verify(token,'jwtSecret');
        console.log("decoded Token:",decode);
        if (!decode || !decode.user) {
            console.error('Token does not contain user information');
            return res.status(400).send('Invalid token');
        }
        req.user = decode.user
        next();

    }
    catch(err){
        console.log(err);
    }
}


// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//     try {
//         let token = req.header('x-token');
//         if (!token) {
//             return res.status(400).json({ msg: 'Token not found' });
//         }

//         let decoded = jwt.verify(token, 'jwtSecret');
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         console.error('Token verification failed:', err.message);
//         res.status(401).json({ msg: 'Token is not valid' });
//     }
// };
