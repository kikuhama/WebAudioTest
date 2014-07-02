function CreateAudioContext() {
    var contextClass = (window.AudioContext ||
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.oAudioContext ||
			window.msAudioContext);
    var context = undefined;
    if(contextClass) {
	context = new contextClass();
    }
    return context;
}
