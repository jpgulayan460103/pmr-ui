const displayError = (formErrors, field) => {
    if(formErrors && formErrors[field]){
        return {
          validateStatus: 'error',
          help: formErrors[field][0]
        }
    }
}
export default {
    displayError,
}