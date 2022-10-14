function errorHelper(functionName, error, errorMessage, fileName) {
    try {
        var errorMessage2 = "";
        var typeofFunctionName = typeof functionName;
        if (typeof fileName == 'String' && fileName !== '' && fileName !== "" && typeof functionName == 'string' && functionName !== "" && functionName !== '') {
            console.log(fileName + " " + functionName + "() ERROR: " + error);
            if (typeof errorMessage == 'String' && errorMessage !== "" && errorMessage !== '') {
                console.log("possible ERROR explanation: " + errorMessage);
            } else if (errorMessage == "" || errorMessage == '') {
                errorMessage = "errorMessage is equal to \"\", meaning that the function that had an error either doesn\'t exist or is not covered in errorHelper(). The requested function was: " + typeofFunctionName + " type variable and contained: " + functionName;
                return new Error(errorMessage);
            } else {
                errorMessage2 = "the variable called \'errorMessage\' is supposed to be a String, it is not."
            }
        } else {
            errorMessage2 = "the variable called \'functionName\' is not a string, but it must be a string to run. It was requested as a " + typeofFunctionName + " type variable; containing: " + functionName;
            return new Error(errorMessage);
        }
    } catch (e2) {
        console.log(fileName + " errorHelper() ERROR: " + e2);
    }
}