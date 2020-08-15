const fetchParams = {
    method: "GET",
    mode: "cors",
    cache: "default"
};

const urlCountries = "https://api.covid19api.com/countries";

changeCountry('Norway');

fetch(urlCountries, fetchParams)
    .then(res => {
        if(!res.ok){
            throw new TypeError(res.statusText);
        }
        return res.json();
    })
    .then(data => {
        const countries = data;
        let countryList = [];
        for (i in countries) {
            countryList.push(countries[i].Country);
        };
        countryList.sort()
        for (i in countryList) {
            let name = countryList[i];
            let opt = document.createElement("option");
            opt.innerHTML= name;
            opt.value = name;
            document.getElementById("dropdown").appendChild(opt)
        }
        
    })
    .catch(err => {
        console.log("Error fetching list of countries")
    })

function changeCountry(country) {

    const urlHist = "https://api.covid19api.com/dayone/country/" + country.toLowerCase() +"/status/confirmed";
    const urlStatus = "https://api.covid19api.com/summary"
    
    fetch(urlHist, fetchParams)
        .then(res => {
            if(!res.ok){
                throw new TypeError(res.statusText);
            }
            return res.json();
        })
        .then(data => {
            const countries = data;
            let countryData = [];
            for (i in countries) {
                countryData.push([Date.parse(countries[i].Date), parseInt(countries[i].Cases)])
            };
            const values = {
                type:'area',
                "crosshair-x": {},
    
                plot: {
                    tooltip: {
                        visible: false
                    }
                },
                series: [
                    {values:countryData,
                    text: "Antall smittede",
                    marker: {
                        visible: false
                    },
                    "background-color": "#0099FF #FFFFFF"
                }],
                    
                "scale-x": {
                    "transform": {
                        "type": "date",
                        "all": "%dd.%mm"
                    }
                }
            }
            zingchart.render({
                id: "chart-one",
                data: values,
                height: "20%",
                width: "100%"
            });
        })
        .catch(err => {
            console.log("Error generating graph")
        })  
    
    
    fetch(urlStatus, fetchParams)
        .then(res => {
            if(!res.ok){
                throw new TypeError(res.statusText);
            }
            return res.json();
        })
        .then(data => {
            const filtered = data.Countries.filter(function(item){
                return item.Country == country
            });
            console.log(filtered[0].Country);
            const newConfirmed = filtered[0].NewConfirmed
            const totalConfirmed = filtered[0].TotalConfirmed
            console.log(newConfirmed, totalConfirmed)
            document.getElementById("new").innerHTML = newConfirmed + " new case"
            document.getElementById("total").innerHTML = totalConfirmed + " in total"
            document.getElementById("country").innerHTML = "Confirmed number of infected in " + country
        })
        .catch(err => {
            console.log("Error fetching current status")
        })
}


