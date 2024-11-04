import { HYMNS } from '../constants/hymn';

/* eslint-disable eqeqeq */
export function autocomplete(inp, arr) {
    let currentFocus;
    
    inp.addEventListener("input", function(e) {
        let a, b, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        
        /* Create a DIV to contain the items (values), positioning it above the input field */
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        
        /* Adjust the styling to display above the input */
        a.style.position = "absolute";
        a.style.bottom = "100%";
        a.style.width = "100%";
        
        this.parentNode.appendChild(a);

        /* Show up to 6 matching items */
        let matchCount = 0;
        for (let i = 0; i < arr.length && matchCount < 6; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });

                a.appendChild(b);
                matchCount++;
            }
        }
    });

    inp.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");

        if (e.keyCode == 40) { // Arrow DOWN
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // Arrow UP
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // Enter
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
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

export var hymnTitles = HYMNS.map(hymn => hymn.title);
