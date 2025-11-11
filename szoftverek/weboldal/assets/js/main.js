"use strict"; // Jobb hibakezelés miatt

let dataArray;
let dataObj;

let helper;
let xi;
let xj;

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    console.log("repInit elindult");

    // Alap változók
    const repArray = [3, 34, 10, 99, 24, 55, 9];
    const sortMethods = [ecsSort, buSort, gySort, kSort, beSort];
    const container = document.getElementById("rep");

    console.log("repInit for ciklus most indul");
    // Ciklus az összes rendezési módszerhez
    for (let i = 0; i < sortMethods.length; i++) {

        // Tárolók létrehozása
        const repContainer = document.createElement("div");
        repContainer.classList.add("rep-container");
        container.appendChild(repContainer);
        const elements = document.createElement("div");
        elements.classList.add("rep-elements");
        repContainer.appendChild(elements);

        // Tömb minden adatához saját elem
        repArray.forEach(data => {
            const element = document.createElement("div");
            element.classList.add("rep-element");
            element.textContent = data;
            elements.appendChild(element);
        });

        // Az összes function új tömböt kap, hogy ne piszkálhassuk az eredetit véletlenül sem
        let repArrayClone = repArray;

        // Függvény futattásához gomb
        const startButton = document.createElement("button");
        startButton.classList.add("rep-button");
        startButton.textContent = "Gomb";
        startButton.addEventListener("click", () => sortMethods[i](elements, repArrayClone)); // Ehhez segítséget használtam, mert nem voltam tisztában az addEventListener pontos működésével: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
        repContainer.appendChild(startButton);

        console.log(`repInit for ciklus lefutott ${i} alkalommal`);

    };

    console.log("repInit vége");
};

const ecsSort = function (elements, repArray) { // Egyszerű Cserés Rendezés

    // Vizuális csere, mivel DOM elemeket nem lehet módosítani csak így (meglehetne oldani, de most nem ez a cél)
    elements = elements.children; // Nem tudtam, hogy lehet ilyet, dokumentációt használtam: https://www.w3schools.com/jsref/prop_element_childelementcount.asp 
    for (let i = 0; i < elements.length - 1; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (elements[i].innerHTML > elements[j].innerHTML) {

                xi = elements[i].offsetLeft;
                xj = elements[j].offsetLeft;

                setTimeout(() => {
                    elements[i].style.transform = "translateY(-50px)";
                    elements[j].style.transform = "translateY(-50px)";

                    setTimeout(() => {
                        elements[i].style.transform = `${xj - xi}px`;
                        elements[j].style.transform = `${xi - xj}px`;

                        setTimeout(() => {
                            elements[i].style.transform = "translateY(50px)";
                            elements[j].style.transform = "translateY(50px)";
                        }, 300);
                    }, 300);
                }, 300);

                helper = elements[i].innerHTML;
                elements[i] = elements[j];
                elements[j].innerHTML = helper;

            };
        };
    };

    // Tényleges csere az eredeti (klónozott) tömb elemeihez
    for (let i = 0; i < repArray.length - 1; i++) { // A ciklus annyiszor fut le, ahány vizsgált elem van -1. Azért nem futtatjuk az utolsót most, mert a mátrix következő ciklusában már vizsgáljuk az utolsó elemet.
        for (let j = i + 1; j < repArray.length; j++) { // Második ciklus. Mindig az első ciklushoz képest a következő elem a vizsgált elemek első eleme. (nagyon sok az elem, majd átfogalmazom)
            if (repArray[i] > repArray[j]) { // Ellenőrizzük, hogy az "i"-edik (a sorozatban korábban szereplő) elem nagyobb-e, mint a "j"-edik (a sorozatban később szereplő) elem.
                // Ha az állítás igaz, megcseréljük a 2 elem pozícióját
                helper = repArray[i];
                repArray[i] = repArray[j];
                repArray[j] = helper;
            };
        };
    };
    console.log(repArray);
};

const buSort = function (elements) { // Buborék rendezés
    console.log("Masodik");
};

const gySort = function (elements) { // Gyors rendezés
    console.log("Harmadik");
};

const kSort = function (elements) { // Kiválasztásos rendezés
    console.log("Negyedik");
};

const beSort = function (elements) { // Beszúrásos rendezés
    console.log("Otodik");
};

repInit();
