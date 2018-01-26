export function jsonAuthorized(res, payload){
    return res.status(200)
        .set({'Authorization':  res.locals.authorizationToken})
        .json({
            success: true,
            payload
    });
}