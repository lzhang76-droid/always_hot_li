let font;
let warmPalette, coolPalette;

let controls = {
  flashes: 3,
  hotText: "Always Hot",
  freshText: "Always Fresh",
  warm1: "#ff3333",
  warm2: "#ff8800",
  warm3: "#ffcc00",
  cool1: "#3399ff",
  cool2: "#33cc99",
  cool3: "#6666ff",
  download: function () {
    saveCanvas("poster", "png");
  }
};

let flashCount = 0;
let flashing = false;

function preload() {
  font = loadFont("assets/Futura-Book-2.ttf"); 
}

function setup() {
  createCanvas(1000, 600);
  textFont(font);
  textAlign(CENTER, CENTER);
  noLoop();

  updatePalettes();

  const gui = new dat.GUI();
  gui.add(controls, "flashes", 1, 10, 1).name("times of flicker");
  gui.add(controls, "hotText").name("Text1");
  gui.add(controls, "freshText").name("Text2");


  gui.addColor(controls, "warm1").name("color1").onChange(updatePalettes);
  gui.addColor(controls, "warm2").name("color2").onChange(updatePalettes);
  gui.addColor(controls, "warm3").name("color3").onChange(updatePalettes);


  gui.addColor(controls, "cool1").name("color1").onChange(updatePalettes);
  gui.addColor(controls, "cool2").name("color2").onChange(updatePalettes);
  gui.addColor(controls, "cool3").name("color3").onChange(updatePalettes);

  gui.add(controls, "download").name("download PNG");
}

function updatePalettes() {
  warmPalette = [
    color(controls.warm1),
    color(controls.warm2),
    color(controls.warm3)
  ];
  coolPalette = [
    color(controls.cool1),
    color(controls.cool2),
    color(controls.cool3)
  ];
}

function drawScene(line, palette, clipX, clipY, clipW, clipH) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(clipX, clipY, clipW, clipH);
  drawingContext.clip();

  blendMode(DIFFERENCE);
  let chars = line.split("");
  let numChars = int(random(40, 100));
  for (let i = 0; i < numChars; i++) {
    push();
    let x = random(clipX, clipX + clipW);
    let y = random(clipY, clipY + clipH);
    translate(x, y);
    rotate(random(-PI / 2, PI / 2));
    textSize(random(80, 200));
    let c = random(palette);
    fill(c);
    stroke(c);
    strokeWeight(random(3, 15));
    text(random(chars), 0, 0);
    pop();
  }

  blendMode(BLEND);
  push();
  translate(clipX + clipW / 2, clipY + clipH / 2);
  textSize(random(80, 150));
  rotate(random(-0.4, 0.4));
  noFill();
  stroke(0);
  strokeWeight(random(6, 25));
  text(line, 0, 0);
  pop();

  drawingContext.restore();
  pop();
}

function draw() {
  if (!flashing) return;

  background(255);

  if (flashCount % 2 === 0) {
    drawScene(controls.hotText, warmPalette, 0, 0, width, height / 2);
    drawScene(controls.freshText, coolPalette, 0, height / 2, width, height / 2);
  } else {
    drawScene(controls.hotText, warmPalette, 0, 0, width / 2, height);
    drawScene(controls.freshText, coolPalette, width / 2, 0, width / 2, height);
  }


  if (frameCount % 20 === 0) {
    flashCount++;
    if (flashCount >= controls.flashes) {
      flashing = false;
      noLoop();
    }
  }
}

function mousePressed() {
  flashCount = 0;
  flashing = true;
  loop();
}

