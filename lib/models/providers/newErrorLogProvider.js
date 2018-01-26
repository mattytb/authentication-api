import ErrorLog from '../errorLog';

export function provideNewErrorLog(error){
    let errorLog = new ErrorLog({
        message:error.message,
        code:error.code,
        stack:error.stack,
        errno:error.errno,
        path:error.path,
        address:error.address,
        status:error.status
    });
    return errorLog;
}