import { getUsers, deleteUserById } from '../clients/userClient';
import { getUserByAuthorizationToken } from '../clients/claimClient';
import { stripOutBearerToJustAuthorizationToken } from '../modules/authorizationTokenHelper';

export function getUserDetails() {
    return new Promise((resolve, reject) => {
        getUsers().then(users => {
            const mappedUserDetails = users.map((user) => 
            { 
                return { name:user.name, id:user.id, image:user.image }; 
            });
            resolve(mappedUserDetails);
        })
        .catch(err => reject(err))
    });
}

export function deleteUser(authorizationTokenWithBearer, userIdToBeDeleted){
    let error = new Error("Unauthorized");
    error.status = 401;

    return new Promise((resolve, reject) => {
        var authorizationToken = stripOutBearerToJustAuthorizationToken(authorizationTokenWithBearer);
        getUserByAuthorizationToken(authorizationToken).then(user => {
            if(userIdToBeDeleted == user._id || user.admin) {
                deleteUserById(userIdToBeDeleted).then(userId => {
                    resolve(`${userId} User was successfully deleted`)
                })
                .catch(err => reject(err))
            }
            else {
                reject(error);
            }
        }).catch(err => reject(err))
    });
}
