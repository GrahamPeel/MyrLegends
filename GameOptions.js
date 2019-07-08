const numRows = 20;
const numCols = 30;

function GetHeroChoices() {
    return [
        { name: "Golem", id: 0, abbrev: "GL" },
        { name: "Warforged Giant", id: 0, abbrev: "WG" },
        { name: "Ogre chieftain", id: 0, abbrev: "OC" },
        { name: "Cadaver Collector", id: 0, abbrev: "CC" },
        { name: "Tortle Monk", id: 0, abbrev: "TM" },
        { name: "Vanguard", id: 0, abbrev: "VA"  },
        { name: "Crusader", id: 0, abbrev: "CR"  },
        { name: "Berserker", id: 0, abbrev: "BE"  },
        { name: "War Priest", id: 0, abbrev: "WP"  },
        { name: "Centurion", id: 0, abbrev: "CE"  },
        { name: "Sacred Bladesman", id: 0, abbrev: "SB"  },
        { name: "Eldritch knight", id: 0, abbrev: "EK" },
        { name: "Spartan", id: 0, abbrev: "SP"  },
        { name: "Ninja", id: 0, abbrev: "NJ"  },
        { name: "Hitman", id: 0, abbrev: "HM"  },
        { name: "Jester", id: 0, abbrev: "JE"  },
        { name: "Trophy Hunter", id: 0, abbrev: "TH"  },
        { name: "Necromancer", id: 0, abbrev: "NE"  },
        { name: "Lich", id: 0, abbrev: "LI"  },
        { name: "Invader", id: 0, abbrev: "IV"  },
        { name: "Sorceress", id: 0, abbrev: "SO"  },
        { name: "Elemental Druid", id: 0, abbrev: "ED"  },
        { name: "Bandit King", id: 0, abbrev: "BK"  },
        { name: "Gunslinger", id: 0, abbrev: "GS"  },
        { name: "Crossbowman", id: 0, abbrev: "CB"  },
        { name: "Forest Ranger", id: 0, abbrev: "FR"  },
        { name: "Cleric", id: 0, abbrev: "CL"  },
        { name: "Bard", id: 0, abbrev: "BR"  },
        { name: "Demon Hunter", id: 0, abbrev: "DH"  },
        { name: "Revolutionary", id: 0, abbrev: "RV"  },
        { name: "Mind Flayer", id: 0, abbrev: "MF"  },
        { name: "Sapper", id: 0, abbrev: "SA"  },
        { name: "Jailmaster", id: 0, abbrev: "JM" },
    ];
}


function SetupGameHeading(currentGame) {
    // Game name, other details
    $("#gameNameHeading h2 span").html("&ldquo;" + currentGame.name + "&rdquo;");

    var switchLink = $("#gameNameHeading .switchLink");
    switchLink.attr("href", switchLink.attr("href") + currentGame.id);
}

function HandleWorkspaceChange() {
    $("#workSpaceHolder .workSpace").hide();
    var vId = $("#wspaceSelect").val();
    $("#" + vId).show();
}


function ParseGameDataIntoDict(blobData) {
    blobData = blobData || "";
    var segments = blobData.split("&");
    var dict = {};
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i].split("=");
        var keyName = segment[0];
        var keyValue = segment[1];
        if (!keyName) {
            //console.log("Bad key name from segment: " + segments[i]);
            continue;
        }
        dict[keyName] = keyValue;
    }

    return dict;
}


function SetupCalculator() {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = { diceTypes: [4, 6, 8, 10, 12, 20, 100] };
    var stuff = template(context);
    $("#calcTable tbody").html(stuff);
} 


function HandleHPCalc() {

    var currentHPinput = $("#hpCalc_Current");
    var maxHPinput = $("#hpCalc_Max");
    var newMaxHPinput = $("#hpCalc_NewMax");
    var label = $("#hpCalc_Label");

    console.log(currentHPinput.val() + maxHPinput.val() + newMaxHPinput.val());

    var currentHP = parseFloat(currentHPinput.val());
    var maxHP = parseFloat(maxHPinput.val());
    var newMaxHP = parseFloat(newMaxHPinput.val());
    var result = (newMaxHP / maxHP) * currentHP;
    console.log(result);
    label.html(isNaN(result) ? "bad input" : result);
}


