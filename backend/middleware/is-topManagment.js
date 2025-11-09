const jwt = require('jsonwebtoken');
const User = require('../model/employee');

require('dotenv').config();

const isTopManagment = async (req,res,next) => {
   
        const token = req.header("x-auth-token");
        if (!token)
         {
          const error = new Error('Not authenticated.');
          error.statusCode = 401;
          throw error;
         }
         let verified;
         try{
         verified = jwt.verify(token, process.env.JWT_SECRET);
         }catch (err) {
          err.statusCode = 500;
          throw err;
        }
        if (!verified)
          return res
            .status(401)
            .json({ msg: "Token verification failed, authorization denied" });
            const user = await User.findById(verified.id);

            if(user.role !== 'top managment' ){
              const error = new Error('you are not a top managment');
              error.statusCode = 401;
              throw error;
            }

            req.user = verified.id;
            req.token= token;
            next();
      
};



module.exports = isTopManagment;