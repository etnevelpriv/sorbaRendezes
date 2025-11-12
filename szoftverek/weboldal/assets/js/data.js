const init = function () {
    const sortMethods = [ecsSort, buSort, gySort];
    const dataArray = [];
    console.log("fuggveny betoltott")
    for (let i = 1; i < 1000000; i = i * 10) {
        console.log("For i ciklus lefutott: " + i)
        dataArray.length = 0;
        for (let j = 0; j < i * 10; j++) {
            console.log("For j ciklus lefutott: " + j)
            randomSzam = Math.floor(Math.random() * 1000000) + 1;
            dataArray.push(randomSzam)
        };
        for (let i = 0; i < sortMethods.length; i++) {
            for (let f = 0; f < 5; f++) {
                sortMethods[i]();
            };
        };
    };
};

const ecsSort = function () { // Egyszerű Cserés Rendezés
    console.log("Elso");
};

const buSort = function () { // Buborék rendezés
    console.log("Masodik");
};

const gySort = function () { // Gyors rendezés
    console.log("Harmadik");
};

init();