//Represents the colors of the physical buttons
var myColors = ['red', 'blue', 'green', 'yellow', 'black'];
var score = 0;
//Current word to be displayed (from colors array)
var currentWord;
//Color the currentWord should be filled with
var currentColor;
//Time left in MS
var timeLeft;
//Number of milliseconds in the round + 60 to prevent 0 from displaying
var timeInRound;
//Amount of seconds per round
var seconds = 3;

//State of the game
var state = 0;

//Hardware variables
var serial;                             // variable to hold an instance of the serialport library
var portName = 'COM4';                  // fill in your serial port name here
var inData;                             // for incoming serial data
var ledOn = false;
var mappedData = 0;

function preload() {

}

function setup() {
	createCanvas(640,480);
	frameRate(60);
	currentWord = random(myColors);
	currentColor = random(myColors);
	timeInRound = 60*(seconds+1);
	timeLeft = timeInRound;

	//Hardware code
	serial = new p5.SerialPort();       // make a new instance of the serialport library
	serial.on('list', printList);       // set a callback function for the serialport list event
	serial.on('connected', serverConnected); // callback for connecting to the server
	serial.on('open', portOpen);        // callback for the port opening
	serial.on('data', serialEvent);     // callback for when new data arrives
	serial.on('error', serialError);    // callback for errors
	serial.on('close', portClose);      // callback for the port closing
	serial.list();                      // list the serial ports
	serial.open(portName);              // open a serial port
}

function draw() {
	background(164);
	playDraw();

}

function startDraw() {

}

//To be displayed if state is 1
function playDraw() {


	textAlign(CENTER, CENTER);
	fill(currentColor);
	textSize(64);
	text(currentWord, width/2, height/2);

	//Time left converted to seconds
	textSize(32);
	fill('black');
	text(Math.trunc(timeLeft / 60), 20, 20);

	//Score
	text("SCORE:" + score, width/2, 20);

	if(timeLeft == 60)
		updateCurrentWord();
	timeLeft--;
}

function endDraw() {
}

function mouseClicked() {
}

//Updates the text, color of text, and resets time
function updateCurrentWord() {
	currentWord = random(myColors);
	currentColor = random(myColors);
	timeLeft = timeInRound;
}

function keyPressed() {

}

//Checks the pressed values and updates the score if correct, resets after
//1,2,3,4,5 map to red, green, blue, yellow, black respectively
function checkAnswer(pressedColor) {
	switch(pressedColor) {
		case 49:
		 	if(currentColor == 'red')
				score++
			updateCurrentWord();
			break;
		case 50:
		 	if(currentColor == 'green')
				score++
			updateCurrentWord();
			break;
		case 51:
		 	if(currentColor == 'blue')
				score++
			updateCurrentWord();
			break;
		case 52:
		 	if(currentColor == 'yellow')
				score++
			updateCurrentWord();
			break;
		case 53:
		 	if(currentColor == 'black')
				score++
			updateCurrentWord();
			break;
	}
}

//Hardware
// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  // read a byte from the serial port, convert it to a number:
  inData = Number(serial.read());
	checkAnswer(47 + inData);
	//console.log(inData);
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
