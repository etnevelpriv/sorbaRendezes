"use strict";

// Generál tömböket és azokat egyből meg is adja paraméternek az összes módszer esetében 5 alkalommal
const init = function () {
    const sortMethods = [ecsSort, buSort, gySort, beSort];
    const dataArray = [];
    const allDataArray = [];
    let randomNumber;
    // console.log("fuggveny betoltott")
    for (let i = 1; i < 10000; i = i * 10) {
        // console.log("For i ciklus lefutott: " + i)
        dataArray.length = 0;
        for (let j = 0; j < i * 10; j++) {
            // console.log("For j ciklus lefutott: " + j)
            randomNumber = Math.floor(Math.random() * 1000000) + 1;
            dataArray.push(randomNumber)
        };
        for (let i = 0; i < sortMethods.length; i++) {
            for (let f = 0; f < 5; f++) {
                sortMethods[i](dataArray, allDataArray);
            };
        };
    };
    console.log(allDataArray)
};

const dataPushToArray = function (arrayLength, elapsedTime, methodName, allDataArray) {
    allDataArray.push(
        {
            adatokSzama: arrayLength,
            ido: elapsedTime,
            modszer: methodName
        }
    );
};

const ecsSort = function (dataArray, allDataArray) { // Egyszerű Cserés Rendezés méréssel
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

    dataPushToArray(arr.length, elapsedMs, "Egyszerű cserés rendezés", allDataArray)

    console.log(`Egyszerű cserés rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);

};

const buSort = function (dataArray, allDataArray) { // Buborék rendezés
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

    dataPushToArray(arr.length, elapsedMs, "Buborékos rendezés", allDataArray)

    console.log(`Buborékos rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);
};

const gySort = async function quickSortInside(dataArray, allDataArray) { // Gyors rendezés
    const arr = dataArray.slice();

    const gySortInside = function gySortInsideRekurzio(arr, low, high) { // Gyors rendezés
        let i = low;
        let j = high;
        let helper;
        const pivotIndex = Math.floor((low + high) / 2);
        const pivot = arr[pivotIndex];

        while (i <= j) {
            while (arr[i] < pivot) {
                i++;
            };
            while (arr[j] > pivot) {
                j--;
            };
            if (i <= j) {

                helper = arr[i];
                arr[i] = arr[j];
                arr[j] = helper;

                i++;
                j--;
            };
        };

        if (low < j) gySortInsideRekurzio(arr, low, j);
        if (i < high) gySortInsideRekurzio(arr, i, high);
    };

    const start = performance.now();
    gySortInside(arr, 0, arr.length - 1);

    const end = performance.now();
    const elapsedMs = Number((end - start).toFixed(10));

    dataPushToArray(arr.length, elapsedMs, "Gyors rendezés", allDataArray)

    console.log(`Gyors rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);
};

const beSort = async function (dataArray, allDataArray) {
    const arr = dataArray.slice();
    let helper;
    const start = performance.now();

    for (let i = 1; i < arr.length; i++) {
        helper = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > helper) {
            arr[j + 1] = arr[j];
            j--;
        };
        arr[j + 1] = helper;
    };

    const end = performance.now();
    const elapsedMs = Number((end - start).toFixed(10));

    dataPushToArray(arr.length, elapsedMs, "Beszúrásos rendezés", allDataArray)

    console.log(`Beszúrásos ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length - 1]}`);

}

init();