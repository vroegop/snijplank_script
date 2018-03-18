/**IMAGE SETTER **********************/
/**
 * 
 ************************************/

// init error list
window.errors = [];

// get dropdown list for images
var dropdown = document.querySelector('[name*=keuze_afbeelding]');

// font loader 
function loadScript(script) {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = script;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js');
loadScript('https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js');

if (dropdown) {

    // find product image
    var productImage = document.querySelector('p.article img');
    // find container of product image
    var productImageContainer = productImage.parentElement;
    // set position of container to relative, so we can place images on top easily
    productImageContainer.style.position = 'relative';

    function getImage() {
        var imageUrl = '/images_snijplank/' + dropdown.value.toLowerCase().trim().replace(' ', '') + '.png';

        return fetch(imageUrl)
            .then(image => image.arrayBuffer()
                .then(buffer => {
                    var base64Flag = 'data:image/jpeg;base64,';
                    return base64Flag + arrayBufferToBase64(buffer);
                }));
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));

        bytes.forEach((b) => binary += String.fromCharCode(b));

        return window.btoa(binary);
    };

    function setOverlayImage(image, vaandel) {

        // create image element for the overlay
        var imageOverlay = document.createElement('img');

        if (!vaandel) {
            imageOverlay.style.maxWidth = percentagePx(productImage.clientWidth, 25);
            imageOverlay.style.maxHeight = percentagePx(productImage.clientHeight, 25);
        } else {
            imageOverlay.style.width = percentagePx(productImage.clientWidth, 85);
            imageOverlay.style.height = percentagePx(productImage.clientHeight, 25);
        }

        imageOverlay.style.left = percentagePx(productImage.clientWidth, 8);
        imageOverlay.style.top = percentagePx(productImage.clientHeight, 10);

        imageOverlay.style.opacity = '0.8';
        imageOverlay.style.position = 'absolute';
        imageOverlay.classList.add('snijplank_afbeelding');

        imageOverlay.setAttribute('src', image);

        // add overlay to image container
        productImageContainer.appendChild(imageOverlay);
    }

    function percentagePx(size, percentage) {
        return size / 100 * percentage + 'px';
    }

    function removeOldImages() {
        var afbeeldingen = document.getElementsByClassName('snijplank_afbeelding');
        for (elem of afbeeldingen) {
            elem.parentNode.removeChild(elem);
        }
    }

    // add event listener to dropdown list

    function refreshImage() {
        refreshText();
        if (dropdown.selectedIndex != 0) {
            removeOldImages();
            getImage()
                .then(image => {
                    setOverlayImage(image, dropdown.value == 'Vaandel');
                })
                .catch(err => window.errors.push(err));
        }
    }

    dropdown.addEventListener('change', refreshImage);
}


/**TEXT SETTER **********************/
/**
 * 
 ************************************/

var inputEl = document.querySelector('[name*=tekst_]');
var fontSelect = document.querySelector('[name*=keuze_lettertype]');

if (fontSelect) {
    function createFontArray() {
        var fonts = [];
        for (var i = 0; i < fontSelect.options.length; i++) {
            if (i != 0)
                fonts.push(fontSelect.options[i].value.toLowerCase().replace(/\b\w/g, function (l) { return l.toUpperCase() }));
        }
        return fonts;
    }

    setTimeout(function () {
        WebFont.load({
            google: {
                families: createFontArray()
            }
        })
    }, 100);

    function createTextHolder(text) {
        var textElem = document.createElement('p');
        textElem.classList.add('snijplank-text-holder');

        textElem.style.position = 'absolute';

        if (dropdown.value == 'Vaandel') {
            textElem.style.left = percentagePx(productImage.clientWidth, 51);
            textElem.style.top = percentagePx(productImage.clientHeight, 14);
        } else {
            textElem.style.left = percentagePx(productImage.clientWidth, 8);
            textElem.style.top = percentagePx(productImage.clientHeight, 36);
        }
        textElem.style.fontFamily = fontSelect.options[fontSelect.selectedIndex].value.toLowerCase().replace(/\b\w/g, function (l) { return l.toUpperCase() });
        textElem.style.opacity = '0.7';
        textElem.style.fontSize = '13px';

        var text = document.createTextNode(text);
        textElem.appendChild(text);

        return textElem;
    }

    function addTextHolderToSnijplank(elem) {
        productImageContainer.appendChild(elem);
    }

    function removeTextHolders() {
        var afbeeldingen = document.getElementsByClassName('snijplank-text-holder');
        for (elem of afbeeldingen) {
            elem.parentNode.removeChild(elem);
        }
    }

    function circularText(txt, radius, classIndex) {
        txt = txt.split(""),
            classIndex = document.getElementsByClassName("snijplank-text-holder")[classIndex];

        var rotation = 50;
        var deg = rotation / txt.length,
            origin = 0;

        txt.forEach((ea) => {
            ea = `<p style='height:${radius}px;position:absolute;transform:rotate(${(-(rotation / 2)) + origin}deg);transform-origin:0 100%;text-align:center;width:10px;'>${ea}</p>`;
            classIndex.innerHTML += ea;
            origin += deg;
        });
    }

    function refreshText() {
        if (inputEl.value) {
            removeTextHolders();
            if (dropdown.value == 'Vaandel') {
                addTextHolderToSnijplank(createTextHolder(""));
                circularText(inputEl.value, 250, 0);
            } else {
                addTextHolderToSnijplank(createTextHolder(inputEl.value));
            }

        }
    }

    // add event listener to dropdown list
    inputEl.addEventListener('input', refreshText);    // add event listener to dropdown list
    fontSelect.addEventListener('change', refreshText);
}
