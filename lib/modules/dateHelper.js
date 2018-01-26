export function isISODateLessThanDateTimeNow(ISODate){
   
    var dateTimeNow = new Date(Date.now());
    var dateTimeNowAsISOString = dateTimeNow.toISOString();
    var isoDateToISOString = ISODate.toISOString();
    if(isoDateToISOString < dateTimeNowAsISOString) return true;
    return false;
}