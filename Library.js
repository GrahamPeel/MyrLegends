// Game Obj = { heroCount: [int], savedItems: [string of decoded form input vals] }

//function SaveGameObj(gameObj) {
//    localStorage.setItem(lsKeyName, JSON.stringify(gameObj));
//}

const lsKeyName = 'HerosMyrAccountObj';

function FetchAccountObj() {
    var storedJson = localStorage.getItem(lsKeyName);

    if (!!storedJson) {
        return JSON.parse(storedJson);
    }

    var accountObj = { savedGames: [] };
    localStorage.setItem(lsKeyName, JSON.stringify(accountObj));
    return accountObj;
}

function UpdateAccountObj(accountObj) {
    localStorage.setItem(lsKeyName, JSON.stringify(accountObj));
}

function SaveNewGame(accountObj, heroCount, name) {
    var newGame = getDefaultSavedGameObj(heroCount, name);
    console.log(accountObj);
    accountObj.savedGames.push(newGame);
    UpdateAccountObj(accountObj);
    return newGame;
}

function ConfirmDeleteGame(a, id, msg) {
    var c = confirm(msg || "You sure?");
    if (c)
        DeleteGame(a, id);
    return c;

    function DeleteGame(a, id) {
        var findResult = FindGameInAcctObjById(accountObj, id);
        if (findResult != null) {
            console.log(findResult.position);
            accountObj.savedGames.splice(findResult.position, 1);
            console.log(accountObj);
            UpdateAccountObj(accountObj);
            $(a).closest("li").hide();
        }
    }
}


// Returns a ref to game obj, plus the position int of the item in the array
function FindGameInAcctObjById(accountObj, id) {
    if (accountObj.savedGames != null) {
        for (var i = 0; i < accountObj.savedGames.length; i++) {
            if (accountObj.savedGames[i].id == id) {
                return { gameObj: accountObj.savedGames[i], position: i };
            }
        }
    }
    return null;
}

function getDefaultSavedGameObj(heroCount, name) {
    return {
        savedItems: "",
        heroCount: heroCount,
        name: name,
        id: createUUID()
    }
}

// SAMPLE OF GAME CLASS
var sampleAccountObj = {
    savedGames: [{
        savedItems: "", // for a saved game, the form inputs are here
        heroCount: 4,
        name: "Battle at Gabe's",
        id: "B42A153F1D9A4F92990392C11DD684D2"
    }
    ]
}

 function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}