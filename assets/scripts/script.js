
var search;
var firstBoot = true;
var clickedButton = false;
var list;

const maxButtons = 8;
var searchHistory;
if (localStorage.getItem("searchHistory") !== null) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
}
else {
    searchHistory = [];
}


$("#search-form").submit(function (event) {
    event.preventDefault();
    var searchRes = $("#search").val();
    if (searchRes === "") {
        return;
    }
    clickedButton = false;
    localStorage.setItem("lastSearch", searchRes);
    if (searchHistory.length < 8) {
        searchHistory.splice(0, 0, searchRes);
    }
    else {
        searchHistory.pop();
        searchHistory.splice(0, 0, searchRes);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    forecast();
    loadSidebar();
})

$(document).on('click','.searchbutton',function(){
    search = $(this).text();
    console.log(search);
    clickedButton=true;
    forecast();
});
function forecast() {
    if (firstBoot) {
        if (localStorage.getItem("lastSearch") === null) {
            //default to atlanta
            search = "atlanta";
        }
        else {
            search = localStorage.getItem("lastSearch");
        }
        firstBoot = false;
    }
    else if (!clickedButton) {
        search = $("#search").val();
    }
    else {
        //todo : search should be set
        console.log(search);
    }


    const api_key = "c3815d23f3ee9371ba930d7775f02326";
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + api_key + "&units=imperial";
    var res;

    $.ajax({ method: "get", url: queryUrl }).then(function (response) {
        res = response;
        console.log(response);
        $("#forecast-city").text(response.name);
        $("#forecast-humidity").text(response.main.humidity);
        $("#forecast-temp").text(response.main.temp);
        $("#forecast-date").text(moment.unix(response.dt).format("(L)"));
        $("#forecast-cloud-icon").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        $("#forecast-windspeed").text(response.wind.speed);

        var long = response.coord.lon;
        var lat = response.coord.lat;

        var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + long + "&appid=c3815d23f3ee9371ba930d7775f02326"

        $.ajax({ method: "get", url: uvQueryUrl }).then(function (res) {
            console.log(res);
            $("#uv-index").text(res[0].value);
        })

        var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=c3815d23f3ee9371ba930d7775f02326" + "&units=imperial";

        $.ajax({ method: "get", url: fiveDayUrl }).then(function (fiveDayRes) {
            console.log(fiveDayRes);
            var list = fiveDayRes.list;
            var fivedayElList = $(".fiveday");
            for (var i = 0; i * 8 < list.length; i++) {
                var currentDay = fivedayElList.eq(i);
                var currListItem = list[i * 8];
                currentDay.empty();

                var newDiv = $("<div>");
                newDiv.addClass("d-flex justify-content-center flex-column d-md-block");

                var dateEL = $("<div>");
                dateEL.append(moment.unix(currListItem.dt).format("L"));
                dateEL.addClass("text-center text-md-left");
                newDiv.append(dateEL);

                var iconEL = $("<img>");
                iconEL.attr("src", "https://openweathermap.org/img/w/" + currListItem.weather[0].icon + ".png");
                iconEL.addClass("mx-auto ");
                newDiv.append(iconEL);

                var tempEL = $("<div>");
                tempEL.append("temp: ");
                tempEL.append(currListItem.main.temp);
                tempEL.addClass("text-center text-md-left");
                newDiv.append(tempEL);

                var humidityEL = $("<div>");
                humidityEL.append("humidty: ");
                humidityEL.append(currListItem.main.humidity);
                humidityEL.append("%");
                humidityEL.addClass("text-center text-md-left");
                newDiv.append(humidityEL);

                currentDay.append(newDiv);
            }

        });
    })




}
/* <li>
<div class="card">
    <div class="card-body">
        Austin
    </div>
</div>
</li>
<li>
<div class="card">
    <div class="card-body">
        Chicago
    </div>
</div>
</li>
<li>
<div class="card">
    <div class="card-body">
        New York
    </div>
</div>

</li>
<li>
<div class="card">
    <div class="card-body">
        Orlando
    </div>
</div>

</li>
<li>
<div class="card">
    <div class="card-body">
        San Francisco
    </div>
</div>

</li>
<li>
<div class="card">
    <div class="card-body">
        Seattle
    </div>
</div>
</li>
<li>
<div class="card">
    <div class="card-body">
        Denver
    </div>
</div>
</li>
<li>
<div class="card">
    <div class="card-body">
        Atlanta
    </div>
</div>
</li> */

//loading the history buttons
function loadSidebar() {

    var collapseButtons = $("#collapsable-search-history-buttons");
    var mediumButtons = $("#medium-screen-search-history-buttons");
    collapseButtons.empty();
    mediumButtons.empty();
    for (var i = 0; i < searchHistory.length; i++) {
        var newButton = $("<li>");
        var card = $("<div>");
        card.addClass("card");
        var cardBody = $("<div>");
        cardBody.addClass("card-body searchbutton");
        cardBody.append(searchHistory[i]);
        card.append(cardBody);
        newButton.append(card);
        var newButton2 = newButton.clone();

        collapseButtons.append(newButton2);
        mediumButtons.append(newButton);
    }

}
loadSidebar();
forecast();