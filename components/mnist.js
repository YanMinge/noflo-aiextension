const noflo = require('noflo');
const tf = require('@tensorflow/tfjs');
const model = require('./model');

const optimizer = 'rmsprop';
async function run(canvas) {
const model = await tf.loadLayersModel('https://raw.githubusercontent.com/YanMinge/mnist_test_res/main/model.json');
  model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
  });
  var input = [];
  let img = new Image();
  img.src = "https://raw.githubusercontent.com/YanMinge/mnist_test_res/main/3_image.png";
  img.setAttribute('crossorigin', 'anonymous');
  console.log("load Image!")
  img.onload = () => {
    let w = img.width;
    let h = img.height;
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    imgdata = ctx.getImageData(0, 0, 28, 28).data;
    console.log("imgdata length:" + imgdata.length)
    for(var i = 0; i < imgdata.length; i += 4) {
      input.push(Math.round(imgdata[i] / 10));
    }
    for (let j = 0; j < 28 ; j++){ 
      var log = "raw_data:";
      for (let i = 0; i < 28; i++){
        log += "" + (input[j*28+i])
      }
      log += "\n"
      console.log(log)
    }
  }
  tf.tidy(() => {
    console.log("predict")
    const output = model.predict([tf.tensor(input).reshape([1, 28, 28, 1])])
    const axis = 1;
    const predictions = Array.from(output.argMax(axis).dataSync());
    console.log(`\nEvaluation result:\n` + predictions);
  });
  // reader.readAsDataURL(img);
  // getPixels("https://raw.githubusercontent.com/YanMinge/mnist_test_res/main/3_image.png", function(err, pixels) {
  //   if(err) {
  //     console.log("Bad image path")
  //     return
  //   }
  //   for (let i = 0; i < 28; i++) { 
  //     var log = [];
  //     for (let j = 0; j < 28; j++){
  //       let x = 0
  //       if((pixels.get(i, j, 0)/5) > 1){
  //         x = 1;
  //       }else{
  //           x = 0;
  //       }
  //       input.push(x);
  //     }
  //   }
  //   for (let j = 0; j < 28 ; j++){ 
  //     var log = "";
  //     for (let i = 0; i < 28; i++){
  //       log += "" + (input[j*28+i])
  //     }
  //     log += "\n"
  //     console.log(log)
  //   }
}

// Define component interface
// This is a pretty simplistic example. Read more at
//   https://noflojs.org/documentation/components/
exports.getComponent = () => {
  const c = new noflo.Component();

  // Define a meaningful icon for component from http://fontawesome.io/icons/
  c.icon = 'cubes';

  // Provide a description on component usage
  c.description = 'do mnist data process';

  // Add input ports
  c.inPorts.add('in', {
    datatype: 'string',
  });
  c.inPorts.add('canvas', {
    datatype: 'object',
  });
  // Add output ports
  c.outPorts.add('out', {
    datatype: 'string',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });

  // Provide a processing function
  c.process((input, output) => {
    // Check input preconditions
    if (!input.hasData('canvas')) {
      return;
    }
    // Receive input data
    var canvas = input.getData('canvas');
    console.log("hello Yanminge!")
    // Do something, then ...
    run(canvas);
    // Send the output
    output.send({
      out: canvas,
    });
    // Finish processing
    output.done();
  });
  // Return the component instance
  return c;
};
