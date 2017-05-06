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
var seconds;

//State of the game
var state = 0;

var myFont;

var lives = 5;

var lastGreen = false;

var finalScore;
//Hardware variables
var serial;                             // variable to hold an instance of the serialport library
var portName = 'COM4';                  // fill in your serial port name here
var inData;                             // for incoming serial data
var mappedData = 0;

//Sound variables
var synth, chordLoop, fmSynth;
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
	if(mappedData > 0)
		seconds = mappedData;
	else
		seconds = 3;
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
	fmSynth = new Tone.FMSynth().toMaster();
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
}, ["A4", ["G5", "F5"], "A5", "A4", "D5", "E5", "G5", "A5"], "16n").start();

	hpart16 = new Tone.Sequence(function(time, note){
	fmSynth.triggerAttackRelease(note, "8n", time);
}, ["G6", ["A6", "G6"], "A6", "C6", "D6", "E6", "G6", "E6"], "16n").start();

	fmSynth.volume.value = -40;
	chordLoop.start(0);
	Tone.Transport.start();

}

function draw() {
	if(state == 0)
		startDraw();
	else if(state == 1)
		playDraw();
	else if(state == 2)
		helpDraw();
	else
		endDraw();
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
	chordLoop.start();
	fmSynth.volume.value = -5;
	part8.start();
	part16.start();
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


	text("Lives:" + lives, 480, 20);


	if(timeLeft == 60) {
		updateCurrentWord();
		lives--;
		if(lives == 0)
			state = 3;
	}
	timeLeft--;
}

function endDraw() {
	background(200);
	textSize(52);
	fill(0,0,125);
	textAlign(CENTER);
	text("Final Score: " + finalScore, width/2, height/2);

	fill('green');
	textSize(30);
	text("Press green to play again", width/2, height/2 + 50)
}

function helpDraw() {
	background(200);
	textAlign(CENTER);
	textSize(52);
	fill(125,0,0);
	text("Help", width/2, 54);
	fill(0,0,125);
	textSize(30)
	text("Gain points by pressing the button", width/2, height/2 - 30);
	text("that the word is colored in!", width/2, height/2);
	fill(0,125,0);
	text("Back", width/2, height/2 + 200);
}
function playMusic() {
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
	if(state == 0) {
		if(mouseX > 290 && mouseX < 350) {
			if(mouseY > 175 && mouseY < 210) {
				state = 1;
			}
			else if(mouseY >= 210 && mouseY < 255) {
				state = 2;
			}
		}
	}

	if(state == 2) {
		if(mouseX > 290 && mouseX < 350) {
			if(mouseY > 420 && mouseY < 440)
				state = 0;
		}
	}
		return false;

}

//Checks the pressed values and updates the score if correct, resets after
//2,3,4,5,6 map to red, green, blue, yellow, black respectively
function checkAnswer(pressedColor) {
	var wasCorrect = false;
	switch(pressedColor) {
		case 49:
		 	if(currentColor == 'red') {
				score++
				wasCorrect = true;
			}
			updateCurrentWord();
			break;
		case 50:
		 	if(currentColor == 'green') {
				score++
				wasCorrect = true;
			}
			updateCurrentWord();
			break;
		case 51:
		 	if(currentColor == 'blue') {
				score++
				wasCorrect = true;
			}
			updateCurrentWord();
			break;
		case 52:
		 	if(currentColor == 'yellow') {
				score++
				wasCorrect = true;
			}
			updateCurrentWord();
			break;
		case 53:
		 	if(currentColor == 'black') {
				score++
				wasCorrect = true;
			}
			updateCurrentWord();
			break;
	}
	if(!wasCorrect){
		lives--;
		if(lives == 0) {
			if(pressedColor == 50)
				inData = 0;						//Nullify indata so game doesn't restart
			state = 3;
			finalScore = score;
		}
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
  inData = parseInt(serial.read());
	if(inData <= 6 && inData >= 2 && state == 1) {
		checkAnswer(47 + inData);
	}
	if(inData >= 7 && inData <= 13){
		seconds = inData - 6;
		timeInRound = 60*(seconds+1);
		console.log("seconds: " + seconds);
	}

	if(state == 3 && inData == 3) {
		state = 1;
		lives = 5;
		score = 0;
	}

}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
