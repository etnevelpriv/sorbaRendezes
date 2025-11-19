"use strict"; // Jobb hibakezelés miatt

let helper;
let elementHelper;
let xi;
let xj;
let diffX;
let iPos;
let jPos;

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

const repInit = function () { // Az összes ábrázoláshoz kapcsolatos függvényt ebben hívom meg
    console.log("repInit elindult");

    // Alap változók
    const repArray = [3, 13, 67, 24, 55, 9];
    // const sortMethods = [ecsSort, buSort, gySort, beSort, mSort];
    const sortMethods = [
        [
            ecsSort,
            `
            for (let i = 0; i < repArray.length - 1; i++) {
            // A ciklus annyiszor fut le, ahány vizsgált elem van -1. Az utolső elemet a második ciklusban futtatjuk.
                for (let j = i + 1; j < repArray.length; j++) {
                // Második ciklus. Mindig az első ciklushoz képest a következő elem a vizsgált elemek első eleme.
                    if (repArray[i] > repArray[j]) {
                    // Ellenőrizzük, hogy az "i"-edik elem nagyobb-e, mint a "j"-edik elem.
                        // Ha az állítás igaz, megcseréljük a 2 elem pozícióját
                        helper = repArray[i];
                        repArray[i] = repArray[j];
                        repArray[j] = helper;
                    };
                };
            };
            `,
            "Egyszerű cserés rendezés",
            "A rendezendő tömb elemein egyesével végighaladunk.\nRendre megvizsgáljuk, hogy az adott helyen lévő elem milyen relációban van az utána következő elemekkel.\nMinden összehasonlítás után megnézzük, hogy az adott helyen lévő elem nagyobb-e a hasonlított elemnél.\nHa nagyobb, akkor megcseréljük a két elemet.\nHa az adott elemre vonatkozóan az összes összehasonlítással végeztünk, akkor jön a következő elem.\nMindaddig folytatjuk a fenti műveletet, amíg az utolsó előtti elemmel is el nem végeztük.",
            "Négyzetes idejű algoritmus"
        ],
        [
            buSort,
            `
            for (let i = repArray.length - 1; i > 0; i--) {
            // Az utolsó elemtől indul az első ciklus és az első elemig megy
                for (let j = 0; j < i; j++) {
                // Az első elemtől indul a második ciklus és addig fut, ameddig el nem éri az "i"-edik elemet
                    if (repArray[j] > repArray[j + 1]) {
                    // Ha a "j"-edik elem nagyobb, mint a sorban utánna lévő elem, akkor megcseréljül őket.
                        helper = repArray[j + 1];
                        repArray[j + 1] = repArray[j];
                        repArray[j] = helper;
                    };
                };
            };
            `,
            "Buborékos rendezés",
            "Sorban végigmegyünk a tömb elemein, és az egymás melletti elemeket összehasonlítjuk.\nMindig cserélünk, amennyiben az első elem a nagyobb. Ezáltal a legnagyobb elem a tömb végére kerül, rendezett lesz.\nA még nem rendezett elemekkel ugyanígy járunk el (balról jobbra haladva), mindaddig, amíg a tömbünk teljesen rendezett nem lesz.",
            "Négyzetes idejű algoritmus"
        ],
        [
            gySort,
            `
            const gySort = function quickSortInside(repArray, low = 0, high = repArray.length - 1) {
            // Gyorsrendezés. Felosztás (partition) + rekurzió.

                let i = low;
                let j = high;

                const pivotIndex = Math.floor((low + high) / 2);
                // A vezérelem (pivot) a középső index.

                const pivot = repArray[pivotIndex];
                // A pivot értékét elmentjük.

                while (i <= j) {
                // Addig mozgatjuk a két mutatót, amíg át nem lépik egymást.

                    while (repArray[i] < pivot) {
                    // Balról keresünk olyan elemet, amely nem kisebb a pivottól.
                        i++;
                    };

                    while (repArray[j] > pivot) {
                    // Jobbról keresünk olyan elemet, amely nem nagyobb a pivottól.
                        j--;
                    };

                    if (i <= j) {
                    // Ha még nem keresztezték egymást, cserélünk.
                        helper = repArray[i];
                        repArray[i] = repArray[j];
                        repArray[j] = helper;
                        i++;
                        j--;
                    };
                };

                // Rendezés rekurzívan a két részre osztott tömbben.
                if (low < j) quickSortInside(repArray, low, j);
                if (i < high) quickSortInside(repArray, i, high);
            };
            `,
            "Gyors rendezés",
            "Válasszuk ki a tömb középső elemét vezérelemnek.\nBalról haladunk a pivotig, jobbról visszafelé, és megkeressük az első olyan elemeket, amelyek nincsenek jó oldalon.\nEzeket megcseréljük, majd folytatjuk, amíg a mutatók át nem lépik egymást.\nA felosztás után rekurzívan rendezzük a bal és a jobb részt, amíg egyelemű szakaszokra nem esik a tömb.",
            "Logaritmus idejű algoritmus"
        ]
        ,
        [
            beSort,
            `
            for (let i = 1; i < repArray.length; i++) {
            // A második elemtől indulunk, mivel az első elemet önmagában rendezettnek tekintjük.
                helper = repArray[i];
                // Elmentjük az aktuális elemet, melyet a megfelelő helyre szeretnénk "beszúrni".

                let j = i - 1;
                // A "j" az előző elemet jelöli, innen indulunk visszafelé.

                while (j >= 0 && repArray[j] > helper) {
                // Addig haladunk visszafelé, amíg a vizsgált előző elem nagyobb,
                // mint a beszúrandó elem, illetve amíg van még elem balra.
                    repArray[j + 1] = repArray[j];
                    // Toljuk jobbra az elemet, hogy helyet csináljunk a beszúrásnak.
                    j--;
                };

                repArray[j + 1] = helper;
                // Ha megtaláltuk a megfelelő pozíciót (vagy elértük a tömb elejét),
                // akkor beszúrjuk a helper értéket.
            };
            `,
            "Beszúrásos rendezés",
            "A tömb bal oldali részét folyamatosan rendezettnek tekintjük.\nAz aktuális elemet kimentjük, majd visszafelé haladva megkeressük a helyét a már rendezett részben.\nA nagyobb elemeket jobbra toljuk, így keletkezik hely a beszúrandó elem számára.\nA folyamatot ismételjük minden elemre, így a balról jobbra épített rész egyre hosszabb és rendezett marad.",
            "Négyzetes idejű algoritmus"
        ],
        [
            fkSort,
            `
            for (let i = repArray.length - 1; i > 0; i--) {
            // A ciklus az utolsó elemtől indul és a második elemig megy.
                for (let j = i - 1; j >= 0; j--) {
                // Második ciklus. Mindig az első ciklushoz képest a következő elem a vizsgált elemek első eleme.
                    if (repArray[i] < repArray[j]) {
                    // Ellenőrizzük, hogy az "i"-edik elem nagyobb-e, mint aj "j"-edik elem.
                        // Ha az állítás igaz, megcseréljük a 2 elem pozícióját
                        helper = repArray[i];
                        repArray[i] = repArray[j];
                        repArray[j] = helper;
                    };
                };
            };
            `,
            "Fordított kiválasztásos rendezés",
            "A rendezendő tömb elemein egyesével végighaladunk.\nRendre megvizsgáljuk, hogy az adott helyen lévő elem milyen relációban van az előtte lévő elemekkel.\nMinden összehasonlítás után megnézzük, hogy az adott helyen lévő elem nagyobb-e a hasonlított elemnél.\nHa nagyobb, akkor megcseréljük a két elemet.\nHa az adott elemre vonatkozóan az összes összehasonlítással végeztünk, akkor jön a következő elem.\nMindaddig folytatjuk a fenti műveletet, amíg az első indexű elemmel is el nem végeztük.",
            "Négyzetes idejű algoritmus"
        ]
    ];

    const container = document.getElementById("rep");
    let elementsArray = [];

    console.log("repInit for ciklus most indul");
    // Ciklus az összes rendezési módszerhez
    for (let i = 0; i < sortMethods.length; i++) {
        // Tároló létrehozása
        const repContainer = document.createElement("div");
        repContainer.classList.add("rep-container");
        container.appendChild(repContainer);

        // Cím
        const title = document.createElement("h3");
        title.classList.add("rep-title");
        title.textContent = sortMethods[i][2];
        repContainer.appendChild(title);
        const titleHr = document.createElement("hr");
        titleHr.classList.add("title-hr")
        repContainer.appendChild(titleHr);

        // Bemutatas szovegek/kod/animaciohelye
        // Container
        const explainContainer = document.createElement("div");
        explainContainer.classList.add("explain-container");
        repContainer.appendChild(explainContainer);

        // Magyarazatok/szovegek
        const howItWorksContainer = document.createElement("div");
        howItWorksContainer.classList.add("howitworks-container")
        explainContainer.appendChild(howItWorksContainer);

        const howItWorksTitle = document.createElement("h5");
        howItWorksTitle.textContent = "Működés módja";
        howItWorksContainer.appendChild(howItWorksTitle);

        const howItWorksText = document.createElement("p");
        howItWorksText.classList.add("howitworks-text")
        howItWorksText.textContent = sortMethods[i][3];
        howItWorksContainer.appendChild(howItWorksText);

        const timeTitle = document.createElement("h5");
        timeTitle.textContent = "Milyen idejű?";
        howItWorksContainer.appendChild(timeTitle);

        const timeText = document.createElement("p");
        timeText.textContent = sortMethods[i][4];
        howItWorksContainer.appendChild(timeText);

        //Kód
        const codeContainer = document.createElement("div");
        codeContainer.classList.add("code-container");
        explainContainer.appendChild(codeContainer);

        const exampleCodeText = document.createElement("h5");
        exampleCodeText.textContent = "Példa kód";
        codeContainer.appendChild(exampleCodeText);

        const codeText = document.createElement("p");
        codeText.classList.add("code-text");
        codeText.textContent = sortMethods[i][1];
        codeContainer.appendChild(codeText);

        // Animáció
        const animationText = document.createElement("h5");
        animationText.textContent = "Animációs bemutatás";
        animationText.classList.add("animation-text");
        repContainer.appendChild(animationText)

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

        // Függvény futattásához gomb
        const startButton = document.createElement("button");
        startButton.classList.add("rep-button");
        startButton.textContent = "Animáció indítása";
        startButton.addEventListener("click", async () => sortMethods[i][0](repArrayClone, arrayUpload(elements.children, elementsArray))); // Ehhez segítséget használtam, mert nem voltam tisztában az addEventListener pontos működésével: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
        repContainer.appendChild(startButton);

        // Az összes function új tömböt kap, hogy ne piszkálhassuk az eredetit véletlenül sem
        const repArrayClone = [...repArray];

        // Elválasztó vonal
        const repHr = document.createElement("hr");
        repHr.classList.add("rep-hr")
        repContainer.appendChild(repHr);

        console.log(`repInit for ciklus lefutott ${i} alkalommal`);

    };

    console.log("repInit vége");
};

