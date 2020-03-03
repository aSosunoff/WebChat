/*version 2.1*/
; (function (win) {
	var mainBlock = $('<div>')
		    .attr('id', 'alertContent')
		    .css({
			    'position': 'fixed',
			    'top': '25px',
			    'right': '25px',
			    'width': '400px',
			    'z-index': '1100'
		    }),
		messageAlertName = "message-alert";

	$('body').append(mainBlock);

	function show(text, alertType, delay, callback) {
		if (typeof delay == 'function') {
			callback = delay;
			delay = 2000;
		} else {
			delay = delay || 2000;
			callback = typeof callback == "function" ? callback : function () { };
		}

		var countElement = $("[id^='" + messageAlertName + "']").length;

		var unicNameClass = messageAlertName + countElement;

		mainBlock.append("<div id='" + unicNameClass + "' class='alert " + alertType + "' style='display: none'>" + text + "</dib>");

		var alert = $("#" + unicNameClass);

		alert.fadeIn(
			() => setTimeout(() => alert.fadeOut(400, () => {
      	alert.remove(); 
        callback();
       }), delay)
		);
	};

	var _library = function () {
		return {
			info: (text, delay, callback) => { show(text, 'alert-info', delay, callback); },
			danger: (text, delay, callback) => { show(text, 'alert-danger', delay, callback); },
			success: (text, delay, callback) => { show(text, 'alert-success', delay, callback); },
			warning: (text, delay, callback) => { show(text, 'alert-warning', delay, callback); }
		}
	};

	win.Message = new _library();
})(this);