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

function checkLang(lang) {
	if (languageChooser(lang) == "rus" || languageChooser(lang) == "eng" || languageChooser(lang) == "geo") {
		return true;
	}
	return false;
}

function fillImagesInGalleries(galleryID, mainArray) {
	var imagesOfTheGalleryDiv = document.getElementById('imagesOfTheGallery');
	imagesOfTheGalleryDiv.innerHTML = "";
	var folderLock = null;
	for (var i = 0; i < mainArray.length; i++) {
		if (mainArray[i].id == parseInt(galleryID)) {
			folderLock = i;
		}
	}

	for (var i = 0; i < mainArray[folderLock].images.length; i++) {
		if (i % 4 == 0) {
			imagesOfTheGalleryDiv.innerHTML = imagesOfTheGalleryDiv.innerHTML + "<div class=\"centeredDivForImages\">"
		}
		imagesOfTheGalleryDiv.innerHTML = imagesOfTheGalleryDiv.innerHTML + "<img class=\"imgForIn_Gallery\" src=\"@dynamicLink:8092/?type=img&albumName=" + mainArray[folderLock].folderName + "&requestedImage=" + mainArray[folderLock].images[i] + "\">";
		if (i % 4 == 0) {
			imagesOfTheGalleryDiv.innerHTML = imagesOfTheGalleryDiv.innerHTML + "</div>"
		}
	}
}