const ecsSort = async function (repArray, elementsArray) { // Egyszerű Cserés (Kiválasztásos) Rendezés
    console.log(elementsArray);

    // A rendezendő tömb elemein egyesével végighaladunk. Rendre megvizsgáljuk, hogy az adott helyen lévő elem milyen relációban van az utána következő elemekkel. Minden összehasonlítás után megnézzük, hogy az adott helyen lévő elem nagyobb-e a hasonlított elemnél. Ha nagyobb, akkor megcseréljük a két elemet. Ha az adott elemre vonatkozóan az összes összehasonlítással végeztünk, akkor jön a következő elem. Mindaddig folytatjuk a fenti műveletet, amíg az utolsó előtti elemmel is el nem végeztük. Négyzetes idejű algoritmus.

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
    elementsArray[elementsArray.length - 1].classList.add("correct-position"); // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array

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
};

const buSort = async function (repArray, elementsArray) { // Buborék rendezés
    console.log(repArray)

    // Működési módja:
    // Sorban végigmegyünk a tömb elemein, és az egymás melletti elemeket összehasonlítjuk.Mindig cserélünk, amennyiben az első elem a nagyobb.Ezáltal a legnagyobb elem a tömb végére kerül, rendezett lesz.A még nem rendezett elemekkel ugyanígy járunk el(balról jobbra haladva), mindaddig, amíg a tömbünk teljesen rendezett nem lesz.
    // Négyzetes idejű algoritmus.

    for (let i = repArray.length - 1; i > 0; i--) {

        for (let j = 0; j < i; j++) {

            elementsArray[j].classList.add("inspected");
            await sleep(700);
            elementsArray[j + 1].classList.add("inspected");
            await sleep(700);

            if (repArray[j] > repArray[j + 1]) {

                console.log(`cserelendo elemek: ${elementsArray[j]} és ${elementsArray[j + 1]}`)

                await moveUpElements(elementsArray[j], elementsArray[j + 1]);
                await switchElements(elementsArray[j], elementsArray[j + 1]);
                await moveDownElements(elementsArray[j], elementsArray[j + 1]);

                helper = repArray[j + 1];
                repArray[j + 1] = repArray[j];
                repArray[j] = helper;

                elementHelper = elementsArray[j + 1];
                elementsArray[j + 1] = elementsArray[j];
                elementsArray[j] = elementHelper;

            };
            elementsArray[j].classList.remove("inspected");
            elementsArray[j + 1].classList.remove("inspected");

        };
        elementsArray[i].classList.remove("inspected");
        elementsArray[i].classList.add("correct-position");
    };

    // Tényleges csere az eredeti (klónozott) tömb elemeihez
    // for (let i = repArray.length - 1; i > 0; i--) { // Az utolsó elemtől indul az első ciklus és az első elemig megy
    //     for (let j = 0; j < i; j++) { // Az első elemtől indul a második ciklus és addig fut, ameddig el nem éri az "i"-edik elemet
    //         if (repArray[j] > repArray[j + 1]) { // Ha a "j"-edik elem nagyobb, mint a sorban utánna lévő elem, akkor megcseréljül őket.
    //             helper = repArray[j + 1];
    //             repArray[j + 1] = repArray[j];
    //             repArray[j] = helper;
    //         };
    //     };
    // };

};

