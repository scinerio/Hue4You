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

var myFont;

//Hardware variables
var serial;                             // variable to hold an instance of the serialport library
var portName = 'COM4';                  // fill in your serial port name here
var inData;                             // for incoming serial data
var ledOn = false;
var mappedData = 0;

//Sound variables
var synth, chordLoop;
var polysynth;

var fChord = ["F4", "C4", "A5"];
var gChord = ["G4", "B5", "D5"];
var aChord = ["A4", "C5", "E5"];
var part8, part16, hpart16;

function preload() {
	myFont = loadFont("Raleway.otf");
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


	//Sound variables
	Tone.Transport.bpm.value = 60;
  Tone.Transport.loop = true;

	synth = new Tone.PolySynth(4, Tone.Monosynth).toMaster();

	//Loop will always be playing
	chordLoop = new Tone.Loop(function(time){
		synth.triggerAttackRelease(["F4", "C4", "A4"], "8n", time);
		synth.triggerAttackRelease(["G4", "B4", "D4"], "8n", time + "+4n");
		synth.triggerAttackRelease(["A4", "C5", "E5"], "8n", time + "+4n*2");
		synth.triggerAttackRelease(["G4", "B4", "D4"], "8n", time + "+4n*3");
  	}, "1n");

	part8 = new Tone.Sequence(function(time, note){
	synth.triggerAttackRelease(note, "8n", time);
	}, ["F4", "A4", "G4", "A4", "B4", "C4", "D4", "E4"], "8n").start();

	part16 = new Tone.Sequence(function(time, note){
	synth.triggerAttackRelease(note, "8n", time);
}, ["A4", ["G5", "F5"], "C5", "A4", "D5", "E5", "G5", "A5"], "16n").start();

	hpart16 = new Tone.Sequence(function(time, note){
	synth.triggerAttackRelease(note, "8n", time);
}, ["A4", ["A6", "F6"], "C6", "C6", "D6", "E6", "G6", "A6"], "16n").start();

	chordLoop.start(0);
	Tone.Transport.start();

}

function draw() {
	if(state == 0)
		startDraw();
	else if(state == 1)
		playDraw();
	else
		helpDraw();
}

function startDraw() {
	background(200);
	textFont(myFont);
	textSize(52);
	fill(0, 125, 0);
	textAlign(CENTER)
	text("Hue2", width/2, 60);
	// rectMode(CENTER);
	// noFill();
	// rect(width/2, height/2, 150, 60);

	textSize(32);
	fill(125,0,0);
	text("Play", width/2, 200);
	fill(0,0,125);
	text("Help", width/2, 250);
}

//To be displayed if state is 1
function playDraw() {
	background(200);
	textFont(myFont);
	textAlign(CENTER, CENTER);
	fill(currentColor);
	textSize(72);
	text(currentWord, width/2, height/2);

	//Time left converted to seconds
	textSize(32);
	fill('black');
	text(Math.trunc(timeLeft / 60), 20, 20);

	//Score
	text("SCORE: " + score, width/2, 20);

	if(timeLeft == 60)
		updateCurrentWord();
	timeLeft--;
}

function endDraw() {
}

function helpDraw() {

}
function playMusic() {
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
	//part8.stop();
	//part16.stop();
}

function mouseClicked() {
	console.log("X: " + mouseX);
	console.log("Y: " + mouseY);
	console.log("State is " + state);
	if(mouseX > 290 && mouseX < 350) {
		if(mouseY > 175 && mouseY < 210) {
			state = 1;
		}
		else if(mouseY >= 210 && mouseY < 255) {
			state = 2;
		}
	}
	return false;

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