function Calc(btn) {
    var logMsg = "";
    var tr = $(btn).closest("tr");

    var number = parseInt(tr.find(".number").val());
    number = isNaN(number) ? 1 : number;

    var size = parseInt(tr.find(".size").val());

    var mod = parseInt(tr.find(".mod").val());
    mod = isNaN(mod) ? 0 : mod;

    logMsg += number + "d" + size;
    if (mod !== 0)
        logMsg += (mod >= 0 ? "+" : "") + mod;

    var baseMultiplier = parseFloat(tr.find(".baseMult").val());
    baseMultiplier = isNaN(baseMultiplier) ? 1 : baseMultiplier;

    var rollingCondMult = 1;
    var condMultsRaw = $.trim(tr.find(".conditionalMults").val());
    if (condMultsRaw) {
        var condMultsArray = $.trim(tr.find(".conditionalMults").val()).split(" ");
        for (var i = 0; i < condMultsArray.length; i++) {
            var conMult = parseFloat(condMultsArray[i]);
            if (isNaN(conMult))
                alert("Bad Conditional Multiplier: " + conMult);
            else
                rollingCondMult += conMult;
        }
    }

    logMsg += " x" + baseMultiplier + " (base) ";
    logMsg += " x" + rollingCondMult + "(conditional) ";

    var resultSpan = tr.find(".result");
    var logSpan = tr.find(".log");

    var rollingTotal = 0;
    logMsg += " Rolls("
    for (var i = 1; i <= number; i++) {
        var roll = Math.floor((Math.random() * size) + 1);
        logMsg += roll + " ";
        rollingTotal += roll;
        //var withMod = roll + mod;
    }
    logMsg += ")";
    rollingTotal += mod;

    rollingTotal = rollingTotal * baseMultiplier * rollingCondMult;

    resultSpan.html(rollingTotal);
    logSpan.html(logMsg);
}


function SetupGameBoard() {

    $(".bordHolder").each(function () {
        var bord = $(this);
        for (var i = 1; i <= numRows; i++) {
            var newRow = $("<div>", { "class": "bordRow" });
            bord.append(newRow);

            for (var j = 1; j <= numCols; j++) {
                var cellId = i + "-" + j;
                var newCell = $("<div>", { "class": "bordCell", "id": "cell_" + cellId, "onclick": "HandleCellClick(this)" });
                newRow.append(newCell);

                var cellTerrainVal = $("<input>", { "type": "hidden", "class": "cellTerrainVal", "name": "cellTerrain_" + cellId });
                newCell.append(cellTerrainVal);

                var cellIdSpan = $("<span>", { "class": "cellId" }).append(cellId);
                newCell.append(cellIdSpan);

                var iconTopperDiv = $("<div>", { "class": "iconTopper" });
                newCell.append(iconTopperDiv);

                var iconTopperVal = $("<input>", { "type": "hidden", "class": "iconTopperVal", "name": "iconTopperVal_" + cellId });
                newCell.append(iconTopperVal);
            }
        }
    });

    // Fire change event for setup, itspoorlynamed...
    ChangeCurrentOperation();

    // Bind the heroes in the controls from the game data
    var source = document.getElementById("heroIconMarkers-template").innerHTML;
    var template = Handlebars.compile(source);

    var savedItems = ParseGameDataIntoDict(currentGame.savedItems);
    var savedGameBoardItems = ParseGameDataIntoDict(currentGame.savedGameBoardItems);

    // repaint the terrain/icons from the saved data
    for (var key in savedGameBoardItems) {
        // check if the property/key is defined in the object itself, not in parent
        if (savedGameBoardItems.hasOwnProperty(key)) {
            var cell = $("input[name=" + key + "]").closest("div.bordCell");
            if (key.indexOf("cellTerrain") === 0) {
                var terrainCode = savedGameBoardItems[key];
                PaintTerrainCell(cell, terrainCode);
            }
            else if (key.indexOf("iconTopperVal") == 0) {
                var iconCode = savedGameBoardItems[key];
                PaintIconCell(cell, iconCode);
            }
        }
    }

    var redOptions = { items: [] };
    var blueOptions = { items: [] };

    // look for the (max) 10 character prop things.
    // AT THE POINT OF NEEDING A REAL DATA SERVICE I THINK, TO MATCH ID/NAME etc
    for (var i = i; i <= 10; i++) {
        //if (savedItems.hasOwnProperty('heroName_' + i)) {
        //redOptions.items.push({ name: "", val: "" });
        //}
    }

    redOptions.items.push({ name: "Golem", valStr: "h_GL_red", color: "red" });
    redOptions.items.push({ name: "Hitman", valStr: "h_HM_red", color: "red" });

    blueOptions.items.push({ name: "Warforged Giant", valStr: "h_WG_blue", color: "blue" });
    blueOptions.items.push({ name: "Bandit King", valStr: "h_BK_blue", color: "blue" });

    var redTemplateHtml = template(redOptions);
    $("#redHerosTarget").append(redTemplateHtml);

    var blueTemplateHtml = template(blueOptions);
    $("#blueHerosTarget").append(blueTemplateHtml);

    // Adjust clickable styles
    $(".controllSection input").on("click", function () {
        $(".bordHolder").addClass("cellsClickable");
        $(".selectedCntlLabel").removeClass("selectedCntlLabel");
        $(this).closest("label").addClass("selectedCntlLabel")
    });
}


