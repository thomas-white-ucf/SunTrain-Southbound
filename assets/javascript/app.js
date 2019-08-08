// ==+==================================================================================================+==
// Now! go to https://ucf-firebase-tester.firebaseio.com/ to see the impact to the DB
// not regestered as new firebase app, still works for now
// ==+==================================================================================================+==
var firebaseConfig = {
    apiKey: "AIzaSyAu64hvc2_FkMGuke-N6RPS8kaAy0zUZrE",
    authDomain: "ucf-firebase-tester.firebaseapp.com",
    databaseURL: "https://ucf-firebase-tester.firebaseio.com",
    projectId: "ucf-firebase-tester",
    storageBucket: "",
    messagingSenderId: "1019737632989",
    appId: "1:1019737632989:web:4068ee018fa87bfe"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// ==+==================================================================================================+==

// Get a reference to the database service
var dataRef = firebase.database();

// Initial Values // var clickCounter = 0;
var name = "";
var destination = "";
var firstTrainTime = "00:00"
var comment = "";


// ==+=============================================================================+==
// Functions

// ==+====  ON CLICK
// ==+=======================================================+==
// Button for adding trains, captures user input on Click - #add-train-btn
$("#add-train-btn").on("click", function (event) {

    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainRate = $("#rate-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        rate: trainRate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads train data to the database
    dataRef.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");

    // Logs everything to console
    console.log("======== CLICKED #add-train-btn ===============")
    console.log("Entered Train Name and info = " + newTrain.name, newTrain.destination, newTrain.start, newTrain.rate);
});

// ==+====  ON CHILD ADDED
// ==+=======================================================+==
dataRef.ref().on("child_added", function (childSnapshot) {

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainRate = childSnapshot.val().rate;

    // ======================= TIME FUNCTION ================================
    // Console.Log everything that's coming out of snapshot
    console.log("TIME===dataRef====on( CHILD_ADDED START==== TIME FUNCTIONS")
    console.log("trainName & info == " + trainName)
    console.log("trainDestination" + trainDestination)
    console.log("trainRate == " + trainRate)
    console.log("trainStart == " + trainStart)


    // Make train start time Pretty - "HH:mm"
    // Get the diffArrivalTrainTime - this is difference in time from NOW to the first train
    var trainStartPretty = moment.unix(trainStart).format("HH:mm");
    var diffArrivalTrainTime = Math.abs(moment().diff(moment(trainStartPretty, "HH:mm"), "minutes"));

    console.log("trainStartPretty = " + trainStartPretty + "HH:mm");
    console.log("diffArrivalTrainTime = " + diffArrivalTrainTime + " minutes");

    // train rate in differnet format could help
    // Calculate the total time until next train
    var remainder = (diffArrivalTrainTime % 60);
    var fullHours = Math.floor(diffArrivalTrainTime / 60);
    var fullMinutes = fullHours * 60;

    console.log("remainder = " + remainder);
    console.log("fullHours = " + fullHours);
    console.log("fullMinutes = " + fullMinutes);

    var minutesAway = Math.abs(trainRate - remainder);
    console.log("minutesAway = " + minutesAway);

    // if remainder is less than 60, then this does not add anything for remainder and minutesAway
    var nextArrivalMinutes = moment().add(minutesAway, "minutes");
    console.log("nextArrivalMinutes = " + nextArrivalMinutes)
    // var nextArrivalMinutes = moment().add(minutesAway, "minutes");

    var nextArrival = moment(nextArrivalMinutes, "minutes").format("hh:mm a");
    console.log("nextArrival =================" + nextArrival);

    // END TIME FUNCTIONS
    // ===============================================================

    // Create the new row
    var newRow = $("<tr>").append(
        // Name
        $("<td>").text(trainName),
        // Destination
        $("<td>").text(trainDestination),
        //      Frequency    - minutes
        $("<td>").text(trainRate),
        //      NEXT ARRIVAL - HH:mm
        $("<td>").text(nextArrival),
        //      Minutes Away - minutes
        $("<td>").text(minutesAway),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// END
// ==+=======================================================+==


