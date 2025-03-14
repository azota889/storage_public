//Replace all for string
if (typeof String.prototype.replaceAll == 'undefined') {
	String.prototype.replaceAll = function (search, replacement) {
		var target = this;
		return target.replace(new RegExp(search, 'g'), replacement);
	};
}
//Cookie utils
function setCookie(cname, cookieValue, expiredDays) {
	try {
		const d = new Date();
		d.setTime(d.getTime() + expiredDays * 24 * 60 * 60 * 1000);
		let expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cookieValue + ';' + expires + ';path=/';
	} catch (ex) {}
}
function getCookie(cname) {
	try {
		let name = cname + '=';
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	} catch (ex) {
		return '';
	}
}

//WebApp post message
function fromFlutter(data) {
	if (typeof data === 'object') {
		data = JSON.stringify(data);
	}
	console.log('Index.html - Call from Flutter', data);
	sendEventToAngular(data);
}
function sendEventToAngular(data) {} //Override in angular

//Replace html to index.html
function replaceHtmlContent() {
	try {
		//Loading HTML
		var loadingHTML = `
            <div style="margin: auto; width: 300px; text-align: center">
                <svg width="48px" class="azt-svg-loading jobing-j" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" class="w-12 mx-auto" style="enable-background: new 0 0 109 92.9" viewBox="0 0 109 92.9">
                    <path d="M90.8 52c3.5 6.2 7.1 11.7 9.8 17.7 4.4 9.7-2.9 20.7-13.8 20.9-11.8.2-23.7.2-35.5 0-11-.1-17.6-12.2-12-21.7.4-.8 1.8-1.4 2.7-1.4 9.9-.1 19.7-.1 29.6-.1 9.8 0 15.9-4.6 18.7-14 .1-.2.2-.5.5-1.4z" class="azt-svg-loading jobing-j" />
                    <path d="M39.6 90.3c-6.8 0-13.8.8-20.5-.2-9.7-1.4-15-12.8-10.3-21.3 5.9-10.9 12.1-21.6 18.5-32.2 5.5-9 18.6-8.7 24.2.2.7 1.1.8 1.9.1 3.1C46.7 48.3 42 57 36.8 65.3c-5.3 8.4-3.8 18.8 2.5 24.6.2 0 .2.3.3.4z" class="azt-svg-loading jobing-j" />
                    <path d="M32.5 27.3c3.3-5.7 6.1-11 9.4-16 5.9-9.1 19.4-9.2 25.1 0 6.5 10.4 12.6 21 18.3 31.7 4.8 9-1.5 19.9-11.5 20.7-1.6.1-2.6-.2-3.5-1.8-4.8-8.6-9.8-17.1-14.7-25.6-4.7-8.3-12.5-11.6-21.7-9.2-.3 0-.6 0-1.4.2z" />
                </svg>
                <div class="mt-2 mr-auto">
                    <a id="reloadPage" onclick="location.reload()" class="font-medium aztTranslate" style="display: none;" lang="lang_index_loading_message"></a>
                    <p id="messageFirstPage" class="font-medium aztTranslate" lang="lang_index_loading_message_first"></p>
                    <p style="padding-top:20px">
                        <span style="color:red" id="azt_show_error_info"></span>
                        <span id='azt_show_timer'></span>
                        <span id='azt_internet_speed'></span>
                        <span>Version: ${GLOBAL_CURRENT_VERSION} - ${GLOBAL_SHOW_CDN_NAME}</span>
                        <span id="currentBrowserInfoWhenError"></span>
                    </p>
                </div>
            </div>
        `;
		document.getElementById('indexLoading').innerHTML = loadingHTML;

		//UnSupport browser HTML
		var unSupportBrowserHTML = `
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <div style="border: 1px solid #ccc; padding: 10px; border-radius: 3px; background: white; margin: 16px">
                        <!--App notice-->
                        <div id="unSupportBrowserInIosApp" style="display: none;">
                            <p><span class="aztTranslate" lang="lang_index_browser_please_upgrade_new_ios_version"></span></p>
                        </div>
                        <div id="unSupportBrowserInAndroidApp" style="display: none;">
                            <p><span class="aztTranslate" lang="lang_index_browser_please_upgrade_new_android_version"></span></p>
                        </div>
                        <div id="unSupportBrowserInUnknownOperatingSystem" style="display: none;">
                            <p><span class="aztTranslate" lang="lang_index_browser_please_upgrade_new_unknown_version"></span></p>
                        </div>

                        <!--InApp browser: Zalo, Facebook, Twitter...-->
                        <div id="unSupportInAppBrowser" style="display: none;">
                            <p><span class="aztTranslate" lang="lang_index_browser_please_open_to_external_browser_that_is_not_in_app_browser"></span></p>
                        </div>

                        <!--Normal browser-->
                        <div id="unSupportNormalBrowser" style="display: none;">
                            <p id="unSupportNormalBrowserInIOS" style="display: none;"><span class="aztTranslate" lang="lang_index_browser_please_upgrade_ios_browser"></span></p>
                            <p id="unSupportNormalBrowserInAndroid" style="display: none;"><span class="aztTranslate" lang="lang_index_browser_please_upgrade_android_browser"></span></p>
                            <p id="unSupportNormalBrowserInOther" style="display: none;"><span class="aztTranslate" lang="lang_index_browser_please_upgrade_browser"></span></p>
                            <p><span class="aztTranslate" lang="lang_index_browser_best_browser"></span>:</p>
                            <p><span class="aztTranslate" lang="lang_index_browser_chrome_pc_laptop"></span>: <a href="https://www.google.com/chrome" target="_blank">https://www.google.com/chrome</a></p>
                            <p><span class="aztTranslate" lang="lang_index_browser_chrome_iphone_ipad"></span>: <a href="https://apps.apple.com/us/app/google-chrome/id535886823" target="_blank">https://apps.apple.com/us/app/google-chrome/id535886823</a></p>
                            <p><span class="aztTranslate" lang="lang_index_browser_chrome_android"></span>: <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank">https://play.google.com/store/apps/details?id=com.android.chrome</a></p>
                        </div>

                        <!--Browser info: useragent + ES js version-->
                        <p id="currentBrowserInfo"></p>
                        <p id="currentBrowserError"></p>
                    </div>
                </div>
                <div class="col-sm-2"></div>
            </div>
        `;
		document.getElementById('unSupportBrowser').innerHTML = unSupportBrowserHTML;
	} catch (ex) {}
}
replaceHtmlContent();