function GetSelectedOperationType() {
    return $("#operationSelector").val();
}

function DisplayError(errorMsg) {
    console.log(errorMsg);
}


// Sets the bg color and pushes code into hiddenfield
function PaintTerrainCell(cell, terrainCode) {
    // Can expand terrainCode as needed, maybe split on _, for stuff like 'url_foo' instead of 'green'

    $(cell).css("backgroundColor", terrainCode);
    $(cell).find("input[type=hidden].cellTerrainVal").val(terrainCode)
}

// Sets the Icon text/color and pushes code into hiddenfield
function PaintIconCell(cell, iconCode) {
    if (!iconCode) return;
    var iconCode_Frags = iconCode.split("_");
    if (iconCode_Frags.length === 3) {
        var iconTopper = $(cell).find(".iconTopper");

        // should be just one in this .each,but ya never know.
        $("div[data-iconTopperVal=" + iconCode + "]").each(function () {
            $(this).removeAttr("data-iconTopperVal", iconCode);
            $(this).html("");
            $(this).css("backgroundColor", "transparent");
        })

        iconTopper.attr("data-iconTopperVal", iconCode);
        iconTopper.html(iconCode_Frags[1]);
        iconTopper.css("backgroundColor", iconCode_Frags[2]);

        $(cell).find("input[type=hidden].iconTopperVal").val(iconCode)
    }
    // else -> problem
}

function HandleCellClick(cell) {
    // determine what operation has been selected from dropdown
    switch (GetSelectedOperationType()) {
        case "markTerrain":
            handleTerrainMarkOperation(cell);
            break;
        case "markIcons":
            handleIconmarkOperation(cell);
            break;
        default:
            DisplayError("Dont know what to do!!");
    }

    function handleTerrainMarkOperation(cell) {
        var terrainColor = $("input[name=markTerrain]:checked").val();
        if (!!terrainColor) {
            PaintTerrainCell(cell, terrainColor);
        }
        // else problem, no color selected
    }

    function handleIconmarkOperation(cell) {
        var iconCode = $("input[name=markIcons]:checked").val();
        if (!!iconCode) {
            PaintIconCell(cell, iconCode);
        }
        // else problem, no icon selected
    }
}


