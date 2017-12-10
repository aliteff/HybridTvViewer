var devicesList = { // example of list to fill and provide in input form
    '2009': [
        { 'brand': 'LG', 'model': '32LE5510' }
    ],
    '2010': [
        { 'brand': 'PANASONIC', 'model': 'TX-P42VT30E' }
    ],
    '2011': [
        { 'brand': 'SAMSUNG', 'model': 'UE40-D7000' },
        { 'brand': 'SONY', 'model': 'KDL-24EX320' }
    ],
    '2012': [
        { 'brand': 'SAMSUNG', 'model': 'UE40-ES7000' },
        { 'brand': 'SONY', 'model': 'KDL-32EX650' }
    ],
    '2013': [
        { 'brand': 'SAMSUNG', 'model': 'UE32-F4500' },
        { 'brand': 'SONY', 'model': 'KDL-42W650A' }
    ],
    '2014': [
        { 'brand': 'SAMSUNG', 'model': 'UE46-H7000' },
        { 'brand': 'SONY', 'model': 'KDL-32W705B' }
    ],
    '2015': [
        { 'brand': 'SAMSUNG', 'model': 'UE40-JU6000K' },
        { 'brand': 'SONY', 'model': 'KDL-50W805C' }
    ],
    '2016': [
        { 'brand': 'SAMSUNG', 'model': 'UE55-KU6650' },
        { 'brand': 'SONY', 'model': 'KDL-32WD603' }
    ]
};

function checkOnlyOne(currentCheckbox) {
    if (!currentCheckbox.checked) return;
    var fields = document.getElementsByName(currentCheckbox.name);
    for(var idx = 0; idx < fields.length; idx++) {
        var field = fields[idx];
        if (field.checked && field !== currentCheckbox) field.checked=false;
    }
}

function setCiVersion(hbbVersion) {
    var ciplusCheckbox = document.querySelectorAll('input[name="hbb_ciplus"]');
    if (ciplusCheckbox.length > 0) {
        switch (hbbVersion) {
        case '1.0':
            ciplusCheckbox[0].textContent = 'CI+ V1.1';
            break;
        case '1.1':
            ciplusCheckbox[0].textContent = 'CI+ V1.2';
            break;
        case '1.5':
            ciplusCheckbox[0].textContent = 'CI+ V1.3';
            break;
        case '2.0':
        case '2.0.1':
            ciplusCheckbox[0].textContent = 'CI+ V1.4';
            break;
        default:
            ciplusCheckbox[0].textContent = 'CI+';
            break;
        }
        ciplusCheckbox[0].textContent += ' (Common Interface)';
    }
}

function generateModel() { // generating device model by using HbbTV version (i.e. year + features)

}

function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        element.className += ' ' + className;
    }
}

function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
}

function isUrlStored(url) {
    var urlFound = false, hybridPages = localStorage.getItem('tvViewer_tabs');
    hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

    for (var i = 0, l = hybridPages.length; i < l; i++) {
        if (hybridPages[i].indexOf(url) !== -1) {
            urlFound = true;
            break;
        }
    }
    return urlFound;
}

function getUrlDomain(url) {
    return url ? url.split('/').slice(0, 3).join('/') : '';
}

function checkAndStoreUrl(url, forceToDelete) {
    var hybridPages = localStorage.getItem('tvViewer_tabs');
    hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

    var domainOnly = getUrlDomain(url);
    var urlFound = isUrlStored(domainOnly);
    if (!urlFound && url) {
        hybridPages.push(url); // TODO: add the type of recognized hybrid technology (to update setBadgeText)
        localStorage.setItem('tvViewer_tabs', JSON.stringify(hybridPages));
    } else if (forceToDelete) {
        var idx = hybridPages.indexOf(domainOnly);
        hybridPages.splice(idx, 1);
        localStorage.setItem('tvViewer_tabs', JSON.stringify(hybridPages));
    }
    return urlFound;
}

function getCurrentTabUrl(callback) {
    //return new Promise(function(resolve, reject) { // wait for chrome to put a Promise as Firefox browser API did
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            //return resolve(tab.url);
            callback(tab.url);
        });
    //});
}

