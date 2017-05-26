import { verifyToken } from '../../clients/tokenClient';

module.exports = {
  
  isVerified : (req, res, next) => {
 
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

      verifyToken(token)
      
      .then(() => 

        next()

      )
      .catch(err => {

        res.status(401).json({ success: false, message: err });

      });
    }

    else {

      res.status(500).json({ success: false, message: 'No token provided.' });
      
    }
  
  }

};