const gySort = async function quickSortInside(repArray, elementsArray, low = 0, high = repArray.length - 1) { // Gyors rendezés
    console.log(repArray);
    let i = low;
    let j = high;
    const pivotIndex = Math.floor((low + high) / 2);
    const pivot = repArray[pivotIndex];

    while (i <= j) {
        while (repArray[i] < pivot) {
            i++;
        };
        while (repArray[j] > pivot) {
            j--;
        };
        if (i <= j) {

            console.log(`cserelendo elemek: ${elementsArray[j]} és ${elementsArray[i]}`)

            await moveUpElements(elementsArray[j], elementsArray[i]);
            await switchElements(elementsArray[j], elementsArray[i]);
            await moveDownElements(elementsArray[j], elementsArray[i]);

            helper = repArray[i];
            repArray[i] = repArray[j];
            repArray[j] = helper;

            elementHelper = elementsArray[i];
            elementsArray[i] = elementsArray[j];
            elementsArray[j] = elementHelper;
            i++;
            j--;
        };
    };

    if (low < j) quickSortInside(repArray, elementsArray, low, j);
    if (i < high) quickSortInside(repArray, elementsArray, i, high);
    console.log(repArray);
};
// Tényleges csere az eredeti (klónozott) tömb elemeihez
// const gySort = function quickSortInside(repArray, low = 0, high = repArray.length - 1) { // Gyors rendezés
//     console.log(repArray);
//     let i = low;
//     let j = high;
//     const pivotIndex = Math.floor((low + high) / 2);
//     const pivot = repArray[pivotIndex];
//     while (i <= j) {
//         while (repArray[i] < pivot) {
//             i++;
//         };
//         while (repArray[j] > pivot) {
//             j--;
//         };
//         if (i <= j) {
//             helper = repArray[i];
//             repArray[i] = repArray[j];
//             repArray[j] = helper;
//             i++;
//             j--;
//         };
//     };
//     if (low < j) quickSortInside(repArray, low, j);
//     if (i < high) quickSortInside(repArray, i, high);
//     console.log(repArray);
// };


