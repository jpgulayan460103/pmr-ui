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
export default {
    displayError,
    bytesToSize,
    hasPermission,
    hasRole,
}