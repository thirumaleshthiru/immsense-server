import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, 'pkc4', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
