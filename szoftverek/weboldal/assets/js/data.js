"use strict";

// Generál tömböket és azokat egyből meg is adja paraméternek az összes módszer esetében 5 alkalommal
const init = function () {
    const sortMethods = [ecsSort, buSort, gySort];
    const dataArray = [];
    let randomSzam;
    // console.log("fuggveny betoltott")
    for (let i = 1; i < 10000; i = i * 10) {
        // console.log("For i ciklus lefutott: " + i)
        dataArray.length = 0;
        for (let j = 0; j < i * 10; j++) {
            // console.log("For j ciklus lefutott: " + j)
            randomSzam = Math.floor(Math.random() * 1000000) + 1;
            dataArray.push(randomSzam)
        };
        for (let i = 0; i < sortMethods.length; i++) {
            for (let f = 0; f < 5; f++) {
                sortMethods[i](dataArray);
            };
        };
    };
};

const ecsSort = function (dataArray) { // Egyszerű Cserés Rendezés méréssel
    const arr = dataArray.slice();
    let helper;

    // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
    const start = performance.now();

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                helper = arr[i];
                arr[i] = arr[j];
                arr[j] = helper;
            };
        };
    };

    const end = performance.now();
    const elapsedMs = Number((end - start).toFixed(10));
    console.log(`Egyszerű cserés rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);

};

const buSort = function (dataArray) { // Buborék rendezés
    const arr = dataArray.slice();
    let helper;
    const start = performance.now();

    for (let i = arr.length - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                helper = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = helper;
            };
        };
    };

    const end = performance.now();
    const elapsedMs = Number((end - start).toFixed(10));
    console.log(`Buborékos rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);
};

const gySort = async function quickSortInside(dataArray) { // Gyors rendezés

    const gySortInside = function gySortInsideRekurzio(dataArray, low, high) { // Gyors rendezés
        let i = low;
        let j = high;
        let helper;
        const pivotIndex = Math.floor((low + high) / 2);
        const pivot = dataArray[pivotIndex];

        while (i <= j) {
            while (dataArray[i] < pivot) {
                i++;
            };
            while (dataArray[j] > pivot) {
                j--;
            };
            if (i <= j) {

                helper = dataArray[i];
                dataArray[i] = dataArray[j];
                dataArray[j] = helper;

                i++;
                j--;
            };
        };

        if (low < j) gySortInsideRekurzio(dataArray, low, j);
        if (i < high) gySortInsideRekurzio(dataArray, i, high);
    };

    const start = performance.now();
    gySortInside(dataArray, 0, dataArray.length - 1);

    const end = performance.now();
    const elapsedMs = Number((end - start).toFixed(10));
    console.log(`Gyors rendezés ideje ${dataArray.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${dataArray[0]} és az utolsó elem: ${dataArray[dataArray.length - 1]}`);
};

init();