//Get default language from localStorage
var aztCurrentLanguage = 'vi';
try {
	//Get default language in localStorage
	var aztSupportLanguages = ['vi', 'en'];
	aztCurrentLanguage = localStorage ? localStorage.getItem('switch_language_code') : 'vi';
	aztCurrentLanguage = aztSupportLanguages.indexOf(aztCurrentLanguage) !== -1 ? aztCurrentLanguage : 'vi';
} catch (ex) {}

//Define all language keys
var aztTranslates = {
	vi: {
		lang_index_title: 'Azota - Nền Tảng Tạo Đề Thi, Bài Tập Online',
		lang_index_description: 'Nền Tảng Tạo Đề Thi, Bài Tập Online',
		lang_index_facebook_chat_box_message: 'Xin chào thầy/cô. Em có thể hỗ trợ gì cho thầy cô?',
		lang_index_loading_message: 'Nếu đợi lâu quá, vui lòng <span class="text-primary">bấm vào đây</span> để tải lại dữ liệu',
		lang_index_loading_message_first: 'Đang tải dữ liệu ...',
		lang_index_error_to_load_js: 'Lỗi tải dữ liệu, có thể do mạng của bạn chậm quá, vui lòng tải lại trang để thử lại',
		lang_index_the_system_will_reload_after_some_second: 'Hệ thống sẽ tự động tải lại trang sau [SECOND] giây',

		lang_index_browser_please_upgrade_ios_browser: 'Phiên bản trình duyệt quá cũ, vui lòng cập nhật phiên bản iOS và trình duyệt mới nhất để dùng Azota!',
		lang_index_browser_please_upgrade_android_browser: 'Phiên bản trình duyệt quá cũ, vui lòng cập nhật phiên bản Android và trình duyệt mới nhất để dùng Azota!',
		lang_index_browser_please_upgrade_browser: 'Phiên bản trình duyệt quá cũ, vui lòng cập nhật phiên bản trình duyệt mới nhất để dùng Azota!',
		lang_index_browser_best_browser: 'Hệ thống hỗ trợ tốt trên trình duyệt Chrome 85+, Edge 85+, Firefox 78+, Safari 14+, Opera 72+, Android WebView 85+, Samsung Internet 13+',
		lang_index_browser_chrome_pc_laptop: 'Chrome PC-Laptop',
		lang_index_browser_chrome_iphone_ipad: 'Chrome iPhone, iPad',
		lang_index_browser_chrome_android: 'Chrome Android',

		lang_index_browser_please_upgrade_new_ios_version: 'Phiên bản iOS quá cũ, vui lòng cập nhật phiên bản iOS >= 14.0 để sử dụng!',
		lang_index_browser_please_upgrade_new_android_version: 'Phiên bản Android quá cũ, vui lòng cập nhật phiên bản Android >= 10.0 để sử dụng!',
		lang_index_browser_please_upgrade_new_unknown_version: 'Phiên bản hệ điều hành quá cũ, vui lòng cập nhật phiên bản mới nhất để sử dụng!',
		lang_index_browser_please_open_to_external_browser_that_is_not_in_app_browser: 'Phiên bản Browser trong các app như Zalo, Facebook, Twitter... quá cũ, vui lòng mở trên trình duyệt như Chrome, Firefox, Edge...'
	},
	en: {
		lang_index_title: 'Azota - Create homework or exam for testing online',
		lang_index_description: 'Azota - Create homework or exam for testing online',
		lang_index_facebook_chat_box_message: 'Hello teacher, How can I help you?',
		lang_index_loading_message: 'If it takes too long, <span class="text-primary">please click here</span> to reload data',
		lang_index_loading_message_first: 'Loading data ...',
		lang_index_error_to_load_js: 'Error to load data, may be your Internet is slow, please reload the page to try again',
		lang_index_the_system_will_reload_after_some_second: 'The system will auto reload after [SECOND] seconds',

		lang_index_browser_please_upgrade_ios_browser: 'The browser version is out of date, please update iOS and browser to latest version to use Azota!',
		lang_index_browser_please_upgrade_android_browser: 'The browser version is out of date, please Android and browser to latest version to use Azota!',
		lang_index_browser_please_upgrade_browser: 'The browser version is out of date, please update browser to latest version to use Azota!',
		lang_index_browser_best_browser: 'Good support system on Chrome 85+, Edge 85+, Firefox 78+, Safari 14+, Opera 72+, Android WebView 85+, Samsung Internet 13+ browser',
		lang_index_browser_chrome_pc_laptop: 'Chrome PC-Laptop',
		lang_index_browser_chrome_iphone_ipad: 'Chrome iPhone, iPad',
		lang_index_browser_chrome_android: 'Chrome Android',

		lang_index_browser_please_upgrade_new_ios_version: 'iOS version is out of date, please upgrade iOS >= 14.0 to use!',
		lang_index_browser_please_upgrade_new_android_version: 'Android version is out of date, please upgrade Android >= 10.0 to use!',
		lang_index_browser_please_upgrade_new_unknown_version: 'The Operating System is out of date, please upgrade new Operating System to use!',
		lang_index_browser_please_open_to_external_browser_that_is_not_in_app_browser: 'The Browser in some apps: Zalo, Facebook, Twitter... is out of date, please open the link in Chrome, Firefox, Edge... browser.'
	}
};
function aztMyTranslate(key) {
	try {
		if (aztTranslates.hasOwnProperty(aztCurrentLanguage) && aztTranslates[aztCurrentLanguage].hasOwnProperty(key)) {
			return aztTranslates[aztCurrentLanguage][key];
		} else {
			return key;
		}
	} catch (ex) {
		return key;
	}
}

