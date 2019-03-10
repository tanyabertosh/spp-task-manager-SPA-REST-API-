var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input ){
var label	 = input.nextElementSibling,
labelVal = label.innerHTML;

input.addEventListener( 'change', function( e )
{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});

function fullfillTable(data){
  var table = document.getElementById("myTable");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  $('#myTable').append(
    `<tbody>${data.categories.map((n,i) => {
      var statusCell=``;
      switch(n.status){
        case "Done":
          statusCell=`<td class="background background__pass">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
          <a href="#">Done</a>
          </td>`;
          break;
        case "Not started":
          statusCell=`<td class="background background__fail">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
          <a href="#">Not started</a>
          </td>`;
          break;
        case "In progress":
          statusCell= `<td class="background background__running">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
          <a href="#">In progress</a>
          </td>`;
          break;
      }
      return `<tr>
      <td>${n.taskName}</td>
      <td>${n.deadline}</td>`+ statusCell +`<td><a href="#download" onclick="Download(this.text)">${n.fileName}</a></td>
      <td align="center">
        <input type="radio" name="radioBtn" id="${i}" class="radio" onclick="selectThis(this.id)"/>
      </td>
    </tr>`
    }
    ).join('')}
    </tbody>`
  );
}

var data = {};
function getDataFromServer(){
  var request = new XMLHttpRequest();
  request.open('GET',"http://localhost:3000/data");
  request.responseType='text';
  request.send();
  request.onreadystatechange=function(e){
    if(this.readyState==4){
      if (this.status==200){
        data = JSON.parse(this.responseText);
        fullfillTable(data);
      }
    }
  }
}

getDataFromServer();

const form = document.querySelector("form");
if(form){
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    var req = new XMLHttpRequest();
    if(document.getElementById('btnOK').innerHTML == 'Update'){
      req.open('PUT',"http://localhost:3000/tasks/update");
    }else{
      req.open('POST',"http://localhost:3000/tasks/create");
    }
    req.responseType='text';
    req.send(new FormData(form));
    req.onreadystatechange=function(e){
      if(req.readyState==4){
        if (req.status==200){
          data=JSON.parse(req.responseText);
          fullfillTable(data);
          dropdown();      
          
        }
      }
    }
  })
  var checkbox = document.getElementById("check");
  if(checkbox){
    checkbox.addEventListener('change', function() {
      if(this.checked) {
        var request = new XMLHttpRequest();
        request.open('DELETE',"http://localhost:3000/tasks/delete/"+form.task.value);
        request.responseType='text';
        request.send(new FormData(form));
        request.onreadystatechange=function(e){
          if(request.readyState==4){
            if (request.status==200){
              data=JSON.parse(request.responseText);
              fullfillTable(data);
              dropdown();      
            
            }
          }
        }
      }
    });
  }
}


function FilterTable() {
    // Declare variables 
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } 
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }


function toggleSidebar(x){
	document.getElementById("sidebar").classList.toggle('active');
	x.classList.toggle("change");
}

function dropdownHome(){
    document.body.style.backgroundImage = 'url(img/coffee-to-do-list-fon.jpg)';
    var x = document.getElementById("selection-block1");
    if (x.style.display !== "flex") {
        x.style.display = "flex";
        document.getElementById("table-section-block1").style.display="none";
        document.getElementById("TaskInfo1").style.display="none";
        document.getElementById('del_btn').style.visibility="hidden";
    } 
}

function dropdown()
{     
	document.body.style.backgroundImage = 'url(img/coffee-to-do-list-fon.jpg)';
    var x = document.getElementById("table-section-block1");
    if (x.style.display !== "flex") {
        x.style.display = "flex";
        document.getElementById("selection-block1").style.display="none";
        document.getElementById("TaskInfo1").style.display="none";
        document.getElementById('del_btn').style.visibility="hidden";
    } 
  
   
}
function dropdownTaskInfo(){
    var x = document.getElementById("TaskInfo1");
    document.taskInfo.reset(); 
    var datePicker=document.getElementById('datePicker');
    document.getElementById('btnOK').innerHTML = 'OK';
    
    datePicker.value=new Date().toJSON().slice(0,10);
    if (x.style.display !== "flex") {  
    	x.style.display = "flex";
        document.getElementById("table-section-block1").style.display="none";
        document.getElementById("selection-block1").style.display="none";
        document.getElementById('del_btn').style.visibility="hidden";
    }  
}

function selectThis(x) {
    x++;
    dropdownTaskInfo();
    document.getElementById('del_btn').style.visibility="visible";
    document.getElementById('btnOK').innerHTML = 'Update';
    var table = document.getElementById('myTable');
    document.getElementById('task').value=table.rows[x].cells[0].innerHTML;
    document.getElementById('datePicker').value=table.rows[x].cells[1].innerHTML;
    var textToFind=table.rows[x].getElementsByTagName('a')[0].text;
    
    var droplist = document.getElementById('status');
    for (var i = 0; i < droplist.options.length; i++) {
        if (droplist.options[i].text === textToFind) {
            droplist.selectedIndex = i;
            break;
        }
    }
  }

  function Download(NameofFile){

    var request = new XMLHttpRequest();
    request.open('GET',"http://localhost:3000/download/"+NameofFile);
    request.responseType="arraybuffer";
    request.send();
    request.onreadystatechange=function(e){
      if(this.readyState==4){
        if (this.status==200){
          var result=findMimeType(data,NameofFile);
          if (result!="error"){
            var fileData = this.response;
            createATagtoDownloadFile(fileData,result,NameofFile);
            
          }else{
            console.log("file not found");
          }

        }
      }
    }
  }

function createATagtoDownloadFile(fileData,fileMimeType,fileName){
  var blob = new Blob([fileData], { type: fileMimeType+';charset=utf-8' }),
  anchor = document.createElement('a');
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  anchor.download = fileName;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.dataset.downloadurl = [fileMimeType, anchor.download, anchor.href].join(':');
  anchor.click();
}

  function findMimeType(data,name){
    for (var i=0 ; i < data.categories.length ; i++)
    {
      if (data.categories[i].fileName == name) {
        return data.categories[i].fileType;
        break;
      }
     }
     return "error";
  }