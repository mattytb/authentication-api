import { provideNewClaim } from '../models/providers/newClaimProvider';
import { saveClaim } from '../models/utils/claimUtils'
import Claim from '../models/claim';

export function saveNewClaim(clientId, userId, expires){
    return new Promise((resolve, reject) => {
        let claim = provideNewClaim(clientId, userId, expires);
        saveClaim(claim)
            .then(claim => resolve(claim))
            .catch(err => reject(err)
        );
    }).catch(err => reject(err));
}

export function saveTokenToClaim(claimId, token){
    return new Promise((resolve, reject) => {
        Claim.findById(claimId).then(claim => {
            claim.token = token;
            claim.save();
            resolve(claim);
        })
        .catch(err => reject(err));
    });
}