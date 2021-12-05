import _ from 'canvas'
const { createCanvas } = _

function point(imageData, x, y, r, g, b, a) {
  imageData.data[(y * imageData.width + x) * 4 + 0] = r
  imageData.data[(y * imageData.width + x) * 4 + 1] = g
  imageData.data[(y * imageData.width + x) * 4 + 2] = b
  imageData.data[(y * imageData.width + x) * 4 + 3] = a
}

function getPixel(imageData, x, y) {
  return [
    imageData.data[(y * imageData.width + x) * 4 + 0],
    imageData.data[(y * imageData.width + x) * 4 + 1],
    imageData.data[(y * imageData.width + x) * 4 + 2],
    imageData.data[(y * imageData.width + x) * 4 + 3]
  ]
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

export function drawRed() {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      imageData.data[(y * imageData.width + x) * 4 + 0] = 0xFF
      imageData.data[(y * imageData.width + x) * 4 + 1] = 0x00
      imageData.data[(y * imageData.width + x) * 4 + 2] = 0x00
      imageData.data[(y * imageData.width + x) * 4 + 3] = 0xFF
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toBuffer('image/png')
}

export function drawLorenz() {
  const canvas = createCanvas(1000, 1000)
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      imageData.data[(y * imageData.width + x) * 4 + 0] = 0x00
      imageData.data[(y * imageData.width + x) * 4 + 1] = 0x00
      imageData.data[(y * imageData.width + x) * 4 + 2] = 0x00
      imageData.data[(y * imageData.width + x) * 4 + 3] = 0xFF
    }
  }

  const a =  1.07, b = 0.90
  let x = 0.1, y = 0.1
  for (let i = 0; i < 50000; i++) {
    const _x = (1 + a * b) * x - b * x * y
    const _y = (1 - b) * y + b * x * x

    imageData.data[(Math.floor(_y * 100 + imageData.height*0.25) * imageData.width + Math.floor(_x * 100 + imageData.width*0.5)) * 4 + 0] = 0x00
    imageData.data[(Math.floor(_y * 100 + imageData.height*0.25) * imageData.width + Math.floor(_x * 100 + imageData.width*0.5)) * 4 + 1] = 0xFF
    imageData.data[(Math.floor(_y * 100 + imageData.height*0.25) * imageData.width + Math.floor(_x * 100 + imageData.width*0.5)) * 4 + 2] = 0x00
    imageData.data[(Math.floor(_y * 100 + imageData.height*0.25) * imageData.width + Math.floor(_x * 100 + imageData.width*0.5)) * 4 + 3] = 0x3F

    x = _x
    y = _y
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toBuffer('image/png')
}

// https://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%A2%E3%82%A6%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%BB%E3%83%9F%E3%83%A9%E3%81%AE%E5%86%99%E5%83%8F
export function drawGumowskiMira(a = 0.009, s = 0.05, m = -0.801) {
  const canvas = createCanvas(1024, 1024)
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      // if ((x-imageData.width/2)**2 + (y-imageData.height/2)**2 < (imageData.width/2)**2)
        point(imageData, x, y, 0x00, 0x00, 0x00, 0xFF)
    }
  }

  for (let i = 0, x = 0.1, y = 0.1; i < 250000; i++) {
    const _x = y + a*y*(1-s*y*y) + m*x + ((2*(1-m)*x*x)/(1+x*x))
    const _y = -1*x + m*_x + ((2*(1-m)*_x*_x)/(1*_x*_x))
    point(
      imageData,
      Math.floor(_x * 34 + imageData.width*0.43),
      Math.floor(_y * 50 + imageData.height*0.5),
      0xFF,
      0xFF,
      0xFF,
      0xFF)
    x = _x
    y = _y
  }

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      if ((getPixel(imageData,x,y)[0] == 0xFF))
        point(imageData, x, y, ...HSVtoRGB(Math.floor(y/3)/360, 1, 1), 0xFF)
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  return canvas.toBuffer('image/png')
}