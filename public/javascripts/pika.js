$(document).ready(function() {

setTimeout(function () { 
	$('#myTab a').click(function (e) {
		console.log("blaaha");

		$(this).tab('show');
		})
	}, 1000);
});