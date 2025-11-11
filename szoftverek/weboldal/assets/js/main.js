"use strict"; // Jobb hibakezelés miatt

let dataArray;
let dataObj;

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    const repArray = [3, 34, 10, 99, 24, 55, 9];
    let repContainer = document.getElementById("rep");

    ecsrRep(repArray, repContainer);
};

const ecsrRep = function (repArray, container) { // Egyszerű Cserés Rendezés függvénye
    const elements = document.createElement("div");
    elements.classList.add("rep-elements");
    container.appendChild(elements);

    repArray.forEach(data => {
        const element = document.createElement("div");
        element.classList.add("rep-element");
        element.textContent = data;
        elements.appendChild(element);
    });

};

repInit();