const beSort = async function (repArray, elementsArray) { // Beszúrásos rendezés
    // https://www.geeksforgeeks.org/javascript/sorting-algorithms-in-javascript/
    // Ezt találtam, innen másoltam ki, majd módosítottam
    console.log("besort eleje:" + repArray);
    for (let i = 1; i < repArray.length; i++) {

        helper = repArray[i];
        elementHelper = elementsArray[i];
        let j = i - 1;

        while (j >= 0 && repArray[j] > helper) {

            console.log(`cserelendo elemek: ${elementsArray[j]} és ${elementsArray[i]}`);

            await moveUpElements(elementsArray[j], elementsArray[j + 1]);
            await switchElements(elementsArray[j], elementsArray[j + 1]);
            await moveDownElements(elementsArray[j], elementsArray[j + 1]);

            let extraHelper = repArray[j];
            repArray[j] = repArray[j + 1];
            repArray[j + 1] = extraHelper;

            let extraHelperElements = elementsArray[j];
            elementsArray[j] = elementsArray[j + 1];
            elementsArray[j + 1] = extraHelperElements;

            j--;
        };

        repArray[j + 1] = helper;
        elementsArray[j + 1] = elementHelper;
    };
    console.log("besort vege:" + repArray);

    // Tényleges csere az eredeti (klónozott) tömb elemeihez
    // for (let i = 1; i < repArray.length; i++) {
    //     helper = repArray[i];
    //     let j = i - 1;
    //     while (j >= 0 && repArray[j] > helper) {
    //         repArray[j + 1] = repArray[j];
    //         j--;
    //     };
    //     repArray[j + 1] = helper;
    // };

};

