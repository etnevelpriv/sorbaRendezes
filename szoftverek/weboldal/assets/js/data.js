// Generál tömböket és azokat egyből meg is adja paraméternek az összes módszer esetében 5 alkalommal
const init = function () {
    const sortMethods = [ecsSort];
    const dataArray = [];
    // console.log("fuggveny betoltott")
    for (let i = 1; i < 100000; i = i * 10) {
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
            }
        }
    }

    const end = performance.now();
    const elapsedMs = end - start;
    console.log(`Egyszerű cserés rendezés ideje ${arr.length} számú elemmel: ${elapsedMs}. Ellenőrzés: első elem: ${arr[0]} és az utolsó elem: ${arr[arr.length-1]}`);

};

const buSort = function (dataArray) { // Buborék rendezés
    console.log("Masodik");
};

const gySort = function (dataArray) { // Gyors rendezés
    console.log("Harmadik");
};

init();