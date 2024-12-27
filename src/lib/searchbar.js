import { SONGS } from '../constants/songs';

export function autocomplete(inp, arr, onSelect) {
    let currentFocus;

    inp.addEventListener("input", function (e) {
        let a, b, val = this.value.replace(/[`’‘]/g, "'");
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        a.style.position = "absolute";
        a.style.bottom = "100%";
        a.style.width = "100%";

        this.parentNode.appendChild(a);

        let matchCount = 0;
        for (let i = 0; i < arr.length && matchCount < 6; i++) {
            let normalizedItem = arr[i].replace(/[`’‘]/g, "'"); 
            if (normalizedItem.toUpperCase().includes(val.toUpperCase())) { 
                b = document.createElement("DIV");

                const regex = new RegExp(`(${val})`, "i");
                b.innerHTML = normalizedItem.replace(regex, "<strong>$1</strong>"); 
                b.innerHTML += `<input type='hidden' value="${arr[i].replace(/"/g, '&quot;')}">`;

                b.addEventListener("click", function (e) {
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