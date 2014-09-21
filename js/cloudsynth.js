//wrapper for AudioNode objects to better manage
//any-to-any routing
var BreakoutNode = function(node) {
  this.outputNodes = [];

  this.node = node;

  //add a node to output to
  this.connect = function(outNode) {
    var i;

    //if already connected, ignore
    if (this.outputNodes.indexOf(outNode) > -1) {
      console.log("node already connected!" + outNode);
      return;
    }

    this.outputNodes.push(outNode);

    this.node.disconnect();

    for(i = 0; i < this.outputNodes.length; i++) {
      this.node.connect(this.outputNodes[i]);
    }
  };

  //disconnect all outputs
  this.disconnect  = function() {
    this.outputNodes = [];
    this.node.disconnect();
  };

  this.disconnectNode = function(outNode) {
    var i,
    position = this.outputNodes.indexOf(outNode);

    //ignore if outNode not connected
    if (!position) {
      console.log('node was not connected!' + node);
      return;
    }

    this.outputNodes.splice(position, 1);

    this.node.disconnect();
    for(i = 0; i < this.outputNodes.length; i++) {
      this.node.connect(this.outputNodes[i]);
    }
  };
};

var setupSliders = function() {
};

var bindGain = function(gain, el) {
  el.slider({
        min         : 1.0,
        max         : 0.0,
        step        : 0.01,
        orientation : 'vertical',
        value       : 0.5,
        handle      : 'round'
  })
  .on('slide', function(event) {
    gain.gain.value = event.value * 1;
  });

};


var bindOscillatorFrequency = function(osc, el) {
  el.slider({
        min         : 1.0,
        max         : 0.0,
        step        : 0.01,
        orientation : 'vertical',
        value       : 0.5,
        handle      : 'round'
  })
  .on('slide', function(event) {
    osc.frequency.value = event.value * 1000;
  });
};

var bindFilterCutoffFrequency = function(filter, el) {
  el.slider({
     min         : 1.0,
     max         : 0.0,
     step        : 0.01,
     orientation : 'vertical',
     value       : 0.5,
     handle      : 'round'
  })
  .on('slide', function(event) {
    filter.frequency.value = event.value * 1000;
  });
};

var bindLFORate = function(lfo, el) {
  el.slider({
      min : 0,
      max : 9,
      step : 1,
      orientation: 'vertical',
      value : 2,
      handle : 'round'
  })
  .on('slide', function(event) {
    lfo.frequency.value = [
      16,
      8,
      6,
      4,
      3,
      2,
      1,
      0.5,
      0.25,
      0.125
    ][event.value];
  });
};

var bindLFOAmount = function(amount, el) {
  el.slider({
        min         : 1.0,
        max         : 0.0,
        step        : 0.01,
        orientation : 'vertical',
        value       : 0.5,
        handle      : 'round'
  })
  .on('slide', function(event) {
    amount.gain.value = event.value * 300;
  });

};


var setup = function() {
  console.log("setup() called!");
  var icontext,
      init;


  init = function() {
    try {
      //window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context             = new AudioContext();

      setupDevices(context);
    }
    catch(e) {
      console.log('fuck it' + e);
      return;
    }

  };

  window.addEventListener('load', init, false);
};

var setupDevices = function(context) {
  console.log("setupDevices() called!");
  var osc1    = setupOsc($('#osc1-frequency-slider'), $('#osc1-gain-slider')),
      osc2    = setupOsc($('#osc2-frequency-slider'), $('#osc2-gain-slider')),
      filter1 = setupFilter($('#filter1-frequency-slider'),$('#filter1-lfo1-amt-slider'), $('#filter1-lfo2-amt-slider')),
      filter2 = setupFilter($('#filter2-frequency-slider'),$('#filter2-lfo1-amt-slider'), $('#filter2-lfo2-amt-slider'))
      lfo1    = setupLFO($('#lfo1-rate-slider'));
      lfo2    = setupLFO($('#lfo2-rate-slider'));

  osc1.osc.connect(osc1.gain.node);
  osc1.gain.connect(filter1.filter.node);
  
  lfo1.lfo.connect(filter1.lfo1Amount.node);
  lfo2.lfo.connect(filter1.lfo2Amount.node);
  
  filter1.lfo1Amount.connect(filter1.filter.node.frequency);
  filter1.lfo2Amount.connect(filter1.filter.node.frequency);
  filter1.filter.connect(context.destination);


  osc2.osc.connect(osc2.gain.node);
  osc2.gain.connect(filter2.filter.node);
  
  lfo1.lfo.connect(filter2.lfo1Amount.node);
  lfo2.lfo.connect(filter2.lfo2Amount.node);
  
  filter2.lfo1Amount.connect(filter2.filter.node.frequency);
  filter2.lfo2Amount.connect(filter2.filter.node.frequency);
  filter2.filter.connect(context.destination);

};

var setupOsc = function(freqEl, gainEl) {
  var osc1 = {
    osc : new BreakoutNode(context.createOscillator()),
    gain: new BreakoutNode(context.createGainNode()),
  };
  osc1.osc.node.type = osc1.osc.node.SAWTOOTH;
  osc1.osc.node.frequency.value = 100;
  osc1.osc.node.start(0);

  bindOscillatorFrequency(osc1.osc.node, freqEl);
  bindGain(osc1.gain.node, gainEl);

  return osc1;
};

var setupFilter = function(freqEl, lfo1El, lfo2El) {
  var filter1 = {
    filter : new BreakoutNode(context.createBiquadFilter()),
    lfo1Amount : new BreakoutNode(context.createGainNode()),
    lfo2Amount  : new BreakoutNode(context.createGainNode())
  };

  bindFilterCutoffFrequency(filter1.filter.node, freqEl);

  bindLFOAmount(filter1.lfo1Amount.node, lfo1El);
  bindLFOAmount(filter1.lfo2Amount.node, lfo2El);
  filter1.filter.node.frequency.value = 500;
  filter1.filter.node.type = filter1.filter.node.LOWPASS;
  filter1.lfo1Amount.node.gain.value = 5;
  filter1.lfo2Amount.node.gain.value = 5;

  return filter1;
};

var setupLFO = function(el) {
  var lfo1 = {
    lfo : new BreakoutNode(context.createOscillator())
  };

  bindLFORate(lfo1.lfo.node, el);

  lfo1.lfo.node.type = lfo1.lfo.node.SINE;
  lfo1.lfo.node.frequency.value = 8;
  lfo1.lfo.node.start();
  
  return lfo1;
};
