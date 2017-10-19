import { authenticateNewUser } from '../services/authenticationService';

module.exports = {

  registerUser : (req, res) => {
    
  authenticateNewUser(req.body.name, req.body.password, req.body.email, req.body.fromMobile)
    .then(user => {
      let token = null;

      req.body.fromMobile 
      ? token = user.mobileToken 
      : token = user.webToken;

      var result = {
        success: true,
        message: 'Enjoy your token!',
        token: token,
        userId: user._id  
      };

      res.status(200).json(result);

    })
    .catch(err => {
      res.status(409).json({ success: false, message: err.message });
    });
  }
}