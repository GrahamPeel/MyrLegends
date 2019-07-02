

function SaveGameObj(gameObj) {
    localStorage.setItem('SingleSavedGame', JSON.stringify(gameObj));
}

function GetGameObj() {
    var storedJson = localStorage.getItem('SingleSavedGame');
    return (!!storedJson) ? JSON.parse(storedJson) : null;
}

// Game Obj = { heroCount: [int], savedItems: [string of decoded form input vals] }