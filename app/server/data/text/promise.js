function coolFunctionThatDoesEpicThings(epicdata) {
    return epicdata * 7;
}

function promiseToDoSomethingNice (epicdata) {
    return new Promise((resolve, reject) => {
        //do epic things
        let cooldata = coolFunctionThatDoesEpicThings(epicdata);

        for (var i = 0; i < 9; i++) {
            cooldata + "nice";
        }

        resolve(cooldata);
    });
}