//Translate meta title + description
function translateMetaTag() {
	try {
		//Translate for meta title
		document.title = aztMyTranslate('lang_index_title');
		var metaTitle = document.querySelector('meta[property="og:title"]');
		if (metaTitle) {
			metaTitle.setAttribute('content', aztMyTranslate('lang_index_title'));
		}
		var metaDescription = document.querySelector('meta[property="og:description"]');
		if (metaDescription) {
			metaDescription.setAttribute('content', aztMyTranslate('lang_index_description'));
		}

		//Translate all other language keys
		var translateElements = document.getElementsByClassName('aztTranslate');
		if (translateElements && translateElements.length > 0) {
			for (var i = 0; i < translateElements.length; i++) {
				var aztLangKey = translateElements[i].getAttribute('lang');
				if (aztLangKey) {
					translateElements[i].innerHTML = aztMyTranslate(aztLangKey);
				}
			}
		}
	} catch (ex) {
		alert(ex);
	}
}
translateMetaTag();

//Check is mobileWebView
var isMobileWebView = false;
function checkIsMobileWebView() {
	try {
		var isMobInStorage = localStorage ? localStorage.getItem('azt-wv-mob') : '0';
		var currentUrl = window.location.href;
		isMobileWebView = currentUrl && (currentUrl.indexOf('mob=1') !== -1 || isMobInStorage == '1') ? true : false;
	} catch (ex) {}
}
checkIsMobileWebView();

