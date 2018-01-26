import { authorizeNewUser } from '../services/authorizationService';

module.exports = {
  registerUser : (req, res) => {
    authorizeNewUser(req.body.name, req.body.password, req.body.email, req.body.clientId, req.body.expires)
    .then(
      claim => {
        res.status(200).json({
          success:true, 
          claim:claim
        });
      }
    )
    .catch(
      err => res.jsonError(err, res)
    );
  } 
}