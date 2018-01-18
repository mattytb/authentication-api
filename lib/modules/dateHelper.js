export function isISODateLessThanDateTimeNow(ISODate){
    var dateTimeNow = new Date(Date.now());
    var dateTimeNowAsISOString = dateTimeNow.toISOString();
    if(ISODate < dateTimeNowAsISOString) return true;
    return false;
}