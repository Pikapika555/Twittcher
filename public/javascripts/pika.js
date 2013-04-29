///////////////
//Global Vars//
///////////////

var gUSERNAME = "Anonymous";
var gACT_PROFIL = 0;

$(document).ready(function() {

	BootAnim();
});

function BootAnim(){
		$('#myTab a').click(function (e) {
			console.log("blaaha");

			$(this).tab('show');
			})
}


//////////////
//Ajax Calls//
//////////////

////POST
//Login
function ajxLog(){
	var user = document.getElementById("logName").value;
	var pass = document.getElementById("logPass").value;
	$.ajax({
		type: "POST",
		data: {username: user, password: pass},
		
		success: function(data){ ajxLogHelp(data);}
	});
}


////GET
//GetProfil
function ajxWall(){
	$.get("asd",{
		//data: {profil: gACT_PROFIL},
		
		
		success: function(data){ajxWallHelper(data);}
	});
}
//GetWall




///////////////
//Ajax Helper//
///////////////

////POST
//LoginHelper
function ajxLogHelp(data){
	if(data[0]){
		gUSERNAME = data[1];
		console.log("logged In")
		document.location = "/profil/username";
	 }
	else{
		console.log("wrong Pw");
	}
}


////GET
//ProfilHelper
function ajxWallHelper(data){
	document.location.hash = "Wall";
	
}

///////////////
//Ajax Getter//
///////////////

function ajxGetter(){
	base = "http://127.0.0.1:3000";
	switch(window.location){
		case base+"/"
	}
}

function ajxLogGet(){
	
}



function CreatePost(data){
	var newPost = document.createElement("div");
		newPost.className = "wPost";
		newPost.innerHTML = data;
	var upperDiv = document.getElementById("");
}