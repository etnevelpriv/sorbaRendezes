const init = function() {
    const sortMethods = [ ecsSort, buSort, gySort ];
    for ( let i = 0; i < sortMethods.length;i++ ) {
        sortMethods[i]();
    }
};

const generateArray = function() {

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