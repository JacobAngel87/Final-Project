/*
    Author: Jacob Angel
    Date: 12/12/2020
    Class: Web Dev 2
    Instructor: Kirsten Markley
*/

// Global API Variables
var APIStart = "https://api.openweathermap.org/data/2.5/weather?zip=";
var APIKey = "28867ee80da78a0bb42e1d4e6db1aa7d";
var iconURL = "https://openweathermap.org/img/wn/"
var iconEndUrl = "@2x.png"
// regex Expression for US Zip Codes
var validZipCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
// Global Logic Variables
var faded = false;
var fading;

// Vue App
var app = new Vue({
    el: "#app",
    // Vue Data Used by the DOM
    data: {
       zipCode: null,
       form: document.getElementById("form"),
       APIRequest: "",
       mainWeather: "",
       weatherDesc: "",
       temp: null,
       icon: null,
       city: "",
       currentTemp: null,
       highTemp: null,
       lowTemp: null,
       tempUnit: "K"
    },
    methods: {
        // Form Validation
        validateForm() {
            // Validating the Zipcode With regex
            let isValidZipCode = validZipCode.test(form.zipCode.value);
            let inputField = document.getElementById("zipCode");
            currentZipCode = form.zipCode.value;
            // Checks if the field is blank
            if(currentZipCode == "") {
                alert("ZIP CODE FIELD CANNOT BE EMPTY");
                inputField.style.backgroundColor = "#FF7F7F"
              // Checks if the Zipcode was in the right format
            } else if (!isValidZipCode) {
                // If it wasnt check if the length 5 digits 
                if(currentZipCode.length < 5) {
                    alert("INVALID ZIP CODE (NOT LONG ENOUGH)");
                    inputField.style.backgroundColor = "#FF7F7F"
                  // If it was 5 digits then there is something that is not a number in the field
                } else {
                    alert("INVALID ZIP CODE (CANNOT USE NON INTEGER CHARECTERS IN DATA FIELD)");
                    inputField.style.backgroundColor = "#FF7F7F"
                }
            } 
            // If the regex validated
            else {
                inputField.style.backgroundColor = "#FFF"
                let unit = "";
                // Check to see what unit the user chose
                if(document.getElementById("unit").value == 0) {
                    this.tempUnit = "F";
                    unit = "imperial"
                } else if(document.getElementById("unit").value == 1) {
                    this.tempUnit = "C";
                    unit = "metric"
                }
                // Set all of the data for the API call
                zipCode = currentZipCode;
                APIRequest = APIStart+zipCode+"&appid="+APIKey+"&units="+unit;
                // Send the API Request
                this.sendAPIRequest(APIRequest);
            }
        },
        sendAPIRequest(API) {
            // Using axios for the API call
            axios.get(API)
            // If we got results
            .then((results)=>{
                // Set all of the data for the Card
                let data = results.data.weather;
                this.icon = data[0].icon;
                this.icon = iconURL+this.icon+iconEndUrl;
                this.weatherDesc = data[0].description;
                this.mainWeather = data[0].main;
                this.city = results.data.name;
                this.currentTemp = results.data.main.temp;
                this.highTemp = results.data.main.temp_max;
                this.lowTemp = results.data.main.temp_min;
                // Fade in the bootstrap card
                this.fadeInCard();
            })
            // If we didn't get back any data
            .catch((error)=>{
                // Tell the user
                alert("NO DATA WAS RETURNED WITH CURRENT ZIP CODE");
                // Set the card to be invisible
                document.getElementById("card").style.opacity = "0";
                // Set the Zipcode to invalid
                document.getElementById("zipCode").style.backgroundColor = "#FF7F7F";
                faded = false;
            });
        },
        // Card fade in animation trigger
        fadeInCard() {
            // If the card has already faded in don't fade in again
            if(faded)
                return;
            // If it hasnt faded yet start a interval that gets called every 10 ms
            fading = setInterval(()=>{this.fadeIn()}, 10);
            // Set faded to true
            faded = true;
        },
        // Fade in Animation
        fadeIn() {
            // Get the current opacity of the card element 
            let currentOpacity = document.getElementById("card").style.opacity;
            // Parse it to float
            currentOpacity = parseFloat(currentOpacity);
            // Check to see if its fully visable
            if(currentOpacity == 1) {
                // If it is clear the fading interval and return out of this function
                clearInterval(fading);
                return;
            }
            // If not increment the opacity and let the interval continue 
            currentOpacity += 0.01;
            // Parse the opacity back to a string
            currentOpacity = currentOpacity.toString();
            // Set the opacity to the updated one and continue the interval
            document.getElementById("card").style.opacity = currentOpacity;   
        }
    }
})