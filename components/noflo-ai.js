const noflo = require('noflo');

// Define component interface
// This is a pretty simplistic example. Read more at
//   https://noflojs.org/documentation/components/
exports.getComponent = () => {
  const c = new noflo.Component();

  // Define a meaningful icon for component from http://fontawesome.io/icons/
  c.icon = 'cog';

  // Provide a description on component usage
  c.description = 'just for test canvas';

  // Add input ports
  c.inPorts.add('canvas', {
    datatype: 'object',
    control: true
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
    var context = canvas.getContext("2d");
    context.strokeStyle = "#FFF";
    context.lineWidth = 10;
    context.strokeRect(10, 10, 100, 100);
    context.fillStyle = "rgba(6,191,247,0.3)";
    context.fillRect(70, 70, 100, 100);
    output.send({
      out: canvas,
    });
    // Finish processing
    output.done();
  });

  // Return the component instance
  return c;
};
