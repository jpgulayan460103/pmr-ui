import moment from 'moment';

const displayError = (formErrors, field) => {
    if(formErrors && formErrors[field]){
        return {
          validateStatus: 'error',
          help: formErrors[field][0]
        }
    }
}

const bytesToSize = (bytes) => {
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 B';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const hasPermission = (user, permissions) => {
    return user?.permissions?.data?.filter(i => permissions.includes(i.name)) != 0
}
const hasRole = (user, roles) => {
    return user?.roles?.data?.filter(i => roles.includes(i.name)) != 0
}

const currencyFormat = (value) => {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(value).replace('$', '');
}

var currentDate = moment();
var dateStart = currentDate.clone().subtract(2, 'month').format("YYYY-MM-DD");
var dateEnd = currentDate.clone().format("YYYY-MM-DD");
const defaultDateRange = [dateStart,dateEnd];

const turnAroundTime = (updated, created) => {
    const date1 = moment(updated)
    const date2 = moment(created)
    return date1.diff(date2, "minute") + " minute(s)";
}

export default {
    displayError,
    bytesToSize,
    hasPermission,
    hasRole,
    currencyFormat,
    defaultDateRange,
    turnAroundTime,
}