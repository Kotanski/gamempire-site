var cookie =  document.cookie.split(';')
api_server = "http://gamempire.net";
//api_server = "http://localhost:8080";
var token;
    //get token from cookie
    for (var i = 0;i<cookie.length; i++) {
        var name = cookie[i].split('=')[0].replace(' ','');
      if (name == "token"){
          token = cookie[i].split('=')[1];

      }
    };

window.onload =function(){
    
    
    //check token avaliable
    $.post( "/profile/load",
                {'token' :token

                }
        )
        .done(function(data) {
            //get user profile by user id
          $.get("/profile/"+data._id +"/info").done(function(d){
            if (d.avatar) {
              var avatar = 'http://gamempire.net/img/avatars/'+data._id+'.jpg?'+ new Date().getTime()+'';
              $("#avatar").attr("src",avatar);
            }
            window.firstname = d.firstname;
            window.lastname = d.lastname;
            window.dateofbirth = d.dateofbirth;
            window.email = d.email;
           
            $("#username").val(d.username.toLowerCase());
			      $("#username-display").html("<i class='fa fa-eye' title='Public'></i> Username: <b>"+d.username.toLowerCase()+"</b>");

            if (d.privacy.firstname == "false") {
              $("#fname").html("<i class='fa fa-eye' id='publicFName' onclick='toggleFName()' title='Public'></i> First Name: <b>"+d.firstname+"</b>");
              $("#fn").val(d.firstname);
              $("#fn").focusin();
            } else {
              $("#fname").html("<i class='fa fa-eye-slash' id='privateFName' onclick='toggleFName()' title='Private'></i> First Name: <b></b>");
            }

            if (d.privacy.lastname == "false") {
              $("#lname").html("<i class='fa fa-eye' id='publicLName' onclick='toggleLName()' title='Public'></i> Last Name: <b>"+d.lastname+"</b>");
              $("#ln").val(d.lastname);
              $("#ln").focusin();
            } else {
              $("#lname").html("<i class='fa fa-eye-slash' id='privateLName' onclick='toggleLName()' title='Private'></i> Last Name: <b></b>");
            }

            if (d.privacy.email == "false") {
              $("#email").html("<i class='fa fa-eye' id='publicEmail' onclick='toggleEmail()' title='Public'></i> Email: <b>"+d.email+"</b>");
              $("#email2").text(d.email);
              $("#email3").text("Current email: "+d.email);
            } else {
              $("#email").html("<i class='fa fa-eye-slash' id='privateEmail' onclick='toggleEmail()' title='Private'></i> Email: <b></b>");
            }
            
            if (d.privacy.dateofbirth == "false") {
              $("#birthday").html("<i class='fa fa-eye' id='publicBDay' onclick='toggleBDay()' title='Public'></i> Birthday: <b>"+d.dateofbirth+"</b>");
              $("#birth").val(d.dateofbirth);
              //$("#birth").focusin();
            } else {
              $("#birthday").html("<i class='fa fa-eye-slash' id='privateBDay' onclick='toggleBDay()' title='Private'></i> Birthday: <b></b>");
            }
			
      			$("#member").html('<button class="red darken-3 btn dropdown-toggle" type="button" id="dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-user"></i> '+d.username.toLowerCase()+'</button><div class="dropdown-menu dropdown-dark" aria-labelledby="dropdown" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut"><a class="dropdown-item" onclick="profile()">My Profile</a><hr style="margin-bottom: 0px; margin-top: 0px;"><a class="dropdown-item" onclick="edit()">Edit Profile</a><a class="dropdown-item" onclick="changepw()">Change Password</a><a class="dropdown-item" onclick="changeEmail()">Change Email</a><hr style="margin-bottom: 0px; margin-top: 0px;"><a class="dropdown-item" id="logout"  onclick="logout()">Log out</a></div>');
      			$("#member").css({"transform": "translate(0px, 0%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});
      			$("#card-prof").css("display", "block");
      			$('[data-toggle="tooltip"]').tooltip();
          });
        })
        .fail(function() {
			/*
		var count = 10; //10 seconds until redirects user to login page
		var countdown = setInterval(function(){
		$("#countdown").html(count);
		if (count == 0) {
		clearInterval(countdown);
		window.location.href = "/login/";
		}
		count--;
		}, 1000);
		*/
		$("#card-prof").css("display", "none");
		$("#loginpage").css("display", "block");
        //window.location.href = "/login/";
        });
        
        
        
        //update user profile with user id
        $( "#update" ).click(function(e){

  var fn = $('#fn').val();
  var ln = $('#ln').val();
  var dateofbirth = $('#birth').val();
  
  //Birthday Validation Rules need to be added. e.g. valid year range.
  if (fn==null || fn=="" || ln==null || ln=="")
      {
        $('#profilemsg').html('<center>First name and Last name fields cannot be empty</center>');
        $("#profilemsg").css("padding:30px;");
          $("#profilemsg").removeClass('bg-success').addClass('bg-warning');
          $("#profilemsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );;
      return false;
      }



        e.preventDefault();
        $.post( "/profile/load",
                {'token' :token

                }
        )
        .done(function(data) {
          $.ajax( {
                  url:"/profile/update",
                  type:"PUT",
                  data:{
                      "_id":data._id,
                      "firstname":$("#fn").val(),
                      "lastname":$("#ln").val(),
                      "birthday":$("#birth").val()
                    }
         }).done(function(res){
            window.firstname = fn;
            window.lastname = ln;
            window.dateofbirth = dateofbirth;

      $("#name").html("<i class='fa fa-eye-slash' data-toggle='tooltip' data-placement='top' title='Private'></i> Name: <b>"+fn+" "+ln+"</b>");
      $("#birthday").html("<i class='fa fa-eye-slash' data-toggle='tooltip' data-placement='top' title='Private'></i> Birthdate: <b>"+dateofbirth+"</b>");
      $('#profilemsg').html('<center>Profile successfully updated</center>');
      $("#profilemsg").css("padding:30px;");
      $("#profilemsg").removeClass('bg-warning').addClass('bg-success');
      $("#profilemsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
	    $('[data-toggle="tooltip"]').tooltip();

          //window.location.href='/profile/';
          }).fail(function(d){
            alert("Something Wrong!");
          });
        });

       });

        $("#update_email").click(function(e){

	
	var newemail = $('#newemail').val();
	if (newemail==null || newemail=="")
      {
			  $('#emailmsg').html('<center>Email field cannot be empty</center>');
			  $("#newemail").focus();
			  $("#emailmsg").css("padding:30px;");
		      $("#emailmsg").removeClass('bg-success').addClass('bg-warning');
		      $("#emailmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );;
      return false;
      }
	  
	  if( isValidEmailAddress( newemail ) ) {
        e.preventDefault();
          var email =$("#newemail").val();
          $.ajax( {
                  url:"/profile/updateEmail",
                  type:"PUT",
                  data:{    
                     "username" : $("#username").val(),
                     "email" : email
                   }
         }).done(function(res){
            $.post( "/profile/load",
                {'token' :token

                }
              )
              .done(function(data) {
                $.post( "/profile/resend",
                {_id :data._id,
                  email:email

                }
              ).done(function(res){
                $("#email").html("<i class='fa fa-eye-slash' data-toggle='tooltip' data-placement='top' title='Private'></i> Email: <b>" + newemail+"</b>");
                $("#email2").text(newemail);
                $("#email3").text("Current email: "+newemail);
                $('#emailmsg').html('<center>Email successfully updated</center>');
                $("#emailmsg").css("padding:30px;");
                $("#emailmsg").removeClass('bg-warning').addClass('bg-success');
                $("#emailmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
                $('#newemail').val('');
                $('#newemail').focusout();
                $('[data-toggle="tooltip"]').tooltip();
                //update email field
              });
              });
			  
			  
          }).fail(function(d){
			  $('#emailmsg').html('<center>Email already registered with another user</center>');
			  $("#emailmsg").css("padding:30px;");
		      $("#emailmsg").removeClass('bg-success').addClass('bg-warning');
		      $("#emailmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );		
          });
	  }else{
		  //email not valid format
		   $('#emailmsg').html('<center>Not a valid email address</center>');
		   $("#newemail").focus();
		   $("#emailmsg").css("padding:30px;");
		   $("#emailmsg").removeClass('bg-success').addClass('bg-warning');
		   $("#emailmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
	  }
       });
		
        $("#update_pw").click(function(e){
			var newpw = $('#newpw').val();
			var oldpw = $('#oldpw').val();
	if (oldpw==null || oldpw=="" || newpw==null || newpw=="")
      {
			  $('#passmsg').html('<center>Password field cannot be empty</center>');
			  $("#passmsg").css("padding:30px;");
		      $("#passmsg").removeClass('bg-success').addClass('bg-warning');
		      $("#passmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );;
      return false;
      }
	  if(isNewPasslen( newpw )) {
          e.preventDefault();
          
          $.ajax( {
                  url:"/profile/find",
                  type:"POST",
                  data:{    
                     "username" : $("#username").val(),
                     "password" : $("#oldpw").val()
                   }
         }).done(function(res){
            $.ajax( {
                  url:"/profile/updatePW",
                  type:"PUT",
                  data:{    
                     "username" : $("#username").val(),
                     "password" : $("#newpw").val()
                   }
                 }).done(function(res2){
                  //alert("update!");
                 // window.location.href='/profile/';
				 $('#passmsg').html('<center>Password successfully updated</center>');
				 $("#passmsg").css("padding:30px;");
				 $("#passmsg").removeClass('bg-warning').addClass('bg-success');
				 $("#passmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
				 $('#oldpw').val('');
				 $('#oldpw').focusout();
				 $('#newpw').val('');
				 $('#newpw').focusout();
				 $('[data-toggle="tooltip"]').tooltip();
			  
                 })			
          }).fail(function(d){
              $('#passmsg').html('<center>Current password is wrong</center>');
			  $("#passmsg").css("padding:30px;");
		      $("#passmsg").removeClass('bg-success').addClass('bg-warning');
		      $("#passmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );;
          });
		}else{
		  //password not valid 6 character length
		   $('#passmsg').html('<center>New password must be atleast 6 character long</center>');
		   $("#newpw").focus();
		   $("#passmsg").css("padding:30px;");
		   $("#passmsg").removeClass('bg-success').addClass('bg-warning');
		   $("#passmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
	  }
       });
    }

function toggleFName(){
  var privacyUpdate;
  if (event.target.id == 'privateFName') {
    privacyUpdate = false;
    $("#fname").html("<i class='fa fa-eye' id='publicFName' onclick='toggleFName()' data-toggle='tooltip' data-placement='top' title='Public'></i> First Name: <b>"+window.firstname+"</b>");
    $("#fn").val(window.firstname);
    //$("#fn").focusin();
  } else if (event.target.id == 'publicFName') {
    privacyUpdate = true;
    $("#fname").html("<i class='fa fa-eye-slash' id='privateFName' onclick='toggleFName()' data-toggle='tooltip' data-placement='top' title='Private'></i> First Name: <b></b>");
    $("#fn").val("");
  }

  $.post(api_server+"/login/load",
       {
           'token' :token
       }).done((d) => {
         $.ajax({
                 url:api_server+"/login/profile/toggleFirstName",
                 type:"PUT",
                 data:{
                     _id:d._id,
                     privacy:privacyUpdate
                 }
             }).done((res)=>{
                 console.log("firstname's privacy is updated");
             }).fail((err)=>{
                 console.log("failed");
             });
         });
}

function toggleLName(){
  var privacyUpdate;
  if (event.target.id == 'privateLName') {
    privacyUpdate = false;
    $("#lname").html("<i class='fa fa-eye' id='publicLName' onclick='toggleLName()' data-toggle='tooltip' data-placement='top' title='Public'></i> Last Name: <b>"+window.lastname+"</b>");
    $("#ln").val(window.lastname);
    //$("#ln").focusin();
  } else if (event.target.id == 'publicLName') {
    privacyUpdate = true;
    $("#lname").html("<i class='fa fa-eye-slash' id='privateLName' onclick='toggleLName()' data-toggle='tooltip' data-placement='top' title='Private'></i> Last Name: <b></b>");
    $("#ln").val("");
  }

  $.post(api_server+"/login/load",
       {
           'token' :token
       }).done((d) => {
         $.ajax({
                 url:api_server+"/login/profile/toggleLastName",
                 type:"PUT",
                 data:{
                     _id:d._id,
                     privacy:privacyUpdate
                 }
             }).done((res)=>{
                 console.log("lastname's privacy is updated");
             }).fail((err)=>{
                 console.log("failed");
             });
         });
}

function toggleEmail(){
  var privacyUpdate;
  if (event.target.id == 'privateEmail') {
    privacyUpdate = false;
    $("#email").html("<i class='fa fa-eye' id='publicEmail' onclick='toggleEmail()' data-toggle='tooltip' data-placement='top' title='Public'></i> Email: <b>"+window.email+"</b>");
    $("#email2").text(window.email);
    $("#email3").text("Current email: "+window.email);
  } else if (event.target.id == 'publicEmail') {
    privacyUpdate = true;
    $("#email").html("<i class='fa fa-eye-slash' id='privateEmail' onclick='toggleEmail()' data-toggle='tooltip' data-placement='top' title='Private'></i> Email: <b></b>");
    $("#email2").text("");
    $("#email3").text("");
  }

  $.post(api_server+"/login/load",
       {
           'token' :token
       }).done((d) => {
         $.ajax({
                 url:api_server+"/login/profile/toggleEmail",
                 type:"PUT",
                 data:{
                     _id:d._id,
                     privacy:privacyUpdate
                 }
             }).done((res)=>{
                 console.log("email's privacy is updated");
             }).fail((err)=>{
                 console.log("failed");
             });
         });
}

function toggleBDay(){
  var privacyUpdate;
  if (event.target.id == 'privateBDay') {
    privacyUpdate = false;
    $("#birthday").html("<i class='fa fa-eye' id='publicBDay' onclick='toggleBDay()' data-toggle='tooltip' data-placement='top' title='Public'></i> Birthday: <b>"+window.dateofbirth+"</b>");
    $("#birth").val(window.dateofbirth);
    //$("#birth").focusin();
  } else if (event.target.id == 'publicBDay') {
    privacyUpdate = true;
    $("#birthday").html("<i class='fa fa-eye-slash' id='privateBDay' onclick='toggleBDay()' data-toggle='tooltip' data-placement='top' title='Private'></i> Birthday: <b></b>");
    $("#birth").val("");
  }

  $.post(api_server+"/login/load",
       {
           'token' :token
       }).done((d) => {
         $.ajax({
                 url:api_server+"/login/profile/toggleBirthday",
                 type:"PUT",
                 data:{
                     _id:d._id,
                     privacy:privacyUpdate
                 }
             }).done((res)=>{
                 console.log("birthday's privacy is updated");
             }).fail((err)=>{
                 console.log("failed");
             });
         });
}

function edit(){
		  profile();
          $("#profile").hide();
          $("#updateprofile").show();
          $("#updateEmail").hide();
          $("#updatePW").hide();
}

function profile(){
          $("#profile").show();
		  
          $("#updateprofile").hide();  
      $('#profilemsg').html('');
      $("#profilemsg").removeClass('bg-warning');
      $("#profilemsg").removeClass('bg-success');
      $('#fn').val(firstname);
      $('#ln').val(lastname);
      $('#birth').val(dateofbirth);
      $('#fn').focusout();
      $('#ln').focusout();
      $('#birth').focusout();

          $("#updateEmail").hide();
		  $('#emailmsg').html('');
		  $("#emailmsg").removeClass('bg-warning');
		  $("#emailmsg").removeClass('bg-success');
		  $('#newemail').val('');
		  $('#newemail').focusout();
		  
          $("#updatePW").hide();
		  $('#passmsg').html('');
		  $("#passmsg").removeClass('bg-warning');
		  $("#passmsg").removeClass('bg-success');
		  $('#oldpw').val('');
		  $('#newpw').val('');
		  $('#oldpw').focusout();
		  $('#newpw').focusout();
}
function changeEmail(){
			profile();
          $("#profile").hide();
          $("#updateprofile").hide();
          $("#updateEmail").show();
          $("#updatePW").hide();
}

function changepw(){
	profile();
          $("#profile").hide();
          $("#updateprofile").hide();
          $("#updateEmail").hide();
          $("#updatePW").show();
}

function logout(){
		  document.cookie="token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		  //AWS
      window.location.href = "http://gamempire.net";
      //Heroku
      //window.location.href = "https://gamempire.herokuapp.com";
}
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function isNewPasslen(newpw) {
    var pattern = /^(?=.{6,})/i;
    return pattern.test(newpw);
};
//If 'enter / return' key pressed whithin 'newemail' text field will trigger confirm button click
$("#newemail").keypress(function (e) {
  if(e.keyCode=='13') //Keycode for "Return"
     $('#update_email').click();
  });
  
$("#newpw").keypress(function (e) {
  if(e.keyCode=='13') //Keycode for "Return"
     $('#update_pw').click();
  });

function loadImage() {
        var input, file, fr, img;

        if (typeof window.FileReader !== 'function') {
            write("The file API isn't supported on this browser yet.");
            return;
        }

        input = document.getElementById('newavatar');
        if (!input) {
            write("Um, couldn't find the imgfile element.");
        }
        else if (!input.files) {
            write("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            write("Please select a file before clicking 'Submit'");
        }
        else {
            file = input.files[0];
            fr = new FileReader();
            fr.onload = createImage;
            fr.readAsDataURL(file);
        }

        function createImage() {
            img = new Image();
            img.onload = imageLoaded;
            img.src = fr.result;
        }
        
        function imageLoaded() {
            var canvas = document.getElementById("canvas")
            canvas.width = 180;
            canvas.height = 180;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img,0,0,180,180);

            $.post("/profile/load",
            {
              'token' :token
            }).done((d)=> {
            $.ajax({
                    url:"/profile/updateAvatar",
                    type:"POST",
                    data:{
                        _id:d._id,
                        avatar:canvas.toDataURL('image/jpeg'),
                    }
                }).done((res)=>{
                    $("#avatar").hide();
                }).fail((err)=>{
                    console.log('Avatar update failed.');
                });
            });
        }

        function write(msg) {
            var p = document.createElement('p');
            p.innerHTML = msg;
            document.body.appendChild(p);
        }
    }