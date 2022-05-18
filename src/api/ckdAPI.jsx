import axios from "axios";

const backendURL = "http://localhost:3000";


/* ------------------------- System Authentication functionality --------------------------- */

export const login = async (userid, password)=>{
    return (await axios.put(backendURL+'/users/login',{
        userid: userid,
        password: password,
    }));
}

export const signup = async (userid, email, fullName, password, termsAccepted) => {
    return (
        await axios.post(backendURL+'/users',{
            userid: userid,
            fullName: fullName,
            password: password,
            email: email,
            termsAccepted: termsAccepted,
            termsAcceptedDate: `${(new Date()).getFullYear()}-${(new Date()).getMonth()}-${(new Date()).getDate()} ${(new Date()).getHours()}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`
        })
    );
}

export const checkUserAccess = async (userid, authToken)=>{
    return (
        await axios.get(backendURL+'/patientfinder/check-access',{
            params:{
                userid: userid,
                authToken: authToken
            }
        })
    );
}

/* ------------------------- PatientFinder dashboard functionality --------------------------- */

/* --- Side Panel Functionality  ---- */
/** Retreive all state labels from API/DB. Returns json object of format specified in CKD Population Navigator documentations. */
export const getStateLabels = async (userid, authToken) => {
    return (
        await axios.get(backendURL+'/patientfinder/values/states',{
            params: {
                userid: userid,
                authToken: authToken,
            }
        })
    );
}

/** Retreive all medical/treatment labels from API/DB. Returns json object of format specified in CKD Population Navigator documentations. */
export const getLabels = async (userid, authToken) => {
    return (
        await axios.get(backendURL+'/patientfinder/labels',{
            params: {
                userid: userid,
                authToken: authToken,
            }
        })
    );
}
/* --- Dashboard functionality --- */
export const getStatesData = async (userid, authToken, jsonData) => {
    console.log({
        userid,
        authToken,
        jsonData,
    });
    return (
        await axios.post(backendURL+'/patientfinder/states/population', {
            userid,
            authToken,
            jsonData,
        })
    );
}

/* --- User Preferences --- */
/** Retreive all medical/treatment labels from API/DB. Returns json object of format specified in CKD Population Navigator documentations. */
export const getUserPreferences = async (userid, authToken) => {
    return (
        await axios.get(backendURL+'/users/preferences',{
            params: {
                userid: userid,
                authToken: authToken,
            }
        })
    );
}


/* --- Chart Data --- */
/**
 * This will fetch treatments graph data from the backend
 */
 export const getTreatmentsData = async (userid, authToken, jsonData) => {
        return await axios.post(backendURL+'/patientfinder/treatments', {
            userid,
            authToken,
            jsonData,
        });
}

/**
 * This willfetch medical condition graph data from the backend
 */
export const getMedicalData = async (userid, authToken, jsonData) => {
    return await axios.post(backendURL+'/patientfinder/medicals', {
        userid,
        authToken,
        jsonData,
    });
}

/**
 * This will fetch Patient data from the selected state on the US map based on the treatment (AND/OR) and medical (AND/OR) conditions
 */
 export const getStateWisePatientData = async (userid, authToken, jsonData, selectedState) => {
    return await axios.post(backendURL + '/patientfinder/patients/details', {
        userid,
        authToken,
        jsonData,
        selectedState,
    });
}