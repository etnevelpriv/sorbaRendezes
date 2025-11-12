const init = function() {
    const sortMethods = [ ecsSort, buSort, gySort ];
    // for ( let i = 0; i < sortMethods.length;i++ ) {
    //     sortMethods[i]();
    // };
    generateArray();
};

const generateArray = function() {
    const dataArray = [];
    for ( let i = 0; i < 2; i++ ) {
        randomSzam = Math.floor(Math.random() * 100000) + 1;
        console.log(randomSzam);
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