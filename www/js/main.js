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

function checkJob(job) {
	if (job == "translation_for_lang_names" || job == "translation_for_the_main_text") {
		return true;
	}
	return false;
}

function checkOtherInfo(otherInfo) {
	if (otherInfo == null || otherInfo == undefined || typeof otherInfo !== 'number' || otherInfo < 0 || otherInfo % 1 !== 0) {
		return false;
	}
	return true;
}

function ketoTranslatorHelper_SecurityManager(b, c) {
	if (Array.isArray(b) && b[0] !== undefined && b[0] !== null && typeof c == 'number' && c % 1 == 0 && c >= 0) {
		for (var i = 0; i < b.length; i++) {
			if (b[i] == null || b[i] == undefined || Array.isArray(b[i])) {
				return false;
			}
		}
		return true;
	}
	return false;
}

function actualTranslator(neededLang, givenArr, otherInfo) {
	if (neededLang == "rus") {
		if (!givenArr[otherInfo].textRus) { } else {
			return givenArr[otherInfo].textRus;
		}
	} else if (neededLang == "geo") {
		if (!givenArr[otherInfo].textGeo) { } else {
			return givenArr[otherInfo].textGeo;
		}
	} else {
		if (!givenArr[otherInfo].textEng) { } else {
			return givenArr[otherInfo].textEng;
		}
	}
}

function ketoTranslatorHelper(neededLang, givenArr, otherInfo) {
	if (ketoTranslatorHelper_SecurityManager(givenArr, otherInfo) == true) {
		return actualTranslator(neededLang, givenArr, otherInfo);
	} else {
		return "error";
	}
}

function ketoTranslator_SecurityManager(a, b, c, d) {
	if (checkJob(b) == true && checkOtherInfo(c) == true && d !== null && d[0] !== undefined && typeof d !== 'underfined' && Array.isArray(d)) {
		if (checkLang(a) == true) {
			return true;
		} else {
			return "eng"
		}
	} else {
		askForHelp(null);
		return false;
	}
}

function ketoTranslator(neededLang, job, otherInfo, givenArr) {
	securityKey = ketoTranslator_SecurityManager(neededLang, job, otherInfo, givenArr);
	if (securityKey == true) { } else if (securityKey == "eng") {
		neededLang = "eng";
	} else {
		return "error";
	}

	if (job == "translation_for_lang_names" || job == "translation_for_the_main_text") {
		return ketoTranslatorHelper(neededLang, givenArr, otherInfo);
	} else {
		return "error";
	}
}

// let's the user know if the server couldn't connect or disconnected and let's them know to contact us
function serverDisconnectErr() {
	alert("Server couldn\'t connect, try again later or contact us at " + ketoContactGmail_G);
}

// loads the whole page
function bodyOnloadFunc(contactedSiteInfo) {
	var xhttp = new XMLHttpRequest(); //use to connect to the servers
	var url = "@dynamicLink:8093/?type=mainPage";
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var fullArray = [JSON.parse(this.responseText)];
				var mainArray = fullArray[0][0];
				var headerTextArray = fullArray[0][1];
				var ketoSocialMediaArray = fullArray[0][2];
				addSocialMediasToFooter(ketoSocialMediaArray);
				fillGalleries(headerTextArray, mainArray);
				if (contactedSiteInfo == 'index') {
					fillPortfolioSection(mainArray);
				} else if (contactedSiteInfo == 'in_gallery') {
					fillImagesInGalleries("@infoForTheIDOfTheArrayOfTheGallery", mainArray);
				} else if (contactedSiteInfo == 'aboutme') {
					loadAboutKeto(maingLang_G);
				}
			} else {
				serverDisconnectErr();
			}
		}
	};
	xhttp.send();
}

// fills the images in the galleries in
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

// fills the names of the galleries in the header
function fillGalleries(headerTextArray, mainArray) {
	var galleriesContent_DIV = document.getElementById('galleriesContent');
	galleriesContent_DIV.innerHTML = "";

	for (var i = 0; i < mainArray.length; i++) {
		galleriesContent_DIV.innerHTML = galleriesContent_DIV.innerHTML + "<a class=\"a2\" href=\"@dynamicLink:8091/?page=in_gallery&galleryID=" + mainArray[i].id + "&lang=" + maingLang_G + "\">" + ketoTranslator(maingLang_G, "translation_for_lang_names", i, mainArray) + "</a> ";
	}
	fillBlanks(maingLang_G, headerTextArray);
}

