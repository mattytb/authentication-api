import { verifyUser } from '../../modules/verifyUser';

module.exports = {
  
  isVerified : (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let userId = req.body.userId || req.query.userId || req.headers['x-access-token'];

    if (userId && token) {

      verifyUser(userId, token)
      
      .then(() => next())
      .catch(err => {

        res.status(401).json({ success: false, message: err });

      });
    }

    else {

      res.status(500).json({ success: false, message: 'No token provided.' });
      
    }
  
  }

};