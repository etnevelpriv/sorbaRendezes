"use strict"; // Jobb hibakezelés miatt

let helper;
let elementHelper;
let xi;
let xj;
let diffX;
let iPos;
let jPos;

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    console.log("repInit elindult");

    // Alap változók
    const repArray = [ 24, 55, 9];
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
        x: Number(element.dataset.x),
        y: Number(element.dataset.y)
    };
};

// Elem pozíciójának változtatása és eltolás
const setPosition = function (element, x, y) {
    x = Number(x);
    y = Number(y);
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

    // Offset helyett ezt a beépíett függvényt használjuk innentől. https://jwood206.medium.com/positioning-with-mouse-events-offset-getboundingclientrect-and-getcomputedstyle-afe12bfcb5f
    xi = i.getBoundingClientRect().left;
    xj = j.getBoundingClientRect().left;

    diffX = xi - xj;

    setPosition(i, iPos.x - diffX, iPos.y);
    setPosition(j, jPos.x + diffX, jPos.y);

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
        elementsArray[i].classList.add("inspected");
        await sleep(700);
        for (let j = i + 1; j < repArray.length; j++) {

            elementsArray[j].classList.add("inspected");
            await sleep(700);

            if (repArray[i] > repArray[j]) {

                console.log(`cserelendo elemek: ${elementsArray[i]} és ${elementsArray[j]}`)

                await moveUpElements(elementsArray[i], elementsArray[j]);
                await switchElements(elementsArray[i], elementsArray[j]);
                await moveDownElements(elementsArray[i], elementsArray[j]);


                helper = repArray[i];
                repArray[i] = repArray[j];
                repArray[j] = helper;

                elementHelper = elementsArray[i];
                elementsArray[i] = elementsArray[j];
                elementsArray[j] = elementHelper;
            };
            elementsArray[j].classList.remove("inspected");
        };
        elementsArray[i].classList.remove("inspected");
        elementsArray[i].classList.add("correct-position");
    };
    elementsArray[elementsArray.length-1].classList.add("correct-position"); // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array


    // Tényleges csere az eredeti (klónozott) tömb elemeihez
    // for (let i = 0; i < repArray.length - 1; i++) { // A ciklus annyiszor fut le, ahány vizsgált elem van -1. Azért nem futtatjuk az utolsót most, mert a mátrix következő ciklusában már vizsgáljuk az utolsó elemet.
    //     for (let j = i + 1; j < repArray.length; j++) { // Második ciklus. Mindig az első ciklushoz képest a következő elem a vizsgált elemek első eleme. (nagyon sok az elem, majd átfogalmazom)
    //         if (repArray[i] > repArray[j]) { // Ellenőrizzük, hogy az "i"-edik (a sorozatban korábban szereplő) elem nagyobb-e, mint a "j"-edik (a sorozatban később szereplő) elem.
    //             // Ha az állítás igaz, megcseréljük a 2 elem pozícióját
    //             helper = repArray[i];
    //             repArray[i] = repArray[j];
    //             repArray[j] = helper;
    //         };
    //     };
    // };
    // console.log(repArray);
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
