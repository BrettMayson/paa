function pathChanged() {
    // File view page
    if (window.location.pathname.endsWith(".paa")) {
        let interval = setInterval(function () {
            try {
                let wrapper = document.getElementsByClassName("blob-wrapper")[0].firstChild.nextSibling.firstChild.nextSibling;
                wrapper.textContent = "Converting PAA...";
                clearInterval(interval);
                let image = document.createElement("img");
                fetch(window.location.href + "?raw=true")
                    .then(response => response.blob())
                    .then(blob => blob.arrayBuffer()).then(ab => {
                        chrome.runtime.sendMessage({contentScriptQuery: "fetch_blob", ab: Array.from(new Uint8Array(ab))}, response => {
                            image.src = response;
                            wrapper.replaceWith(image);
                        });
                });
            } catch { }
        }, 50);
    }

    // Diff page
    if (window.location.pathname.endsWith("/files")) {
        let tries = 150;
        let interval = setInterval(function () {
            if (tries-- < 0) {
                clearInterval(interval);
                return;
            }
            let diffs = document.querySelectorAll("div[data-file-type='.paa'][class~='file']");
            for (diff of diffs) {
                try {
                    let wrapper = diff.firstElementChild.nextElementSibling.firstElementChild;
                    wrapper.textContent = "Converting PAA...";
                    clearInterval(interval);

                    // Put into image sizing div like on file view page to center
                    let divimage = document.createElement("div");
                    divimage.setAttribute("itemprop", "text");
                    divimage.setAttribute("class", "Box-body p-0 blob-wrapper data type-text gist-border-0");
                    let divcenter = document.createElement("div");
                    divcenter.setAttribute("class", "text-center p-3");
                    divimage.appendChild(divcenter);
                    let image = document.createElement("img");
                    divcenter.appendChild(image);

                    fetch(diff.querySelectorAll("a")[1].href + "?raw=true")
                        .then(response => response.blob())
                        .then(blob => blob.arrayBuffer()).then(ab => {
                            chrome.runtime.sendMessage({contentScriptQuery: "fetch_blob", ab: Array.apply(null,new Uint8Array(ab))}, response => {
                                image.src = response;
                                wrapper.replaceWith(divimage);
                            });
                        });
                } catch { }
            }
        }, 100);
    }
}

pathChanged();
let path = window.location.pathname;
setInterval(function () {
    if (path != window.location.pathname) {
        pathChanged();
        path = window.location.pathname;
    }
}, 10);