const fkSort = async function (repArray, elementsArray) { // Fordított kiválasztásos rendezés
    console.log(elementsArray);

    for (let i = repArray.length - 1; i > 0; i--) {
        elementsArray[i].classList.add("inspected");
        await sleep(700);
        for (let j = i - 1; j >= 0; j--) {

            elementsArray[j].classList.add("inspected");
            await sleep(700);

            if (repArray[i] < repArray[j]) {

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
    elementsArray[0].classList.add("correct-position"); // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array

    // Tényleges csere az eredeti (klónozott) tömb elemeihez
    // for (let i = repArray.length - 1; i > 0; i--) { // A ciklus az utolsó elemtől indul és a második elemig megy (mivel az első már biztosan jó helyen lesz).
    //     for (let j = i - 1; j >= 0; j--) { // Második ciklus. Mindig az első ciklushoz képest a következő elem a vizsgált elemek első eleme.
    //         if (repArray[i] < repArray[j]) { // Ellenőrizzük, hogy az "i"-edik (a sorozatban korábban szereplő) elem nagyobb-e, mint aj "j"-edik (a sorozatban később szereplő) elem.
    //             // Ha az állítás igaz, megcseréljük a 2 elem pozícióját
    //             helper = repArray[i];
    //             repArray[i] = repArray[j];
    //             repArray[j] = helper;
    //         };
    //     };
    // };
};


repInit();
