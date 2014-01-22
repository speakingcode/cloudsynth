setupSliders = function() {
        $('.osc-frequency-slider').each(function(index, slider) {
            $(slider).slider({
              min         : 0.0,
              max         : 1.0,
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
              min         : 0.0,
              max         : 1.0,
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
              min         : 1,
              max         : 10,
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
