import { authenticateNewUser } from '../services/authenticationService';


module.exports = {
  registerUser : (req, res) => {
    authenticateNewUser(req.body.name, req.body.password, req.body.email, req.body.clientId, req.body.expires = null)
    .then(claim => {
      res.status(200).json({success:true, claim:claim});
    })
    .catch(err => {
      res.status(409).json({ success: false, message: err.message });
    });
  }
}