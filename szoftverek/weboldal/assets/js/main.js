"use strict"; // Jobb hibakezelés miatt

let helper;
let elementHelper;
let positions;
let xi;
let xj;
let diffX;
let iPos;
let jPos;

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    console.log("repInit elindult");

    // Alap változók
    const repArray = [3, 34, 10, 99, 24, 55, 9];
    const sortMethods = [ecsSort, buSort, gySort, kSort, beSort];
    const container = document.getElementById("rep");
    let elementsArray = [];

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
            element.dataset.x = 0; // AI mondta, hogy a datasetet alkalmazzam
            element.dataset.y = 0;
            elements.appendChild(element);
        });

        // Az összes function új tömböt kap, hogy ne piszkálhassuk az eredetit véletlenül sem
        const repArrayClone = [...repArray];


        // Függvény futattásához gomb
        const startButton = document.createElement("button");
        startButton.classList.add("rep-button");
        startButton.textContent = "Gomb";
        startButton.addEventListener("click", async () => sortMethods[i](repArrayClone, arrayUpload(elements.children, elementsArray))); // Ehhez segítséget használtam, mert nem voltam tisztában az addEventListener pontos működésével: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
        repContainer.appendChild(startButton);

        console.log(`repInit for ciklus lefutott ${i} alkalommal`);

    };

    console.log("repInit vége");
};

// Nem egyszerre történnek a változások. Ezt a függvényt hívjuk meg, hogyha időt szeretnék a 2 animáció közé
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Saját tömböt kap mindegyik módszer (az elemekről), különben csak a legutolsó létezne
const arrayUpload = (elements, elementsArray) => {
    elementsArray.length = 0; // Kiürítjük a listát
    for (let j = 0; j < elements.length; j++) {
        elementsArray.push(elements[j]); // Feltöltjük az elemeket
    };
    return elementsArray;
};

// Ez a kettő függvény arra van, hogy mindig újrageneráljuk az aktuális pozíciót és ahhoz képest tudjunk eltolást végezni megfelelően.
// Elem pozíciójának lekérése
const getPosition = function (element) {
    return {
        x: element.dataset.x,
        y: element.dataset.y
    };
};

// Elem pozíciójának változtatása és eltolás
const setPosition = function (element, x, y) {
    element.dataset.x = x;
    element.dataset.y = y;
    element.style.transform = `translate(${x}px, ${y}px)`
};

// Elem felfelé tolása
const moveUpElements = async function (i, j) {
    console.log(i);
    console.log(j);

    iPos = getPosition(i);
    jPos = getPosition(j);

    console.log(`i pozíciója most: ${iPos.x} ${iPos.y}`);
    console.log(`j pozíciója most: ${jPos.x} ${jPos.y}`);

    setPosition(i, iPos.x, iPos.y - 50);
    setPosition(j, jPos.x, jPos.y - 50);

    console.log("Az elemek feltolódtak")
    await sleep(1500);
};

// Elemek cseréje
const switchElements = async function (i, j) {
    console.log(i);
    console.log(j);

    iPos = getPosition(i);
    jPos = getPosition(j);

    console.log(`i pozíciója most: ${iPos.x} ${iPos.y}`);
    console.log(`j pozíciója most: ${jPos.x} ${jPos.y}`);

    xi = i.offsetLeft;
    xj = j.offsetLeft;

    diffX = xi - xj;

    setPosition(i, iPos.x + diffX, iPos.y);
    setPosition(j, jPos.x - diffX, jPos.y);

    await sleep(1500);
    console.log("Az elemek helyet cseréltek")
};

// Elemek lefelé tolása
const moveDownElements = async function (i, j) {
    console.log(i);
    console.log(j);

    iPos = getPosition(i);
    jPos = getPosition(j);

    console.log(`i pozíciója most: ${iPos.x} ${iPos.y}`);
    console.log(`j pozíciója most: ${jPos.x} ${jPos.y}`);

    setPosition(i, iPos.x, iPos.y + 50);
    setPosition(j, jPos.x, jPos.y + 50);

    console.log("Az elemek visszatolódtak")

    await sleep(1500);
};

const ecsSort = async function (repArray, elementsArray) { // Egyszerű Cserés Rendezés
    console.log(elementsArray);

    for (let i = 0; i < repArray.length - 1; i++) {
        for (let j = i + 1; j < repArray.length; j++) {

            if (repArray[i] > repArray[j]) {

                console.log(`cserelendo elemek: ${elementsArray[i]} és ${elementsArray[j]}`)

                positions = {
                    iPos: {
                        x: elementsArray[i].offsetLeft,
                        y: elementsArray[i].offsetTop
                    },

                    jPos: {
                        x: elementsArray[j].offsetLeft,
                        y: elementsArray[j].offsetTop
                    }
                };

                await moveUpElements(elementsArray[i], elementsArray[j], positions);
                await switchElements(elementsArray[i], elementsArray[j], positions);
                await moveDownElements(elementsArray[i], elementsArray[j], positions);


                helper = repArray[i];
                repArray[i] = repArray[j];
                repArray[j] = helper;

                elementHelper = elementsArray[i];
                elementsArray[i] = elementsArray[j];
                elementsArray[j] = elementHelper;
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
