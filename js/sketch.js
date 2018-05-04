let training = new Array(2000);

let ptron;

let count = 0;

let xmin = -1;
let ymin = -1;
let xmax = 1;
let ymax = 1;

let pending = 0;
let constant = 0;

let learningRate = 0.001;

function initializeValues() {

  if($("#pending").val() != ""){
    pending = parseFloat($("#pending").val());
  }
  else{
    pending = 0;
  }
  if($("#constant").val() != ""){
    if($("#constant").val() >= .96 || $("#constant").val() <= -.96){
      $("#constant").val("");
      alert("El valor de \"b\" solo puede estar entre -0.95 al 0.95 para poder apreciar el resultado.");
    }
    else{
      constant = parseFloat($("#constant").val());
    }
  }
  else{
    constant = 0;
  }

  if(pending == 0 && constant == 0){
    $("#function-value").html("m * x + b ->");
  }
  else{
    $("#function-value").html(pending + " * x + " + constant + " ->");
  }

  if($("#learning-rate").val() != ""){
    learningRate = parseFloat($("#learning-rate").val());
  }
  else{
    $("#learning-rate").val(0.001);
  }

  ptron = new Perceptron(3, learningRate); 

  for (let i = 0; i < training.length; i++) {
    let x = random(xmin, xmax);
    let y = random(ymin, ymax);
    let answer = 1;
    if (y < f(x)) 
      answer = -1;
    
      training[i] = {
      input: [x, y, 1],
      output: answer
    };
  }
}

function f(x) {
  let y = pending * x + constant;
  return y;
}

function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("canvas")
  initializeValues();
}


function draw() {
  background(0);

  strokeWeight(1);
  stroke(255);
  let x1 = map(xmin, xmin, xmax, 0, width);
  let y1 = map(f(xmin), ymin, ymax, height, 0);
  let x2 = map(xmax, xmin, xmax, 0, width);
  let y2 = map(f(xmax), ymin, ymax, height, 0);
  line(x1, y1, x2, y2);
  
  stroke(255);
  strokeWeight(2);
  let weights = ptron.getWeights();
  let mapx1 = xmin;
  let mapy1 = -(weights[2] / weights[1]) - (weights[0] / weights[1]) * mapx1;
  let mapx2 = xmax;
  let mapy2 = -(weights[2] / weights[1]) - (weights[0] / weights[1]) * mapx2;

  let linex1 = map(mapx1, xmin, xmax, 0, width);
  let liney1 = map(mapy1, ymin, ymax, height, 0);
  let linex2 = map(mapx2, xmin, xmax, 0, width);
  let liney2 = map(mapy2, ymin, ymax, height, 0);
  line(linex1, liney1, linex2, liney2); 

  ptron.train(training[count].input, training[count].output);
  count = (count + 1) % training.length;
  
  for (let i = 0; i < count; i++) {
    stroke(255);
    strokeWeight(1);
    fill(255);
    let guess = ptron.feedforward(training[i].input);
    if (guess > 0) noFill();

    let x = map(training[i].input[0], xmin, xmax, 0, width);
    let y = map(training[i].input[1], ymin, ymax, height, 0);
    ellipse(x, y, 8, 8);
  }

  stroke(255);
  strokeWeight(3);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
}