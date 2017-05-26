
import { applyAuthToken } from '../modules/applyAuthToken';
import { getUserByName, saveNewUser } from '../clients/userClient';

module.exports = {

  registerUser : (req, res) => {

    getUserByName(req.body.name).then(user => {

      res.status(409).json({ success: false, message: 'Sorry, already a user with this name' });

    })
    .catch(err => {

      saveNewUser(req.body.name, req.body.password, req.body.email).then(newUser => {

        applyAuthToken(newUser).then(user => {

          res.status(200).json({
            success: true,
            message: 'Enjoy your token!',
            token: user.token,
            userId: user._id  
          });
          
        })
        .catch(err => {

          res.status(500).json({ success: false, message: err });

        });

      })
      .catch(err => {

        res.status(500).json({ success: false, message: err });

      });

    });

  }
}