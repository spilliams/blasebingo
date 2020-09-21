$(document).ready(another());
window.onresize = resize;

function airtableTiles(view) {
    var Airtable = require('airtable');
    var db = new Airtable({apiKey: 'keyqw38Y5vuJlSnaB'}).base('appIJ1lzu4Cyeqx9r');
    return db('Table 1').select({
        fields: ["HTML", "Contributor"],
        view: view,
    }).all().then(records => {
        return records;
    }).catch(e => {
        console.log(`error fetching airtable records from ${view}: ${e}`);
    });
}

function resize() {
    // aspect ratio = aN/aD
    aN = 10.0;
    aD = 12.0;
    // set sizes
    h = $(window).height();
    h = h - h % aD;
    w = aN * h / aD;
    // console.log(`intial height is ${h}. initial width is ${w}`);

    // don't overflow horizontally
    bad = $(window).width() - 10;
    if (w > bad) {
        h = h * bad / w;
        w = bad;
    }
    // console.log(`after accounting for overflowing width: ${h}, ${w}`);

    // colophon is below the fold, and is the final 10% of the height
    colophonP = 10;
    finalH = Math.round(h / ((100-colophonP)/100));
    w = Math.round(w);
    // console.log(`card is ${finalH} by ${w}`);
    $("#card").css({ "width": "" + w + "px" }); // "height": "" + finalH + "px", 

    // bingo is square
    // console.log(`bingo is ${w} high`);
    $("#bingo").css({"height": ""+w+"px"});

    // title is the remainder of the original aspect ratio, minus 2 points
    titleP = ((aD - aN) / aD) - 0.02;
    colophonP = (colophonP+2)/100.0;
    // console.log(`title is ${titleP*h}px and colophon is ${colophonP*h}px`);
    $("#title").css({
        "height": `${titleP*h}px`,
        "line-height": `${titleP*h*1.2}px` // 1.2 is from css
    });
    $("#by").css({"height": `${colophonP*h}px`});
}

function another() {
    resize();

    // start with existing tiles on the board because maybe we lost connection
    // to database?
    contributors = ["@jrfbz", "@spilliams"];
    defaultRegularTiles = [
        {"fields": {"HTML": "The Garages have released a new album!", "Contributor": ""}},
        {"fields": {"HTML": "Slowmode is enabled.", "Contributor": "@mackinithappen"}},
        {"fields": {"HTML": "New modification with zero explanation", "Contributor": "@jrfbz"}},
        {"fields": {"HTML": "#PARTYTIME", "Contributor": ""}},
        {"fields": {"HTML": "The Tigers suffer a tragedy", "Contributor": "@Jocelynbee"}},
        {"fields": {"HTML": "Incineration", "Contributor": "@MoistTalkers"}},
        {"fields": {"HTML": "Everyone rallies behind one team's blasphemy", "Contributor": "@ElevenQuietSeas"}},
        {"fields": {"HTML": "Yummy Reaction from peanuts", "Contributor": "Raulito"}},
        {"fields": {"HTML": "The Commissioner tweets \"uh\" or \"what\"", "Contributor": "@p_doodler"}},
        {"fields": {"HTML": "SHUTOUT", "Contributor": "Raulito"}},
        {"fields": {"HTML": "Jaylen Hotdog&shy;fingers beans a batter", "Contributor": ""}},
        {"fields": {"HTML": "Dead player on the leader board", "Contributor": "@p_doodler"}},
        {"fields": {"HTML": "FEEDBACK DETECTED", "Contributor": ""}},
        {"fields": {"HTML": "Someone steals home", "Contributor": "@VanbaelFox"}},
        {"fields": {"HTML": "MAXIMUM BLASEBALL", "Contributor": "@lordcakespy"}},
        {"fields": {"HTML": "Peanut shenanigans", "Contributor": "@blaseballsquid"}},
        {"fields": {"HTML": "BLASEBALL&shy;CARES IS OPE- BLASEBALL&shy;CARES IS ON A SIESTA!", "Contributor": ""}},
        {"fields": {"HTML": "SHAME", "Contributor": "Raulito"}},
        {"fields": {"HTML": "BNN says something completely false", "Contributor": ""}},
        {"fields": {"HTML": "The Fridays beg everyone to get York down", "Contributor": "@sixdogfriday"}},
        {"fields": {"HTML": "DOUBLE SHAME", "Contributor": "Dellainspace"}},
        {"fields": {"HTML": "These birds hate blaseball!", "Contributor": "@Centritide"}},
        {"fields": {"HTML": "The Blooddrain gurgles!", "Contributor": ""}},
        {"fields": {"HTML": "LGMBLDM but for a different team", "Contributor": "bloopsadoop"}},
    ];

    Promise.all([airtableTiles("Live Regular Spaces"), airtableTiles("Live Free Spaces")]).then(([regularTiles, freeTiles]) => {
        // set tile text
        if (typeof regularTiles != "undefined" && regularTiles.length >= 24) {
            regularTiles = randomTiles(24, regularTiles);
        } else {
            regularTiles = randomTiles(24, defaultRegularTiles);
            // regularTiles = defaultRegularTiles;
        }

        $(".gen").each(function (index) {
            // console.log(regularTiles[index]);
            tile = regularTiles[index].fields;
            $(this).html(tile.HTML);
            contributors.push($.trim(tile.Contributor));
        });

        // set free tile
        if (typeof freeTiles != "undefined" && freeTiles.length > 0) {
            freeTiles = randomTiles(1, freeTiles);
            tile = freeTiles[0].fields;
            $("#free").html(tile.HTML+"<br>(Free Space)");
            contributors.push($.trim(tile.Contributor));
        }

        // update contributors
        contributors = new Set(contributors);
        contributors.delete("@jrfbz");
        contributors.delete("@spilliams");
        contributors.delete("");
        contributors.delete(null);
        contributors = [...contributors];
        // console.log(contributors);
        $("#contributors").text(contributors.join(", "));
    });
}

function randomTiles(n, list) {
    tiles = [];
    for (i = 0; i < n; i++) {
        r = getRandomInt(list.length);
        tile = list[r];
        list.splice(r, 1);
        tiles.push(tile);
    }
    return tiles;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function invertColors(on) {
    if (on) {
        $("body").addClass("inverted");
    } else {
        $("body").removeClass("inverted");
    }
}