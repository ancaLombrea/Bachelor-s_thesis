const button = document.getElementById('button');
const textDate = document.getElementById('dateInput');
const message = document.getElementById('date');
const dateInput = document.getElementById('inputDate');
const variableInput = document.getElementById('choosenVariable');
const radioButtonOne = document.getElementById('oneChart');
const radioButtonMultiple = document.getElementById('multimpleCharts');

google.charts.load('current', {packages: ['corechart', 'line']});

// click dupa ce introduci data 
button.addEventListener('click',() => {

    dateInput.style.borderColor = "black";
    variableInput.style.borderColor = "black";

    if(dateInput.value === ""){

        dateInput.style.borderColor = "red";
    }else if(variableInput.value === ""){

        variableInput.style.borderColor = "red";
    }else{
        getLatitudeLongitude(dateInput.value, variableInput.value);
    }
})

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkQ2lo1CWYq_Bo8rkIkJ1lX91jeqfEg-c",
    authDomain: "locatie-a496a.firebaseapp.com",
    databaseURL: "https://locatie-a496a-default-rtdb.firebaseio.com",
    projectId: "locatie-a496a",
    storageBucket: "locatie-a496a.appspot.com",
    messagingSenderId: "197923566603",
    appId: "1:197923566603:web:d1bc61734493e51837430e",
    measurementId: "G-VD2ZH9QW7C"
};
      
const app = initializeApp(firebaseConfig);
import{getDatabase, ref, child, get} 
    from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
const database = getDatabase();
const databaseRef = ref(database);

var nrAddress = 0;   // numarul de senzori
var nrLocation = 0;  // numarul de locatii 
var addresses = [];  // array cu adresele 
var locations = [];  // array cu locatiile 
var latitude = [];   // array cu latitudinile, aranjate in functie de indecsii locatiilor 
var longitude = [];  // array cu longitudinile 
var hoursArray = []; // array cu orele la care au fost postate scanarile 
var temperatureArray = [];  // array cu temperaturile 
var indexHours = 0;
var indexTempetarures = 0;
var listObjectArray = [];
var listNrDataArray = [];

// Obiect pentru fiecare dispozitiv
var object = [];
    
