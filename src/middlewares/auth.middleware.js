import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';


// called middleware because in middle to when u start making a request to when u end it
// someeone is making a request get user details -> authorize middleware -> verify token -> if valid -> next() -> get user details

const authorize = async (req, res, next) => {
    try {
        let token;

        // Check for Bearer token in Authorization header
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) { // Bearer is the type of token we are using ((protocol))
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) { // mooooooore to get it sometime 
            return res.status(401).json({ 
                message: 'Unauthorized', 
                error: 'No token provided. Please include: Authorization: Bearer <token>' 
            });
        }

        // Check if token has valid JWT format (3 parts separated by dots) needed so i get it 
        const tokenParts = token.split('.');
        if(tokenParts.length !== 3) {
            return res.status(401).json({ 
                message: 'Unauthorized', 
                error: 'Invalid token format. Token must have 3 parts separated by dots.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user) return res.status(401).json({ message: 'Unauthorized'});
        
        req.user = user; // this is the user that is logged in so we know who is logged in

        next(); // as long u have this next() it will go to the next middleware or the controller
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

export default authorize;