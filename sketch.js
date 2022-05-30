let points, indices, triangles, img;

const RADIUS = 75;
const CURVE = 2;
const DT = 0.5;

const m = _.range(1, 100, 1).concat(_.range(100, 1, -1));
console.log(m);
function preload() {
  img = loadImage('assets/texture3.jpg');
}

function setup() {
  createCanvas(800, 800, WEBGL);
  setAttributes('antialias', true);
}

function drawPlane() {
  const globe = [];
  const total = 25;
  const r = 200;

  for (let i = 0; i < total + 1; i++) {
    globe[i] = [];
    const lat = map(i, 0, total, 0, PI);
    for (let j = 0; j < total + 1; j++) {
      const lon = map(j, 0, total, 0, TWO_PI);
      const x = r * sin(lat) * cos(lon);
      const y = r * sin(lat) * sin(lon);
      const z = r * cos(lat);

      globe[i][j] = createVector(
        x + (z * z * 2) / r,
        y,
        2 * z
      );
    }
  }

  texture(img);
  textureMode(NORMAL);
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < total; i++) {
    for (let j = 0; j < total + 1; j++) {
      const v1 = globe[i][j];
      const uv1 = getUV(v1.x, v1.y, v1.z, r);
      vertex(v1.x, v1.y, v1.z, uv1.u, uv1.v);
      const v2 = globe[i + 1][j];
      const uv2 = getUV(v2.x, v2.y, v2.z, r);
      vertex(v2.x, v2.y, v2.z, uv2.u, uv2.v);
    }
  }
  endShape();
}

function getUV(x, y, z, r) {
  let u = 0.5 + atan2(x, z) / (2 * PI),
    v = 0.5 - asin(y / r) / PI;

  const k = m[frameCount % 199];

  u = map(u * k, 1, 100, 0, 1);
  v = map(v * k, 1, 100, 0, 1);

  return { u, v };
}

function draw() {
  background(220);
  orbitControl();
  rotateX(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  drawPlane();
}