// fills the portfolio section
function fillPortfolioSection(mainArray) { //ISN'T TESTED VIA test.js
	var viewMyWorkHomePageId_DIV = document.getElementById('viewMyWorkHomePageId');
	viewMyWorkHomePageId_DIV.innerHTML = "";

	for (var i = 0; i < mainArray.length; i++) {
		var coverImg = mainArray[i].cover;
		// var coverAlbumName = mainArray[i].folderName;
		viewMyWorkHomePageId_DIV.innerHTML = viewMyWorkHomePageId_DIV.innerHTML + "<a class=\"viewMyWorkA\" href=\"@dynamicLink:8091/?page=in_gallery&galleryID=" + mainArray[i].id + "&galleryfolderName=" + mainArray[i].folderName + "&lang=" + maingLang_G + "\"> <img class=\"viewMyWorkImg\" width=550px height=400px src=\"@dynamicLink:8092/?type=albumCover&coverImg=" + coverImg + "\"> </a>";
	}
}

// fills out the words in website in different languages (currently English, Russian and Georgian)
function fillBlanks(language, headerTextArray) { //ISN'T TESTED VIA test.js
	for (let i = 0; i < headerTextArray.length; i++) {
		if (document.getElementById(headerTextArray[i].id) !== null) {
			document.getElementById(headerTextArray[i].id).innerHTML = ketoTranslator(language, "translation_for_the_main_text", i, headerTextArray);
		}
	}
}

function addSocialMediasToFooter(ketoSocialMediaArray) {
	var footerSocialMediaPDiv = document.getElementById('footerSocialMediaP');
	footerSocialMediaPDiv.innerHTML = "";
	for (var i = 0; i < ketoSocialMediaArray.length; i++) {
		var toSend = "<a class=\"footerImgA\" href=\"" + ketoSocialMediaArray[i].link + "\"><img class=\"footerImg\" width=40px length=40px src=\"@dynamicLink:8092/?type=icon&img=" + ketoSocialMediaArray[i].platformName + ".png\"></a>";
		footerSocialMediaPDiv.innerHTML = footerSocialMediaPDiv.innerHTML + toSend;
	}
}

function loadAboutKeto(lang) {
	var xhttp = new XMLHttpRequest(); //use to connect to the servers
	var url = "@dynamicLink:8093/?page=aboutme&lang=" + lang
	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var aboutKetoPElement = document.getElementById("aboutKetoP");
				aboutKetoPElement.innerHTML = this.responseText;
			} else {
				serverDisconnectErr();
			}
		}
	};
	xhttp.send();
}

// If we're running under Node
/*
	exports only exists if we're running main.js as node (which is when we're testing it), so when it is being ran as node it'll export
	all the functions which can be tested.

	If it is not running in node, or in other words probably not being tested, then it'll not run, as exports would be undefined, and in the
	if condition, the functions are only exported when it is not undefined.
*/
if (typeof exports !== 'undefined') {
	exports.serverDisconnectErr = serverDisconnectErr;

	exports.ketoTranslatorHelper = ketoTranslatorHelper;
	exports.checkOtherInfo = checkOtherInfo;
	exports.checkJob = checkJob;
	exports.languageChooser = languageChooser;
	exports.checkLang = checkLang;
	exports.askForHelp = askForHelp;
	exports.ketoTranslator_SecurityManager = ketoTranslator_SecurityManager;
	exports.ketoTranslator = ketoTranslator;
	exports.ketoTranslatorHelper_SecurityManager = ketoTranslatorHelper_SecurityManager;
	exports.actualTranslator = actualTranslator;

	exports.fillBlanks = fillBlanks;
	exports.fillPortfolioSection = fillPortfolioSection;
	exports.fillGalleries = fillGalleries;
	exports.fillImagesInGalleries = fillImagesInGalleries;
	exports.bodyOnloadFunc = bodyOnloadFunc;
}