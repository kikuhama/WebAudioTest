var oscillatorCount = 2;
var audioContext;

jQuery(function() {
    audioContext = CreateAudioContext();

    if(!audioContext) {
	alert("お使いのブラウザはWeb Audio APIに対応していません。");
    }

    var oscillators = [];
    var gain;

    var initOscillator = function(index) {
	var o = audioContext.createOscillator();
	o.connect(gain);
	o.frequency.value = $("#freq" + index).val();
	o.type = $("#type" + index).val();
	o.detune.value = 0;
	oscillators[index-1] = o;
    }

    if(audioContext) {
	gain = audioContext.createGain();
	gain.connect(audioContext.destination);
	for(var i=1; i<=oscillatorCount; ++i) {
	    initOscillator(i);
	    $("#stop" + i + "_btn").attr("disabled", "disabled");

	    $("#freq" + i).change(function() {
		var index = $(this).data("index") - 1;
		oscillators[index].frequency.value = $(this).val();
	    });
	    $("#type" + i).change(function() {
		var index = $(this).data("index") - 1;
		oscillators[index].type = $(this).val();
	    });
	    $("#start" + i + "_btn").click(function() {
		var index = $(this).data("index") - 1;
		var button_index = index + 1;
		try {
		    oscillators[index].start(0);
		    $(this).attr("disabled", "disabled");
		    $("#stop" + button_index + "_btn").removeAttr("disabled");
		}
		catch(ex) {
		    alert("Cannot start oscillator: " + ex);
		}
	    });
	    $("#stop" + i + "_btn").click(function() {
		var index = $(this).data("index") - 1;
		var button_index = index + 1
		try {
		    oscillators[index].stop(0);
		    oscillators[index].disconnect(0);
		    $(this).attr("disabled", "disabled");
		    $("#start" + button_index + "_btn").removeAttr("disabled");
		    initOscillator(button_index);
		}
		catch(ex) {
		    alert("Cannot stop oscillator: " + ex);
		}
	    });
	}
    }

});