function getLatitudeLongitude(inputDate, inputVariableType){

    let date2 = dateFormat(inputDate, '_');
    // daca pe ora e compusa doar dintr-un singur numar ( 8 => 08)
    var insertedDate = inputDate;   
    
    console.log("Location_firebase/" + date2);
    get(child(databaseRef,"Location_firebase/" + date2 )).then((snapshoot) =>{
        
            let hourKey;  
            for(hourKey in snapshoot.val()){
                let nextNode = snapshoot.val()[hourKey];   
                let addressKey;

                for(addressKey in nextNode){
                    let nextNode2 = nextNode[addressKey]; 
                    if(addressKey.charAt(2) === ':' && addressKey.charAt(5) === ':' && addressKey.charAt(8) === ':' && addressKey.charAt(11) === ':' && addressKey.charAt(14) === ':'){

                        // daca arrayul este gol 
                        let addAddress = false;
                        if(addresses.length === 0){
                            addresses[0] = addressKey;
                            object.address = addressKey;
                            nrAddress = 1;
                            addAddress = true;
                        }
                        // daca arrayul nu este gol 
                        addresses.forEach(function(element){
                            if(element == addressKey ){
                                addAddress = true;
                            }
                        });
                        if(addAddress === false){
                            addresses[nrAddress] = addressKey;
                            nrAddress = nrAddress + 1;
                        }
                        
                        // Daca se intra pe ramura cu datele 
                        let typeKey;
                        for(typeKey in nextNode2){
                            let nextNode3 = nextNode2[typeKey];
                            let scanHourKey;

                            for(scanHourKey in nextNode3){
                                let nextNode4 = nextNode3[scanHourKey];
                                hoursArray[indexHours] = hourFormat(scanHourKey);
                                indexHours = indexHours + 1;

                                let dataKey;
                                for(dataKey in nextNode4){
                                    let nextNode5 = nextNode4[dataKey];
                                    // * dataKey = Temperature || Pressure || Humidity || CO2 || BVOC || IAQ
                                    let valueKey;
                                    for(valueKey in nextNode5){
                                        let dataValue = nextNode5[valueKey];
                                        if(dataKey === "temperature"){   
                                            temperatureArray[indexTempetarures] = dataValue;
                                            indexTempetarures = indexTempetarures + 1;
                                        }
                                    }
                                }
                            }
                        }
                    }else{

                        // Daca se intra pe ramura cu locatia 
                        let addLocation = false;
                        locations.forEach(function(element){
                            if(element !== addressKey  &&  addLocation === false){
                                locations[nrLocation] = addressKey;
                                nrLocation = nrLocation + 1;
                                addLocation = true;
                            }
                        });
                        if(locations.length === 0){
                            locations[0] = addressKey;
                            nrLocation = 1;
                            addLocation = true;
                        }


                        let firstInterrogation = false; 
                        let locationKey;
                        for(locationKey in nextNode2){
                            let nextNode33 = nextNode2[locationKey];

                            let valueKey;
                            for(valueKey in nextNode33){
                                let dataValue = nextNode33[valueKey];
                                if(addLocation == true){
                                    if(firstInterrogation == false){
                                        latitude[nrLocation - 1] = dataValue;
                                        firstInterrogation = true;
                                    }else{
                                        longitude[nrLocation - 1] = dataValue;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const container = document.getElementById('list-container');
            container.innerHTML = '';

            for(let i=0; i < latitude.length; i++){
                addLocationList(locations[i] + ": " + latitude[i] + ", " + longitude[i]);
            }
            locations.splice(0);
            latitude.splice(0);
            longitude.splice(0);

            if(radioButtonOne.checked){
                interrogateByAddress(date2, insertedDate, addresses, inputVariableType, 1);
            }
            if(radioButtonMultiple.checked){
                interrogateByAddress(date2, insertedDate, addresses, inputVariableType, 2);
            }
            if(!radioButtonOne.checked && !radioButtonMultiple.checked){
                interrogateByAddress(date2, insertedDate, addresses, inputVariableType, 2);
            }
            if(radioButtonOne.checked && radioButtonMultiple.checked){
                interrogateByAddress(date2, insertedDate, addresses, inputVariableType, 2);
            }
    })
    .catch((error)=>{
        alert("unsuccessful read" + error);
    })
}

function addLocationList(value) {

    let locationItem = document.createElement('li');
    locationItem.textContent = value;
    var list = document.getElementById('list-container');
    list.appendChild(locationItem);
}

///// chart nou 
function drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, deviceAddress, indexChart){
 
    var datasetArray = [];   
    var borderColorValue = ['rgba(0, 0, 250, 1)'];
    var borderWidthValue =  1.2;

    for(let i = 0; i < nrDataArray.length; i++){

        var datasetObject = {};
        datasetObject.label = objectArray[i].label;
        var hourData = []; 
        for(let j=0; j < nrDataArray[i]; j++){ 

            let dataa = {};
            dataa.x = insertedDate.concat(objectArray[i].hour[j]);
            dataa.y = objectArray[i].temp[j];
            hourData.push(dataa);
        }

        datasetObject.data = hourData;
        datasetObject.borderColor = getColorRGBA();  
        datasetObject.borderWidth = borderWidthValue; 
        datasetObject.pointRadius =0;
        datasetArray.pointStyle = 'line';
        datasetArray[i] = datasetObject;
    }

    // create datasets
    var datasetsValue = [];
    datasetsValue = datasetArray;
    const data = {
        labels: [new Date(insertedDate), new Date(insertedDate)],
        datasets: datasetsValue
      };
  
    const config = {
        type: 'line',
        data,
        options: {
          scales: {
              x:{
                  type: 'time',
                  ticks: {
                      major: {
                          enabled: true
                      }
                  },
                  title: {
                    display: true,
                    text: 'Time',
                    color: 'black',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                  }
              },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: inputVariableType,
                color: 'black',
                font: {
                    size: 13,
                    weight: 'bold'
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Device address: ' + deviceAddress,
              color: 'grey',
              font: {
                size: 15,
                weight: 'bold'
              }
            }
          }
        }
    };

    var chartId = 'myChart' + indexChart;
    const canvas = document.getElementById(chartId);
    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
       chartInstance.destroy();
    }

    const myChart = new Chart(
        document.getElementById(chartId),
        config
    );
}

// se alege o culoare random 
function getColorRGBA() {
    var colorRed = Math.floor(Math.random() * 256);
    var colorGreen = Math.floor(Math.random() * 256); 
    var colorBlue = Math.floor(Math.random() * 256); 
    return [`rgba(${colorRed}, ${colorGreen}, ${colorBlue}, 1)`];
}

function hourFormat(scanHourKey){

    let h;
    // daca ora este o singura cifra, se adauga 0 pe prima pozitie 
    if(scanHourKey.split("_")[0].length == 1){
        h = 'T0' + scanHourKey.split("_")[0] + ':';
    }else{
        h = 'T' + scanHourKey.split("_")[0] + ':';
    }
    if(scanHourKey.split("_")[1].length == 1){
        h = h + '0' + scanHourKey.split("_")[1] + ':';
    }else{
        h = h + scanHourKey.split("_")[1] + ':';
    }
    if(scanHourKey.split("_")[2].length == 1){
        h = h + '0' + scanHourKey.split("_")[2];
    }else if(scanHourKey.split("_")[2].length == 0){
        h = h + '00';
    }else{
        h = h + scanHourKey.split("_")[2];
    }

    return h;
}


function dateFormat(date2, dividingElement){
    let insertedDate;  

    insertedDate = date2.split('-')[2] + dividingElement + date2.split('-')[1] + dividingElement + date2.split('-')[0];
    if(date2.split('-')[2][0] == '0'){
        insertedDate = date2.split('-')[2][1] + dividingElement;  // ziua
    }else{
        insertedDate = date2.split('-')[2] + dividingElement;  // ziua
    }

    if(date2.split('-')[1][0] == '0'){
        insertedDate = insertedDate + date2.split('-')[1][1] + dividingElement;  // ziua 
    }else{
        insertedDate = insertedDate + date2.split('-')[1] + dividingElement;  // ziua
    }
    insertedDate = insertedDate + date2.split('-')[0];  // anul

    return insertedDate;
}

function interrogateByAddress(date2, insertedDate, addresses, inputVariableType, radioButton){

    const canvas = document.getElementById('myChart');
    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
       // Se distruge instanta graficului
       chartInstance.destroy();
    }

    let variableType;
    switch (inputVariableType){
        case "Temperature":
            variableType = "temperature";
            break;
        case "Relative Humidity":
            variableType = "humidity";
            break;
        case "Atmospheric Pressure":
            variableType = "pressure";
            break;
        case "CO2":
            variableType = "CO2";
            break;
        case "BVOC":
            variableType = "BVOC";
            break;
        default:
            variableType = "IAQ";
            break;
    }

    var labelValue;
    var hourValue;
    var temperature;
    for(let addr = 0; addr < addresses.length; addr++){

        console.log("Length   : " + addresses.length);
        var deviceMACAddress = addresses[addr];
        console.log("Adresele dispozitivelor: " + deviceMACAddress);
        get(child(databaseRef,"Location_firebase/" + date2 )).then((snapshoot) =>{
 
            let hourKey;  
            var tempArray = [];
            var indexTempArray = 0; 
            var hourArray = [];
            var indexHourArray = 0;
            var objectArray = [{}];
            var indexObjectArray = 0;
            var nrDataArray = [];
            var indexNrDataArray = 0;

            for(hourKey in snapshoot.val()){
                let nextNode = snapshoot.val()[hourKey];   // aici is valoarile copilului (numele adresei dispoz. + numele locatiei)
                let addressKey;
                    var object = {};
                    var tempArray = [];
                    var indexTempArray = 0; 
                    var hourArray = [];
                    var indexHourArray = 0;
                    var nrData = 0;
                for(addressKey in nextNode){

                    let nextNode2 = nextNode[addressKey];  
                    if(addressKey.charAt(2) === ':' && addressKey.charAt(5) === ':' && addressKey.charAt(8) === ':' && addressKey.charAt(11) === ':' && addressKey.charAt(14) === ':'){
                        
                        if(addressKey === addresses[addr]){  
                        let typeKey;
                        for(typeKey in nextNode2){
                            let nextNode3 = nextNode2[typeKey];
                            let scanHourKey;
                            for(scanHourKey in nextNode3){
                                let nextNode4 = nextNode3[scanHourKey];
                               
                                hourValue = hourFormat(scanHourKey);
                                hourArray[indexHourArray] = hourValue;
                                indexHourArray = indexHourArray + 1;

                                let dataKey;
                                for(dataKey in nextNode4){
                                    let nextNode5 = nextNode4[dataKey];
                                    // * dataKey = Temperature || Pressure || Humidity || CO2 || BVOC || IAQ
                                
                                    let valueKey;
                                    for(valueKey in nextNode5){
                                        let dataValue = nextNode5[valueKey];
                                        if(dataKey === variableType){   
                                            temperature = dataValue;
                                            tempArray[indexTempArray] = temperature;
                                            indexTempArray = indexTempArray +1;
                                            nrData = nrData + 1; 
                                        }
                                    }
                                }
                            }
                        }

                        if(radioButton == 1){
                            labelValue = addressKey; 
                        }

                     }

                    

                    }else{
                        if(radioButton == 2){
                            labelValue = addressKey; 
                            console.log("Locatia: " + labelValue);
                        } 
                    }
                }

                object.label = labelValue;   
                console.log("Adresaaaaaaa: " + object.label);
                object.temp = tempArray;
                console.log("OOOO " + indexTempArray + "-" + tempArray.length);
                object.hour = hourArray;

                if(tempArray.length != 0){
                    objectArray[indexObjectArray] = object;
                    indexObjectArray = indexObjectArray + 1;
                    nrDataArray[indexNrDataArray] = nrData;  
                    indexNrDataArray = indexNrDataArray + 1;
                }
            }

            if(radioButton == 2){
                switch(addr){
                    case 0: 
                        console.log("device address " + deviceMACAddress);
                        drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, addresses[addr], 0);
                        break;
                    case 1:
                        console.log("device address " + deviceMACAddress);
                        drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, addresses[addr], 1);
                        break;
                    case 2:
                        console.log("device address " + deviceMACAddress);
                        drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, addresses[addr], 2);
                        break;
                    case 3:
                        console.log("device address " + deviceMACAddress);
                        drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, addresses[addr], 3);
                        break;
                    case 4:
                        console.log("device address " + deviceMACAddress);
                        drawChart(insertedDate, objectArray, nrDataArray, inputVariableType, addresses[addr], 4);
                        break;
                    default:
                        break;
                }

                radioButtonMultiple.checked = false;
            }

            if(radioButton == 1){
                
                listObjectArray[addr] = objectArray;
                listNrDataArray[addr] = nrDataArray;
                radioButtonOne.checked = false;

                if(addr == (addresses.length-1)){
                    console.log("list2 " + listObjectArray + "::" + listNrDataArray);
                    drawChart2(insertedDate, listObjectArray, listNrDataArray, inputVariableType, addresses);
                }
            }
            


        })
        .catch((error)=>{
            alert("unsuccessful read" + error);
        })

    } 


    function drawChart2(insertedDate, listObjectArray, listNrDataArray, inputVariableType, deviceAddress){

    var datasetArray = [];    
    var borderWidthValue =  1.2;
    let datasetArrayFinal = []; 

    for(let k = 0; k < listObjectArray.length; k++){
        let nrDataArray = listNrDataArray[k];
        let objectArray = listObjectArray[k];
        let color = getColorRGBA();

        for(let i = 0; i < nrDataArray.length; i++){
    
            var datasetObject = {};
            datasetObject.label = objectArray[i].label;
            var hourData = []; 
            for(let j=0; j < nrDataArray[i]; j++){ 
    
                let dataa = {};
                dataa.x = insertedDate.concat(objectArray[i].hour[j]);
                dataa.y = objectArray[i].temp[j];
                hourData.push(dataa);
            }

            datasetObject.data = hourData;
            datasetObject.borderColor = color;  
            datasetObject.borderWidth = borderWidthValue; 
            datasetObject.pointRadius =0;
            datasetArray.pointStyle = 'line';
            datasetArray[i] = datasetObject;
        }
    
        // create datasets
        var datasetsValue = [];
        datasetsValue = datasetArray;
        datasetArrayFinal = datasetArrayFinal.concat(datasetsValue);
    }
    
    const data = {
        labels: [new Date(insertedDate), new Date(insertedDate)],
        datasets: datasetArrayFinal
    };
  
    const config = {
        type: 'line',
        data,
        options: {
          scales: {
              x:{
                  type: 'time',
                  ticks: {
                      major: {
                          enabled: true
                      }
                  },
                  title: {
                    display: true,
                    text: 'Time',
                    color: 'black',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                  }
              },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: inputVariableType,
                color: 'black',
                font: {
                    size: 13,
                    weight: 'bold'
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: inputVariableType + ' values ',
              color: 'grey',
              font: {
                size: 15,
                weight: 'bold'
              }
            }
          }
        }
      };

    var chartId = 'myChart0';
    const canvas = document.getElementById('myChart0');
    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) {
        chartInstance.destroy();
    }

    const myChart = new Chart(
        document.getElementById(chartId),
        config
    );
    }
    
} 