//Check version of ES Js of browser-->
function isCommonInAppBrowser() {
	const userAgent = navigator.userAgent;
	let browserName = '';
	if (userAgent.indexOf('FBAN') > -1 || userAgent.indexOf('FBAV') > -1) {
		browserName = 'Facebook in-app browser';
	} else if (userAgent.indexOf('Zalo') > -1) {
		browserName = 'Zalo in-app browser';
	} else if (userAgent.indexOf('Twitter') > -1) {
		browserName = 'Twitter in-app browser';
	} else if (userAgent.indexOf('Instagram') > -1) {
		browserName = 'Instagram in-app browser';
	} else if (userAgent.indexOf('Line') > -1) {
		browserName = 'Line in-app browser';
	} else if (userAgent.indexOf('MicroMessenger') > -1) {
		browserName = 'WeChat in-app browser';
	} else if (userAgent.indexOf('QQ') > -1) {
		browserName = 'QQ in-app browser';
	} else if (userAgent.indexOf('KAKAOTALK') > -1) {
		browserName = 'KakaoTalk in-app browser';
	}
	return browserName ? true : false;
}
function getECMAVersion() {
	try {
		if (typeof navigator !== 'undefined' && /Firefox\/(\d+)/.test(navigator.userAgent)) {
			var firefoxVersion = parseInt(RegExp.$1);
			if (firefoxVersion >= 96) {
				return 'ES2023';
			} else if (firefoxVersion >= 89) {
				return 'ES2022';
			} else if (firefoxVersion >= 60) {
				return 'ES2018';
			} else if (firefoxVersion >= 52) {
				return 'ES2017';
			} else if (firefoxVersion >= 45) {
				return 'ES2016';
			} else if (firefoxVersion >= 38) {
				return 'ES2015';
			} else {
				return 'ES5 or lower';
			}
		} else if (typeof Promise.any === 'function') {
			return 'ES2022';
		} else if (typeof BigInt === 'function') {
			return 'ES2020';
		} else if (typeof Set !== 'undefined' && typeof Set.prototype['@@iterator'] === 'function') {
			return 'ES6';
		} else if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
			return 'ES7';
		} else if (typeof async function () {}.then === 'function') {
			return 'ES2017+';
		} else if (typeof String.prototype.padStart === 'function') {
			return 'ES2017';
		} else if (typeof Object.values === 'function') {
			return 'ES2017';
		} else if (typeof Object.entries === 'function') {
			return 'ES2017';
		} else if (typeof Array.prototype.includes === 'function') {
			return 'ES2016';
		} else if (typeof Math.sign === 'function') {
			return 'ES2015';
		} else {
			return 'ES5 or lower';
		}
	} catch (ex) {
		return 'unknown';
	}
}
function isES2020Supported() {
	try {
		eval('BigInt(1)');
	} catch (ex) {
		setError('Error - BigInt(1):' + ex);
		return false;
	}

	try {
		eval('Promise.allSettled([Promise.resolve()])');
	} catch (ex) {
		setError('Error - Promise.allSettled:' + ex);
		return false;
	}

	try {
		eval('1n ** 1n');
	} catch (ex) {
		setError('Error - 1n ** 1n:' + ex);
		return false;
	}

	try {
		eval('({ a: 1 })?.a');
	} catch (ex) {
		setError('Error - ({ a: 1 })?.a:' + ex);
		return false;
	}

	try {
		eval('"".matchAll()');
	} catch (ex) {
		setError('Error - "".matchAll():' + ex);
		return false;
	}

	console.log('Support >= ES2020');
	return true;
}
function setError(error) {
	console.log('Not support >= ES2020: ' + error);
	if (document.getElementById('currentBrowserError')) {
		document.getElementById('currentBrowserError').innerHTML = 'Error: ' + error;
	}
}
function isAndroid() {
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf('android') > -1; //&& ua.indexOf("mobile");
	if (isAndroid) {
		return true;
	}
	return false;
}
function isIOS() {
	return (
		['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || // iPad on iOS 13 detection
		(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
	);
}
function checkBrowserSupport() {
	try {
		if (!isES2020Supported()) {
			//Show browser unsupported
			if (document.getElementById('unSupportBrowser')) {
				document.getElementById('unSupportBrowser').style = '';
			}
			if (document.getElementById('currentBrowserInfo')) {
				document.getElementById('currentBrowserInfo').innerHTML = navigator.userAgent + ' | ' + getECMAVersion();
			}

			//Show info for App | Normal Browser | InApp Browser
			if (isMobileWebView) {
				if (isIOS() && document.getElementById('unSupportBrowserInIosApp')) {
					document.getElementById('unSupportBrowserInIosApp').style = '';
				} else if (isAndroid() && document.getElementById('unSupportBrowserInAndroidApp')) {
					document.getElementById('unSupportBrowserInAndroidApp').style = '';
				} else if (document.getElementById('unSupportBrowserInUnknownOperatingSystem')) {
					document.getElementById('unSupportBrowserInUnknownOperatingSystem').style = '';
				}
			} else if (isCommonInAppBrowser() && document.getElementById('unSupportInAppBrowser')) {
				document.getElementById('unSupportInAppBrowser').style = '';
			} else if (document.getElementById('unSupportNormalBrowser')) {
				document.getElementById('unSupportNormalBrowser').style = '';

				if (isIOS() && document.getElementById('unSupportNormalBrowserInIOS')) {
					document.getElementById('unSupportNormalBrowserInIOS').style = '';
				} else if (isAndroid() && document.getElementById('unSupportNormalBrowserInAndroid')) {
					document.getElementById('unSupportNormalBrowserInAndroid').style = '';
				} else if (document.getElementById('unSupportNormalBrowserInOther')) {
					document.getElementById('unSupportNormalBrowserInOther').style = '';
				}
			}

			//Stop loading
			if (document.getElementById('indexLoading')) {
				document.getElementById('indexLoading').style = 'display:none';
			}
		}
	} catch (ex) {}
}
checkBrowserSupport();

//Check darkMode
function switchModeUI() {
	try {
		let mode = localStorage.getItem('mode_ui') == '' || !localStorage.getItem('mode_ui') ? 'light' : localStorage.getItem('mode_ui');
		let htmlEl = document.getElementById('azota-app-html');
		if (htmlEl && htmlEl.classList) {
			if (mode == 'dark') {
				htmlEl.classList.remove('light');
				htmlEl.classList.add('dark');
			} else {
				htmlEl.classList.remove('dark');
				htmlEl.classList.add('light');
			}
		}
	} catch (ex) {}
}
switchModeUI();

//Show reload page link
function showReloadLink() {
	try {
		let reloadPageEl = document.getElementById('reloadPage');
		let messageFirstPage = document.getElementById('messageFirstPage');
		if (reloadPageEl && messageFirstPage) {
			setTimeout(() => {
				reloadPageEl.style.display = 'block';
				messageFirstPage.style.display = 'none';
			}, 5000);
		}
	} catch (ex) {}
}
showReloadLink();

//Test internet speed
function testInternetSpeed() {
	try {
		var startTime = new Date().getTime();
		var testFileURL = 'https://239114911.e.cdneverest.net/cdnazota/azt-assets/core-mod-assets/index-assets/test_internet_speed.mp3';
		fetch(testFileURL)
			.then(function (response) {
				if (response.ok) {
					var endTime = new Date().getTime();
					var duration = (endTime - startTime) / 1000; // Convert to seconds
					var fileSize = response.headers.get('content-length') / 1024 / 1024; // Convert to megabytes
					var downloadSpeed = (fileSize / duration).toFixed(2); // Mbps
					document.getElementById('azt_internet_speed').innerHTML = downloadSpeed + ' Mbps. ';
				} else {
					document.getElementById('azt_internet_speed').innerHTML = ' Error s1. ';
				}
			})
			.catch(function (error) {
				document.getElementById('azt_internet_speed').innerHTML = ' Error s2. ';
			});
	} catch (ex) {}
}

//Check error and switch index cdn page
function aztErrorWhenLoadJs(mustReload, jsFile) {
	var errorMessage = '';
	try {
		var errorTime = new Date().getTime() - GLOBAL_START_MILLISECOND + ' milliseconds';
		if (GLOBAL_IS_PRODUCTION) {
			if (navigator.cookieEnabled) {
				//Check cookie have azota_cdn -> just alert error -> else -> switch cookie to azota_cdn and reload the current page
				var aztCookieName = 'current_cdn';
				if (getCookie(aztCookieName) && getCookie(aztCookieName) == 'azota_cdn') {
					errorMessage = aztMyTranslate('lang_index_error_to_load_js') + ` - ${errorTime} - Have Cookie - Show error - ${jsFile}`;
				} else {
					errorMessage = aztMyTranslate('lang_index_error_to_load_js') + ` - ${errorTime} - Have cookie - Set new value - ${jsFile}`;
					setCookie(aztCookieName, 'azota_cdn', 1);
					setTimeout(() => {
						location.href = window.location.href.replace('?current_cdn=empty', '').replace('&current_cdn=empty', '');
					}, 2 * 1000);
				}
			} else {
				errorMessage = aztMyTranslate('lang_index_error_to_load_js') + ` - ${errorTime} - Non Cookie - ${jsFile}`;
			}
		} else {
			errorMessage = aztMyTranslate('lang_index_error_to_load_js') + ` - ${errorTime} - Dev version - ${jsFile}`;
		}
	} catch (ex) {
		errorMessage = 'Exception at aztErrorWhenLoadJs1: ' + ex;
	}

	if (errorMessage) {
		try {
			if (document.getElementById('azt_show_error_info').innerHTML) {
				document.getElementById('azt_show_error_info').innerHTML += jsFile + '. ';
			} else {
				document.getElementById('azt_show_error_info').innerHTML = errorMessage + '. ';
			}
			document.getElementById('currentBrowserInfoWhenError').innerHTML = '. ' + navigator.userAgent + ' | ' + getECMAVersion();
			if (mustReload) {
				//Check internet speed
				testInternetSpeed();

				//Show count down to reload the page
				var countTimer = 20;
				var currentInternal = setInterval(function () {
					countTimer -= 1;
					if (countTimer <= 0) {
						location.reload();
						clearInterval(currentInternal);
					}
					document.getElementById('azt_show_timer').innerHTML = aztMyTranslate('lang_index_the_system_will_reload_after_some_second').replace('[SECOND]', countTimer) + '. ';
				}, 1000);
			}
		} catch (ex) {
			alert('Exception at aztErrorWhenLoadJs2: ' + ex);
		}
	}
}
function saveAndRemoveCdnByUrlParam() {
	try {
		var cookieName = 'current_cdn';
		var curUrl = window.location.href;
		if (curUrl.indexOf('current_cdn=empty') !== -1) {
			setCookie(cookieName, '', 1);
		}
		if (curUrl.indexOf('current_cdn=azota_cdn') !== -1) {
			setCookie(cookieName, 'azota_cdn', 1);
		}
		/*if (curUrl.indexOf('current_cdn=amazon_cdn') !== -1) {
			setCookie(cookieName, 'amazon_cdn', 1);
		}*/
	} catch (ex) {}
}
saveAndRemoveCdnByUrlParam();