function isCurrentTabInList(callback) {
    getCurrentTabUrl(function(tabUrl) {
        var domain = getUrlDomain(tabUrl);
        var state = isUrlStored(domain);
        callback(state, tabUrl);
    });
}

window.onload = function() {
    function disableExtensionIcon(callback) { // Utility method to patch Firefox bug with bad icon update
        var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), img = new Image();
        function drawIcon() {
            canvas.width = canvas.height = 38;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
            chrome.browserAction.setIcon && chrome.browserAction.setIcon({ 'imageData': dataImg }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            });
            //callback.call(this, dataImg);
            canvas = null;
        }
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAQAAAACNCElAAAEm0lEQVR4Aa3WA5Qk1wKA4e9W9Xi9O7Ft27Zt27Zt23bWse282NrdZM2MZ3r6vnO6x6voq2P8VVdV5b8UzMDdZXE+s+urYlior89M7DZm8V/8OYNYf9M2aZm4vQ0spwcMU4ukPvNN+lbloL3f1DzN2ERd0X8J+9vD"+
        "HNoMU6cgJ51SOqjy/gNfl9NFqNHZY73jEY5oCXWNtYhCVcVD81zlly6xu3UUl3SNTXQS22JBu5ySb2Y/2bM6CDdoV76eWy2mVdaH4R0/+z2pHhGri+MscX4rWlef9jnqfbJ7tAmXaDXLEp7ukPooXF02VI1OfgrVy+VOsJuMvMykioP01yJcqGCOWeLDNlKQ9WR6ht9M0w8VTYfEk8Ps8kqHVWzr85bYpQoqL3KmgvHh/OJ7"+
        "1JqBz1dzkxXlVQzM7KOqw5PNsUJ8XiXEnBNcb6Z+WCX3dJgL0ubeR7sVwmWYPTTd4CiIPFV8gCp/wRcHuyGUQvknxVsZTSaL7Cp2VfBR5pRclb+k9/2TFoonh0Dj8qW7u7ZlNWe50kmgKdnb4/6yXyrrX7cElL87cjNVmV+s3jNuoODjHkMZnjjEvDoa7QfrCN70LNjLkqIH+3w78tlCLLfCQst4J7MQC1tSXnhnSg1Se1lT"+
        "R98429EqLOdljSqdZVE/uI7wbk5AQ2m6pHeSOnFOJQp+AtE3PvChGjT61Ae+8K5PsYpFsIyF8J6xpD+GasjJzX5+mpyvdUiRkdAz6yjr2tQPGGtP69rXGK+gt7WwmhSvQfnIMAKCbD9JhthPqyryuUampHKgSQN4xelKrOo2q2B4IVZSNXliBGl3IUNlGkCUNGszRRf/87E1LWshy+TTI2Cp3CzZCJIkHyv/U2usTJsoyAsK"+
        "avS3psWdbB51BohQVlbZI4JQJ8lguBZxFujcELXq7wgL2l/iba/Ia5glzikvTCLBH3IQmM+M/OYFFGGIWnnN8+kHQRwnl+BHwxSs1Dfpq3DJ+cgr3lWn3aNe9ooBBmsRV5JAcS7+JBt4NWTvtzeYlGzsE39ZU3H2WRtC0U/vb+LXcB7W2MlDSsAjZYeq9hdN2TveoZRU0Q2bnaEmpHi+PD5lc4hZp89ytegv+GOV+KR5oHT0"+
        "+J13/0hDkPfizh5UAnGcnb3xF4Y4a3zU+pAqvWGzcxuniC2xV4qb77ebgs/CoT40Qw394vX2kFf62bC9D/pJPUGLF5c30DwKhjkrfUzWdNQu63KbyituaD50i/6qINFik//FU1UpmNdt2QvNMs1nKqrby4DWVBqL7rr1OTXygjavJU3Huki5gug7Q72b/JSOLKpqaM6VZSub57NS3MTaSuVlYvFD75995iiNusZ4PW3aL3NR"+
        "02w6qjbcxKbGXC9zqpRA6wAz9354+ekjW1MEXby6Sjgnbp5NdNIkp6NU5vPGa69+7rXJGrVJdLHBh1/vEU/MfJ0xPRklY4pu/GWvrZ5+bZzGv/DnePvcC+5p+3RZJU0dniyVidlfwtA/njrkq1y9en/dXj0Grv3CoS+e9/xNz903+L5Btw++fNBJ/bc7bQHlSgT/SKpIsRKlyhRLzMD/AbJMr8DBeL66AAAAAElFTkSuQmCC";
        drawIcon();
    }

    // Handle power button click ...
    var enableDisableButton = document.getElementById('power-button'), tabUrl;
    enableDisableButton.addEventListener("click", function(evt) {
        isCurrentTabInList(function(state, tabUrl) {
            if (state === true) {
                removeClass(enableDisableButton, 'enabled');
                checkAndStoreUrl(tabUrl, true);
                localStorage.setItem("tvViewer_active","false");

                //chrome.browserAction.setIcon({ path: '../img/tv-icon128-off.png' }); // buggy on Firefox 57 :(
                disableExtensionIcon();

                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    var tab = tabs[0];
                    chrome.tabs.executeScript(tab.id, {
                        code: "if (document.body) {document.body.classList.remove('centered','res720p','res1080p','res2160p'); document.documentElement.classList.remove('tvViewer');}"
                    }, function() {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        }
                    });
                });
            } else {
                addClass(enableDisableButton, 'enabled');
                checkAndStoreUrl(tabUrl);
                chrome.browserAction.setIcon && chrome.browserAction.setIcon({ path: '../img/tv-icon128-on.png' });
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    var tab = tabs[0];
                    var bcUrlInputField = document.querySelectorAll('input[name="broadcast_url"]');
                    chrome.tabs.executeScript(tab.id, {
                        code: 'if (localStorage.getItem("tvViewer_active")==null) { localStorage.setItem("tvViewer_active","true"); ' +
                        'localStorage.setItem("tvViewer_hbbtv","1.5"); ' +
                        'localStorage.setItem("tvViewer_resolution","res720p"); ' +
                        'localStorage.setItem("tvViewer_caps","{lang:eng,caps:\'+DRM\'}"); ' +
                        'localStorage.setItem("tvViewer_broadcast_url","' + bcUrlInputField[0].value + '"); }'
                    }, function() {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        }
                    });

                    chrome.tabs.reload(tab.id, {});
                });
            }
        });
    });
    isCurrentTabInList(function(state, tabUrl) {
        if (state === true) {
            addClass(enableDisableButton, 'enabled');
        } else {
            removeClass(enableDisableButton, 'enabled');
            disableExtensionIcon();
        }
    });

    // Handle bottom button click ...
    var enableDisableSitesButton = document.getElementById('sites-button');
    enableDisableSitesButton.addEventListener("click", function(evt) {
        var state = document.getElementById('sites').className;
        if (state.indexOf('shown') !== -1) {
            document.getElementById('options').style.visibility = "visible";
            document.getElementById('sites').className = "";
            document.getElementById('sites').textContent = "";
            enableDisableSitesButton.textContent = "Show identified sites";
        } else {
            var hybridPages = localStorage.getItem('tvViewer_tabs');
            hybridPages = hybridPages ? JSON.parse(hybridPages) : [];
            document.getElementById('options').style.visibility = "hidden";
            document.getElementById('sites').className = "shown";
            document.getElementById('sites').innerHTML = hybridPages.map(function(url) { return '<a target="_blank" href="' + url + '">' + url + '</a>'; }).join('<br />');
            enableDisableSitesButton.textContent = "Show configuration";
        }
    });

    var clearSitesButton = document.getElementById('clear-button');
    clearSitesButton.addEventListener("click", function(evt) {
        var hybridPages = localStorage.getItem('tvViewer_tabs');
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];
        if (hybridPages.length > 0) {
            localStorage.setItem('tvViewer_tabs', JSON.stringify(["http://itv.mit-xperts.com/hbbtvtest/capabilities/"]));
            document.getElementById('sites').innerHTML = hybridPages.map(function(url) { return '<a target="_blank" href="' + url + '">' + url + '</a>'; }).join('<br />');
        }
    });


    // Add listeners to the input fields ...
    var inputFields = document.querySelectorAll('input[type="radio"]');
    inputFields.forEach(function(inputField) {
        inputField.onchange = function(evt) {
            if (evt.target.value === 'ui_theme_dark') {
                addClass(document.documentElement, 'dark');
                removeClass(document.documentElement, 'light');
                localStorage.setItem('tvViewer_ui_dark', evt.target.value === 'ui_theme_dark' ? 'true' : 'false');
            } else if (evt.target.value === 'ui_theme_light') {
                addClass(document.documentElement, 'light');
                removeClass(document.documentElement, 'dark');
                localStorage.setItem('tvViewer_ui_dark', evt.target.value === 'ui_theme_dark' ? 'true' : 'false');
            } else if (evt.target.name === 'hbb_version' && evt.target.checked) {
                localStorage.setItem('tvViewer_hbbtv', evt.target.value);
                setCiVersion(evt.target.value);
            }


        };
    });
    inputFields = document.querySelectorAll('input[type="checkbox"]');
    inputFields.forEach(function(inputField) {
        if (!inputField.disabled) {
            inputField.onclick = function(evt) {
                localStorage.setItem('tvViewer_ui_centered', inputField.ui_centered ? 'true' : 'false');


            };

        }
    });
    inputFields = document.querySelectorAll('input[name="broadcast_url"]');
    if (inputFields.length == 1) {
        inputFields[0].onchange = function(evt) {
            localStorage.setItem('tvViewer_broadcast_url', evt.target.value);
        };
    }


    // Load from storage the input field values ...
    inputFields = document.querySelectorAll('input[name="ui_alignment"]');
    var value = localStorage.getItem('tvViewer_ui_centered');
    if (value === 'true') {
        inputFields.forEach(function(inputField) {
            inputField.checked = inputField.value === 'ui_centered';
        });
    }
    inputFields = document.querySelectorAll('input[name="ui_theme"]');
    value = localStorage.getItem('tvViewer_ui_dark');
    if (value === 'true') {
        inputFields.forEach(function(inputField) {
            inputField.checked = inputField.value === 'ui_theme_dark';
            if (inputField.value === 'ui_theme_dark') {
                inputField.dispatchEvent(new Event('change'/*, { 'bubbles': true }*/));
            }
        });
    }
    inputFields = document.querySelectorAll('input[name="hbb_version"]');
    value = localStorage.getItem('tvViewer_hbbtv');
    if (value) {
        inputFields.forEach(function(inputField) {
            inputField.checked = inputField.value === value;
        });
    }


    // update the shown XML capabilities using checked values ...
    domElement = document.getElementById('xmlCapabilities');
    if (domElement) {
        var cicamCasId = document.querySelector('input[name="cicam_casid"]');
        cicamCasId = parseInt(cicamCasId.value, cicamCasId.value.indexOf('0x') == 0 ? 16 : 10);
        domElement.textContent = '<profilelist>\n' +
'  <ui_profile name=\"OITF_HD_UIPROF+DRM+META_SI+AVCAD+DVB_T2+DVB_T+DVB_C+DVB_S2+DVB_C2\">\n' +
'    <ext>\n' +
'      <video_broadcast type=\"ID_DVB_T2\" scaling=\"arbitrary\" minSize=\"0\">true</video_broadcast>\n' +
'...\n' +
'      <drm DRMSystemID=\"urn:dvb:casystemid:19188\">MP4_MIPMP</drm>\n' +
'      <drm DRMSystemID=\"urn:dvb:casystemid:' + cicamCasId + '\" protectionGateways=\"ci+\">TS_PF</drm>\n' +
'    </ext>\n' +
'  </ui_profile>\n' +
'  <video_profile type=\"application/vnd.oipf.ContentAccessStreaming+xml\"/>';
    }

    // update the shown user-agent using checked values ...
    domElement = document.getElementById('userAgent');
    if (domElement) {


        domElement.innerHTML = 'Mozilla/5.0 (Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36 OPR/29.0.1803.0 OMI/4.5.23.37.ALSAN5.103 HbbTV/1.2.1 (; Sony; KDL-32WD603; v8.110-L1; 2016;) sony.hbbtv.tv.2016LE';
        // with useful fields put in bold style
    }

};