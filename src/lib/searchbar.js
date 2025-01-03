import { SONGS } from '../constants/allSongs';

export function autocomplete(inp, arr, onSelect, isDarkMode) {
    let currentFocus;

    inp.addEventListener("input", function () {
        let a, b, val = this.value.replace(/[`’‘]/g, "").replace(/,/g, "");
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", `autocomplete-items ${isDarkMode ? "dark-mode" : ""}`);

        a.style.position = "absolute";
        a.style.bottom = "100%";
        a.style.width = "100%";

        this.parentNode.appendChild(a);

        let matchCount = 0;
        for (let i = 0; i < arr.length && matchCount < 4; i++) { // Show only 4 items
            let originalItem = arr[i];
            let normalizedItem = originalItem.replace(/[`’‘]/g, "").replace(/,/g, "").toLowerCase();
            let normalizedVal = val.toLowerCase();

            if (normalizedItem.includes(normalizedVal)) {
                b = document.createElement("DIV");

                let startIndex = normalizedItem.indexOf(normalizedVal);
                let endIndex = startIndex + normalizedVal.length;
                b.innerHTML = `${originalItem.slice(0, startIndex)}<strong>${originalItem.slice(startIndex, endIndex)}</strong>${originalItem.slice(endIndex)}`;
                b.innerHTML += `<input type='hidden' value="${originalItem.replace(/"/g, '&quot;')}">`;

                b.className = isDarkMode ? "autocomplete-item dark" : "autocomplete-item";

                b.style.fontSize = "1.3em"; // Increase font size slightly
                b.style.padding = "12px 16px"; // Optional: adjust padding for better spacing

                b.addEventListener("click", function () {
                    const selectedSong = this.getElementsByTagName("input")[0].value;

                    inp.value = selectedSong;
                    closeAllLists();
                    onSelect(selectedSong);
                });

                a.appendChild(b);
                matchCount++;
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");

        if (e.keyCode === 40) { // Arrow DOWN
            currentFocus++;
            addActive(x);
        } else if (e.keyCode === 38) { // Arrow UP
            currentFocus--;
            addActive(x);
        } else if (e.keyCode === 13) { // Enter
            e.preventDefault();
            if (currentFocus > -1 && x) {
                x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

export var songTitles = SONGS.map(song => {
    let bookSuffix = song.book === "CHILDREN'S" ? " (Children's)" : "";
    return `${song.number}. ${song.title}${bookSuffix}`;
});
