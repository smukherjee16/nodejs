var setURL = "http://localhost:3000/api/employees";
refreshtable();
function refreshtable()
{
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();

	// Open a new connection, using the GET request on the URL endpoint
	request.open('GET', setURL, true);

	request.onload = function () {
		// Begin accessing JSON data here
	  var data = JSON.parse(this.response);

	  if (request.status >= 200 && request.status < 400) {
		$("table#emp-list tbody").html('');
		data.forEach(single => {
			$("table#emp-list tbody").append('<tr class="item-'+single.id+'"><td>'+single.id+'</td><td>'+single.firstName+'</td><td>'+single.lastName+'</td><td>'+single.role+'</td><td>'+single.hireDate+'</td><td>'+single.favoriteMessage1+'</td><td>'+single.favoriteMessage2+'</td></tr>');
		  console.log(single.firstName);
		});

	  } else {
		console.log('error');
	  }

	};

	// Send request
	request.send();
}

function addeditEmployee()
{
	  var id = $('#employeeId').val();
	  var favoriteMessage1 = $('#favoriteMessage1').val();
	  var favoriteMessage2 = $('#favoriteMessage2').val();
	  var firstName = $('#firstName').val();
	  var hireDate = $('#hireDate').val();
	  var lastName = $('#lastName').val();
	  var role = $('#role').val();
	  var setURLEdit = setURL;
	   var params = JSON.stringify({ "firstName": firstName,"lastName":lastName,"hireDate":hireDate,"role":role})
	var request = new XMLHttpRequest();
	request.open("POST", setURL, true);
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.onload = function () {
		var data = JSON.parse(this.response);

		  if (request.status >= 200 && request.status < 400) {


			  $("table#emp-list tbody").append('<tr class="item-'+data.id+'"><td>'+data.id+'</td><td>'+data.firstName+'</td><td>'+data.lastName+'</td><td>'+data.role+'</td><td>'+data.hireDate+'</td><td>'+data.favoriteMessage1+'</td><td>'+data.favoriteMessage2+'</td></tr>');
		 } else {
			console.log('error');
	  	}
		$('#close').click();
	};

	// Send request
	request.send(params);
 	return false;
} 

function clearData()
{
	$('#addEmployeeModal input:not(.btn)').val('');
	$('#addEmployeeModal select').val('');
}

function addnew(){
	clearData();
	$('#addEmployeeModal').modal('show');
} 

$('#hireDate').datepicker({
	dateFormat: 'dd-mm-yy',
	autoclose: true,
	todayHighlight: true,
});