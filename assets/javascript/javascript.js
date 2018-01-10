// initializing firebase
var config = {
  apiKey: "AIzaSyBEUlmtewa_O9SohxVhn7krrZl3w6fbqmc",
  authDomain: "traindatabase-d583d.firebaseapp.com",
  databaseURL: "https://traindatabase-d583d.firebaseio.com",
  projectId: "traindatabase-d583d",
  storageBucket: "traindatabase-d583d.appspot.com",
  messagingSenderId: "86664357471"
};

firebase.initializeApp(config);

// saving firebase database into accessible variable 
var database = firebase.database();


$(document).ready(function(){
  // button click
  $(".trainButton").on("click", function(){
    // preventing the default function of a button, which is to reload the page
    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#trainDestination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var trainFrequency = $("#frequency").val().trim();

    // object to hold data
    var trainData = {
      name: trainName,
      destination: trainDestination,
      time: trainTime,
      frequency: trainFrequency
    }

    // push each new set of train data on button click to the database
    database.ref().push({
      trainData
    });


  });

  // when a child is pushed to firebase, do these actions
    database.ref().on("child_added", function(snapshot){

      // creating table rows and data
      var row = $('<tr>');
      var nameData = $('<td>');
      var destinationData = $('<td>');
      var frequencyData = $('<td>');    
      var arrivalData = $('<td>');
      var minutesAwayData = $('<td>');

      // adding text directly from firebase data
      nameData.text(snapshot.val().trainData.name);
      destinationData.text(snapshot.val().trainData.destination);
      frequencyData.text(snapshot.val().trainData.frequency);

      // converting time variable to moment.js format
      var firstRun = snapshot.val().trainData.time;
      var firstRunConverter = "h:mm a";
      var convertedFirstRun = moment(firstRun, firstRunConverter);

      // getting current time 
      var currentTime = moment();

      // difference between current time and first run time
      var timeDifference = moment().diff(moment(convertedFirstRun), "minutes");

      // getting remainder, which will help us calculate the minutes until next arrival
      var timeRemainder = timeDifference % snapshot.val().trainData.frequency;

      // subtracting the remainder from the frequency (remainder will be less than or equal
      // to frequency, allowing us to find the minutes away)
      var minutesUntilNextTrain = snapshot.val().trainData.frequency - timeRemainder;

      minutesAwayData.text(minutesUntilNextTrain);

      // variable for next arrival, current time adding minutes until next arrival in the format "minutes"
      var nextArrival = currentTime.add(minutesUntilNextTrain, "minutes");
      

      arrivalData.text(moment(nextArrival).format("hh:mm a"));

      // appending data
      row.append(nameData, destinationData, frequencyData, arrivalData, minutesAwayData);

      // appending row
      $("#tbody").append(row);

    });
});