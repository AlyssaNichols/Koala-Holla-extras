console.log( 'js' );

$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
 $( '#viewKoalas' ).on( "click", ".deleteButton", deleteSwal);

  $( '#viewKoalas' ).on( "click", ".readyButton", updateKoala);

  $( '#addButton' ).on( 'click', function(){
    koala.name = $("#nameIn").val();
    koala.gender = $("#genderIn").val();
    koala.age = $("#ageIn").val();
    koala.ready = $("#readyForTransferIn").val();
    koala.notes = $("#notesIn").val();

    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: koala.name,
      age: koala.age,
      gender: koala.gender,
      ready: koala.ready,
      notes: koala.notes,
    };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  }); 
}

//ajax GET
function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    method: "GET",
    url: "/koalas",
  })
    .then((response) => appendDom(response)) 
    .catch((err) => console.log(err));
}; // end getKoalas

//ajax POST
function saveKoala( newKoala ){
  console.log( 'in saveKoala', newKoala );

  // ajax call to server to post koalas
 $.ajax({
  method: "POST",
  url: "/koalas",
  data: newKoala,
 }).then(() => getKoalas())
 .catch((err) => console.log(err));
};
  // ajax call to server to get koalas
 



function appendDom(koalas){
  $("#viewKoalas").empty();

  for (let i = 0; i < koalas.length; i += 1) {
    let koala = koalas[i];
    // For each book, append a new row to our table
    $("#viewKoalas").append(`
      <tr>
        <td>${koala.name}</td>
        <td>${koala.gender}</td>
        <td>${koala.age}</td>
        <td>${koala.ready}</td>
        <td>${koala.notes}</td>
        <td><button class="readyButton" data-id=${koala.id}  data-ready=${koala.ready} >${koala.ready ? "Not Ready": "Ready"}</button></td>
        <td><button class="deleteButton" data-id=${koala.id} >Delete</button></td>
      </tr>
    `);
  }
};


// ajax PUT
function updateKoala(event){
  const id = $(event.target).data("id");
  const isReady = $(event.target).data("ready");
  console.log(id, isReady);

  $.ajax({
    method: "PUT",
    url: `/koalas/${id}`,
    data: {isReady: !isReady},
  })
  .then(() => getKoalas())
  .catch((err) => {console.log("Error with PUT ajax", err)
})
}
function deleteSwal(event) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this koala!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((confirm) => {
    console.log(confirm)
    if (confirm) {
      deleteKoala(event);
      console.log("koala-holla please delete!");
      swal("The koala has been removed", {
        icon: "success",
      });
    } else {
      swal("Your koala is safe!");
    }
  });
  
}

const deleteKoala = (event) => {
  const id = $(event.target).data("id");
  $.ajax({
    method: "DELETE",
    url: `/koalas/${id}`,
  }).then(() => getKoalas()).catch((err) => console.log(err));
}; // end of deleteKoala

