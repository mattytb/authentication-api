
export function createCompleteClaim(claim, user){
    return new Promise((resolve, reject) => {
        resolve({
            userId:user._id,
            userImage:user.image,
            authenticationToken:claim.token,
            name:user.name,
            refreshToken:claim._id
        })
    })
}