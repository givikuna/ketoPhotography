const ketoContactGmail_G = "@ketoGmailINFORMATION"; //the gmail of Keto, used for alerts and so on
const maingLang_G = "@lang"; //the language chosen by the user
var chosenAlbumID_G = null; //the ID of the album chosen by the user

function askForHelp(info) {
	//
}

function languageChooser(langInfo) {
	if (langInfo == null || langInfo == undefined || langInfo == "" || !langInfo || typeof langInfo == "number") {
		return "eng";
	} else {
		langInfo = langInfo.toLowerCase();
		if (langInfo == "rus" || langInfo == "russian" || langInfo == "boring ass language" || langInfo == "ruso" || langInfo == "putinian" || langInfo == "putin" || langInfo == "putino" || langInfo == "rusia" || langInfo == "ruski" || langInfo == "rusian" || langInfo == "ru" || langInfo == "rusuli" || langInfo == "russ" || langInfo == "russian language") {
			return "rus";
		} else if (langInfo == "geo" || langInfo == "qartuli nana" || langInfo == "cartuli nana" || langInfo == "kartuli nana" || langInfo == "kartluli" || langInfo == "kartvelian language" || langInfo == "kartuli ena" || langInfo == "deda ena" || langInfo == "qartuli ena" || langInfo == "cartuli ena" || langInfo == "geouri" || langInfo == "gurjistani" || langInfo == "georgiani" || langInfo == "qartveli" || langInfo == "georgianuri" || langInfo == "gurjistan" || langInfo == "georgian" || langInfo == "kartveli" || langInfo == "kutaisuri" || langInfo == "kartuli" || langInfo == "ქართული" || langInfo == "ka" || langInfo == "kar" || langInfo == "cartuli" || langInfo == "cartveluri" || langInfo == "cartvelian" || langInfo == "qartveluri" || langInfo == "qartvelian" || langInfo == "kartvellian" || langInfo == "kartvelian" || langInfo == "qartuli" || langInfo == "gorgian" || langInfo == "ge") {
			return "geo";
		} else {
			return "eng";
		}
	}
}