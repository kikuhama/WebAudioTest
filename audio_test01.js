var AUDIO_FILES = ["audio/p30-0049p.aac", "audio/p30-0050p.aac", "audio/p30-0051p.aac", "audio/p30-0052p.aac"];

jQuery(function() {
    var startWebAudioTest = function() {
	$("#start_button").unbind("click");
	showMessage("テスト開始");
	window.scrollTo(0, $("#message").offset().top);
	
	var audioContext = CreateAudioContext();
	
	if(audioContext) {
	    $("#web_audio_api").text("対応");
	    testOscillator(audioContext);
	}
	else {
	    $("#web_audio_api").text("非対応");
	    alert("お使いのブラウザは，Web Audio APIには対応していません。");
	}
    };

    var initOscillator = function(context) {
	var osc = context.createOscillator();
	if(osc) {
	    osc.frequency.value = 440;
	    osc.type = "sine";
	    osc.detune.value = 0;
	}
	return osc;
    };

    var testOscillator = function(context) {
	try {
	    showMessage("発信器テスト (2秒間)");
	    $("#osc_test").text("…");
	    var osc = initOscillator(context);
	    if(osc) {
		osc.connect(context.destination);
		osc.start(0);
		setTimeout(function() {
		    osc.stop(0);
		    osc.disconnect(0);
		    $("#osc_test").text("○");
		    testPlaySound(context);
		}, 2000);
	    }
	    else {
		$("#osc_test").text("×");
		throw new Error("Cannot create oscillator");
	    }

	}
	catch(ex) {
	    alert(ex);
	}
    };

    var testPlaySound = function(context) {
	var onLoaded = function(bufferList) {
	    console.log("音声ファイルロード完了");
	    showMessage("音声ファイルロード完了。「テスト再開」ボタンをタップしてください。");
	    $("#start_button").text("テスト再開");
	    $("#start_button").click(function() {
		$("#start_button").hide();
		play(bufferList, 0);
	    });
	};

	var play = function(bufferList, bufferIndex) {
	    if(bufferList.length <= bufferIndex || bufferIndex < 0) {
		$("#play_sound_test").text("○");
		finishTest();
	    }
	    else {
		var source = context.createBufferSource();
		source.buffer = bufferList[bufferIndex];
		source.connect(context.destination);
		source.onended = function() {
		    console.log(bufferIndex);
		    source.disconnect(0);
		    play(bufferList, bufferIndex+1);
		};
		source.start(0);
	    }
	};

	try {
	    $("#play_sound_test").text("…");
	    showMessage("音声ファイル再生テスト");
	    var bufferLoader = new BufferLoader(context,
						AUDIO_FILES,
						onLoaded);
	    bufferLoader.load();
	}
	catch(ex) {
	    alert(ex);
	    $("#play_sound_test").text("×");
	}
    };

    var finishTest = function() {
	showMessage("テスト終了。再度テストを実行するには，ページを再読込してください。");
	window.scrollTo(0, $("#test_result_panel").offset().top);
    };
    
    $("#start_button").click(startWebAudioTest);

});

function showMessage(text) {
    $("#message").text(text);
}
