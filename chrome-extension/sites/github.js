function pathChanged() {
    // File view page
    if (window.location.pathname.endsWith(".paa")) {
        let interval = setInterval(function() {
            try {
                let wrapper = document.getElementsByClassName("blob-wrapper")[0].firstChild.nextSibling.firstChild.nextSibling;
                wrapper.textContent = "Converting PAA...";
                clearInterval(interval);
                let image = document.createElement("img");
                chrome.runtime.sendMessage({contentScriptQuery: "fetch_blob", src: "https://github.com" + window.location.pathname + "?raw=true"}, response => {
                    image.src = response;
                    wrapper.replaceWith(image);
                });
            } catch {}
        }, 10);
    }

    // Diff page
    let diffs = document.querySelectorAll("div[data-file-type='.paa'][class~='file']");
    for (diff of diffs) {
        let interval = setInterval(function(diff) {
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

                let rawlink = diff.querySelectorAll("a")[1].href; // "View file" button link
                chrome.runtime.sendMessage({contentScriptQuery: "fetch_blob", src: rawlink + "?raw=true"}, response => {
                    image.src = response;
                    wrapper.replaceWith(divimage);
                });
            } catch {}
        }, 10, diff);
    }
}

pathChanged();
let path = window.location.pathname;
setInterval(function() {
    if (path != window.location.pathname) {
        pathChanged();
        path = window.location.pathname;
    }
}, 10);
