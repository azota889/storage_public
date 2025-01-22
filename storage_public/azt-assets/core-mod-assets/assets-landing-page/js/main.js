function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie() {
    let lang = getCookie("languageAZT");
    if (lang != "") {
        if(lang == 'vi'){
            VietnameseLanguagePage();
        }else{
            EnglishLanguagePage()
        }
    } else {
        lang = getLanguageDefault();
        if(lang == 'vi-VN'){
            lang = 'vi'
        }else{
            lang = 'en'
        }
        if (lang != "" && lang != null) {
            setCookie("languageAZT", lang, 30);
        }
        if(lang == 'vi'){
            VietnameseLanguagePage()
        }else{
            EnglishLanguagePage()
        }
    }
}
function getLanguageDefault(){
    let userLang = 'vi-VN'
    return userLang;
}
function VietnameseLanguagePage() {
    let wrapperVN = document.getElementById('wrapper_vi');
    wrapperVN.style.display = 'block';
}
function EnglishLanguagePage() {
    let wrapperEN = document.getElementById('wrapper_en');
    wrapperEN.style.display = 'block';
}
function changeVNLanguage() {
    setCookie("languageAZT", 'vi', 30);
    location.reload()
}
function changeENLanguage() {
    console.log('en');
    setCookie("languageAZT", 'en', 30);
    location.reload()
}
checkCookie()


// wow js
new WOW().init();

