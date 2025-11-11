"use strict"; // Jobb hibakezelés miatt

let dataArray;
let dataObj;

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    console.log("repInit elindult");

    // Alap változók
    const repArray = [3, 34, 10, 99, 24, 55, 9];
    const sortMethods = [ecsSort, buSort, gySort, kSort, beSort];
    const container = document.getElementById("rep");

    console.log("repInit for ciklus elkezdődött");

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

        // Függvény futattásához gomb
        const startButton = document.createElement("button");
        startButton.classList.add("rep-button");
        startButton.textContent = "Gomb";
        startButton.addEventListener("click", () => sortMethods[i](elements)); // Ehez segítséget használtam, mert nem voltam tisztában az addEventListener pontos működésével: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
        repContainer.appendChild(startButton);
    };

    console.log("repInit for ciklus lefutott");
};

const ecsSort = function (elements) { // Egyszerű Cserés Rendezés
    console.log("Elso")
};

const buSort = function (elements) { // Buborék rendezés
    console.log("Masodik")
};

const gySort = function (elements) { // Gyors rendezés
    console.log("Harmadik")
};

const kSort = function (elements) { // Kiválasztásos rendezés
    console.log("Negyedik")
};

const beSort = function (elements) { // Beszúrásos rendezés
    console.log("Otodik")
};

repInit();
