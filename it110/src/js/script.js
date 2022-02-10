$(document).ready(function(){
	
	var user={};
	var updateID;

function register(e)

	{
		user.idnumber = document.getElementById('idnumber').value;
		user.firstname = document.getElementById('firstname').value;
		user.lastname = document.getElementById('lastname').value;
		user.gender = document.getElementById('gender').value;
		user.bday = document.getElementById('bday').value;
		user.program = document.getElementById('program').value;
		user.yearlevel = document.getElementById('yearlevel').value;
		console.log(user);

		$.ajax
		({
			type:"POST",
			data:{action:"register", userdata:user},
			url:"src/php/user.php",
			success:function(response)
			{
				idresponse = jQuery.parseJSON(response);
				var table = $("#usertable tbody");

				if(idresponse==0)
				{
					alert("Error saving the user!");
				}
				else
				{
					user.id = idresponse;
					appendUser(user, table);
				}

				$("#userForm").find("input, select").val("");
			},
		});


		e.preventDefault();
	}

	   function getUsers()

	{
		$.ajax
		({
			type:"GET",
			data:{action:"getusers"},
			url:"src/php/user.php",
			success:function(response)
			{
				users = jQuery.parseJSON(response);
				var table = $("#usertable tbody");

				for(var i =0; i < users.length;i++)
				{
					appendUser(users[i], table);
				}	

			},
		});
	}

	   function appendUser(user, table)
	{
		row = "<tr>"+
			"<th scope=\"row\">"+ user.id +"</th>"+
		      "<td>"+ user.idnumber +"</td>"+
		      "<td>"+ user.firstname +"</td>"+
		      "<td>"+ user.lastname +"</td>"+
		      "<td>"+ user.gender +"</td>"+
		      "<td>"+ user.bday +"</td>"+
		      "<td>"+ user.program +"</td>"+
		      "<td>"+ user.yearlevel +"</td>"+
		      "<td>"+ "<i data-user_id = \""+user.id+"\"class=\"bi bi-pencil-square update-user\" data-toggle=\"modal\" data-target=\"updateModal\"></i>" + "</td>" +
			  "<td>"+ "<i data-user_id = \""+user.id+"\"class=\"bi bi-trash3-fill delete-user\" ></i>" + "</td>" +
			"</tr>";	
		table.append(row);	
	}

	  function deleteUser(user_id)
	{
			if
			(confirm("Are you sure you want to delete this user? You can't undo this process!!"))
		{

				$.ajax({
					type:"POST",
					data:{id:user_id, action:'delete-user'},
					url:"src/php/user.php",
					success:function(data){
						alert("USER DELETED SUCCESFULLY!");
						$(".clear").empty();
						getUsers();
					}
				})
		}
	}

			
	   function update_trigger(edit)

	{			
			 
			
			$("#ud_idnumber").val(edit.idnumber);
			$("#ud_firstname").val(edit.firstname);
			$("#ud_lastname").val(edit.lastname);
			$("#ud_gender").val(edit.gender);
			$("#ud_bday").val(edit.bday);
			$("#ud_program").val(edit.program);
			$("#ud_yearlevel").val(edit.yearlevel);
		
			$("#updateModal").modal("show");
	}
			

	  function saveUpdates()
	{
if(confirm("Are you sure you want to save the changes? You can not undo this process. Click 'OK' to proceed."))
{
				var updated_form = 
				{
					id: updateID,
					idnumber: $("#ud_idnumber").val(),
					firstname: $("#ud_firstname").val(),
					lastname: $("#ud_lastname").val(),
					gender: $("#ud_gender").val(),
					program: $("#ud_program").val(),
					bday: $("#ud_bday").val(),
					yearlevel: $("#ud_yearlevel").val(),				
				};
				
				
				$.ajax
				({
					type: "POST",
					data:{data:updated_form, id:updateID, action:"update-form"},
					url:"src/php/user.php",
					success:function(data){
						console.log(data);
						$("#updateModal").modal("hide");
						$(".clear").empty();
						getUsers();			
					}
				});
}
			else
				$("#updateModal").modal("hide");
	
	}

	


	$("#userForm").submit(register);
		getUsers();

	$("#usertable").on('click','.delete-user', function(e)
	{
		deleteUser(this.dataset.user_id); 
		
	});

 	$("#usertable").on('click','.update-user', function(e)
	{
		
		update_trigger(users.find(obj => obj.id === this.dataset.user_id));
	});


	$("#ud_savebtn").click(function(e)
	{
		saveUpdates();
	});

	$("#ud_closebtn").click(function(e)
	{
		$("#updateModal").modal("hide");
	});
	
});