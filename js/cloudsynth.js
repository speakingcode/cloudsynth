//wrapper for AudioNode objects to better manage
//any-to-any routing
var BreakoutNode = {
  outputNodes : [],

  //add a node to output to
  connect     : function(outNode) {
    var i;

    //if already connected, ignore
    if (this.outputNodes.indexOf(outNode))
      return;

    this.outputNodes.push(outNode);

    this.node.disconnect();

    for(i = 0; i < this.outputNodes.length; i++) {
      this.node.connect(this.outputNodes[i]);
    }
  },

  //disconnect all outputs
  disconnect  : function() {
    this.outputNodes = [];
    this.node.disconnect();
  },

  disconnectNode  : function(outNode) {
    var i,
    position = this.outputNodes.indexOf(outNode);

    //ignore if outNode not connected
    if (!position)
      return;

    this.outputNodes.splice(position, 1);

    this.node.disconnect();
    for(i = 0; i < this.outputNodes.length; i++) {
      this.node.connect(this.outputNodes[i]);
    }
  }
};


var setupSliders = function() {
  $('.osc-frequency-slider').each(function(index, slider) {
    $(slider).slider({
      min         : 1.0,
      max         : 0.0,
      step        : 0.01,
      orientation : 'vertical',
      value       : 0.5,
      handle      : 'round'
    })
    .on('slide', function(event) {
      oscs[index].frequency.value = event.value * 2000;
    });
  });

  $('.filter-frequency-slider').each(function(index, slider) {
    $(slider).slider({
      min         : 1.0,
      max         : 0.0,
      step        : 0.01,
      orientation : 'vertical',
      value       : 0.5,
      handle      : 'round'
    })
    .on('slide', function(event) {
      audiofilters[index].frequency.value = event.value * 2000;
    });
  });


  $('.filter-lfo-amt-slider').each(function(index, slider) {
    $(slider).slider({
      min         : 1.0,
      max         : 0.0,
      step        : 0.01,
      orientation : 'vertical',
      value       : 0.5,
      handle      : 'round'
    })
    .on('slide', function(event) {
      audiofilters[index].frequency.value = event.value * 2000;
    });
  });

  $('.lfo-rate-slider').each(function(index, slider) {
    $(slider).slider({
      min         : 10,
      max         : 1,
      step        : 1,
      orientation : 'vertical',
      value       : 5,
      handle      : 'round'
    })
    .on('slide', function(event) {
      lfos[index].frequency.value = [
        16,
        8,
        6,
        4,
        3,
        2,
        1,
        0.5,
        0.25,
        0.0125
      ][event.value];
    });
  });
};
