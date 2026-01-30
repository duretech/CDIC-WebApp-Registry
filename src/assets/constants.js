import OfflineDb from '../db'
const loginDetails = 
OfflineDb.getDataFromPouchDB('loginDetails')
.then(loginDetails => {
    return loginDetails
})

export { loginDetails }