function ChangeCurrentOperation() {
    $("#controlSections .controllSection")
        .hide()
        .find("input").prop("checked", false);

    $(".bordHolder").removeClass("cellsClickable");

    var selectedOperation = GetSelectedOperationType();
    var operationDivToShow = $("#" + selectedOperation);
    if (operationDivToShow.length === 0) {
        console.log("ChangeCurrentOperation error: " + selectedOperation + " not matched");
        return;
    }
    operationDivToShow.show();
}


function SetUpHeroGrid() {
    // Setup the hero drop down selector (once before per-hero cloning)
    var allHeroes = GetHeroChoices();
    var heroDDL = $("#row_heroName select");
    for (var i = 0; i < allHeroes.length; i++) {
        var hero = allHeroes[i];
        heroDDL.append("<option>" + hero.name + "</option>");
    }

    // If this is a new game, select some defaults

    // Construct elements based on number of heroes
    var numberOfHeroes = currentGame.heroCount;
    var headTr = $("#heroDetails thead tr").eq(0);
    for (var i = 1; i <= numberOfHeroes; i++) {
        var isRed = i % 2 != 0;
        headTr.append("<th>" + (isRed ? "Red" : "Blue") + "Hero #" + i + "</th>");
    }
    $("#heroDetails tbody tr").each(function () {
        var tr = $(this);
        var targetTd = tr.find("td").eq(1);
        for (var i = 1; i <= numberOfHeroes; i++) {
            var clonedTd = targetTd.clone();
            clonedTd.find("input, select, textarea").each(function () {
                if (!!$(this).attr("id")) {
                    var id = $(this).attr("id");
                    $(this).attr("id", id.replace("heroTick", i));
                }
            });
            tr.append(clonedTd);
        }
        targetTd.remove();
    });

    // Pushed saved game data to elements, or push the starting-game defaults.
    if (!!currentGame.savedItems) {
        var savedItems = ParseGameDataIntoDict(currentGame.savedItems);
        for (var key in savedItems) {
            $("#" + key).val(savedItems[key]);
        }
    }
    else {
        $("#row_heroLvl input").val("1");
        $("#row_heroExp input").val("0");
        $("#row_heroNextExp input").val("2");
    }

}


function EndRound() {
    var tbl = $("#cooldownTbl");
    tbl.find("tbody tr").each(function () {
        var textInput = $(this).find("td").eq(0).find("input");
        var text = textInput.val();
        var countDownInput = $(this).find("td").eq(1).find("input");
        var countDownVal = countDownInput.val();
        if (!!text) {
            var count = parseInt(countDownVal);
            console.log(count + " " + countDownVal);
            if (isNaN(count)) {
                alert("Bad countdown: " + countDownVal);
                return;
            }
            if (count == 0) {
                countDownInput.val("");
                textInput.val("");
            }
            else {
                count -= 1;
                countDownInput.val(count);
            }
        }
    });
}

function SaveGame() {

    SaveGameSheet();
    SaveGameBoard();

    UpdateAccountObj(accountObj);

    function SaveGameSheet() {
        var dataForm = $("#gameSheetForm form");
        ConvertIdsToNameAttribs(dataForm);
        // keep original text of inputs
        var savedItems = decodeURIComponent(dataForm.serialize().replace(/%2F/g, " "));
        currentGame.savedItems = savedItems;
        RemoveNameAttribs(dataForm);

        function ConvertIdsToNameAttribs(form) {
            $(form).find("input, select, textarea").each(function () {
                var item = $(this);
                if (!!item.attr("name") || !item.attr("id"))
                    return;

                item.attr("name", item.attr("id"));
                item.attr("data-dynamic-name", true);
            });
        }

        function RemoveNameAttribs(form) {
            $(form).find("*[data-dynamic-name]").each(function () {
                $(this).removeAttr("data-dynamic-name");
            });
        }
    }


    function SaveGameBoard() {
        var s = "";
        $(".bordHolder input[type=hidden]").each(function () {
            var v = $(this).val();
            if (!!v) {
                s += $(this).attr("name") + "=" + v + "&"
            }
        });
        currentGame.savedGameBoardItems = s;
    }
}

