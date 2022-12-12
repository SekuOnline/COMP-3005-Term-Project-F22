var lastTitle = ''

document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'btn0' ) {
    addPlaylist(1)
  };
});
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'btn1' ) {
    addPlaylist(2)
  };
});
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'btn2' ) {
    addPlaylist(3)
  };
});
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'btn3' ) {
    addPlaylist(4)
  };
});
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.id == 'btn4' ) {
    addPlaylist(5)
  };
});

document.body.addEventListener( 'click', function ( event ) {
  if(event.target.id.startsWith('deleteBtn')) {
    let number = event.target.id.replace('deleteBtn', '')
    document.getElementById("playlist").deleteRow(number);
    reWriteIds()
  };
});

document.body.addEventListener( 'click', function ( event ) {
  if(event.target.id.startsWith('upBtn')) {
    let number = event.target.id.replace('#upBtn', '')
    let z = number.replace(/\D/g, "");
    console.log(z)
    string1 = "playlist" + z
    string2 = "playlist" + (z-1)
    let rowid = document.getElementById(string1)
    let rowid2 = document.getElementById(string2)
    console.log(rowid)
    console.log(rowid2)
    console.log("swapping " + rowid + " with " + rowid2)
    if(z > 1){
      $(rowid).replaceWith($(rowid2).after($(rowid).clone(true)));
    }
    rewriteID()
  };
});

document.body.addEventListener( 'click', function ( event ) {
  if(event.target.id.startsWith('downBtn')) {
    let number = event.target.id.replace('#downBtn', '')
    let z = number.replace(/\D/g, "");
    console.log(z)
    string1 = "playlist" + z
    string2 = "playlist" + (z+2)
    
    //here
    let rowid = document.getElementById(string1)
    let rowid2 = document.getElementById(string2)
    var tableRow = $(rowid);
    tableRow.insertAfter(tableRow.next());
    rewriteID()
  };
});

function rewriteID(){
  let table = document.getElementById("playlist")
  for(let i = 1; i < table.rows.length; i++) {
    table.rows[i].id = "playlist" + i
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[3]
      id.innerHTML = '<button id="deleteBtn' + i + '" title=""></button>'
    }
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[4]
      id.innerHTML = '<button id="upBtn' + i + '" title=""></button>'
    }
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[5]
      id.innerHTML = '<button id="downBtn' + i + '" title=""></button>'
    }
  }
}

function reWriteIds() {
  let table = document.getElementById("playlist")
  for(let i = 1; i < table.rows.length; i++) {
    id = table.rows[i].id
    
    newid = "playlist" + i
    document.getElementById(id).id = newid;
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[3]
      id.innerHTML = '<button id="deleteBtn' + i + '" title=""></button>'
    }
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[4]
      id.innerHTML = '<button id="upBtn' + i + '" title=""></button>'
    }
    for(let j = 0; j < table.rows[i].cells.length; j++) {
      id = table.rows[i].cells[5]
      id.innerHTML = '<button id="downBtn' + i + '" title=""></button>'
    }
  }
}

function addPlaylist(row) {

  let songTitle = lastTitle
  if(songTitle === '') {
      return alert('Please enter a Song Title')
  }

  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText)         
       for(let i = 0 ; i < response.results.length ; i++) {
          //Get the image loaded 
          if((i) == row-1) {
          imgLink = response.results[i].artworkUrl100;
          img = '<img src="' + imgLink + '" alt="Album Artwork" width="30" height="30">'
          var x = document.getElementById("playlist").rows.length;
          document.getElementById("playlist").innerHTML += "</td>" + "<tr id='playlist" + x + "' title="+response.results[i].trackId+"><td style='background-color: #fbfbfb;' title="+imgLink+">" + img + "</td>" + "<td style='background-color: #fbfbfb;'>" + response.results[i].trackName + '</td>' + "<td style='background-color: #fbfbfb;'>" + response.results[i].artistName + "<td style='background-color: #fbfbfb;'>" + '<button id="deleteBtn' + x + '" title="🗑️"></button>' + "</td>" + "<td style='background-color: #fbfbfb;'>" + '<button id="upBtn' + x + '"" title="⬆️"></button>' + "</td>" + "<td style='background-color: #fbfbfb;'>" + '<button id="downBtn' + x + '" title="⬇️"></button>' + "</td>"      }
    }
  }
}
  xhr.open('GET', `/songs?title=${songTitle}`, true)
  xhr.send()
}

function getSong() {

    let songTitle = document.getElementById('songTitleTextField').value.trim()
    if(songTitle === '') {
        return alert('Please enter a Song Title')
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)

            document.getElementById("tboody").innerHTML = '<tr><th style="width: 75px;">Results</th><th style="width: 40%;"></th><th style="width: 25%;">Artist</th><th style="width: 25%;"></th></tr>'
            
         for(let i = 0 ; i < response.results.length ; i++) {
            //Get the image loaded 
            imgLink = response.results[i].artworkUrl100;
            img = '<img src="' + imgLink + '" alt="Album Artwork" width="65" height="65">'
            document.getElementById("tboody").innerHTML += "</td>" + "<td>" + img + "</td>" + "<td>" + response.results[i].trackName + "</td>" + "<td>" + response.results[i].artistName + "<td>" + '<button id="btn' + i + '"></button>' + "</td>"
            document.getElementById("searchSuggest").innerHTML = ""
      }
    }
  }
    xhr.open('GET', `/songs?title=${songTitle}`, true)
    xhr.send()
    lastTitle = songTitle
}

function savePlaylist(){
  let table = document.getElementById("playlist")
  let playlistObj = {}
  let title = document.getElementById("playlistTitle").innerHTML
  playlistObj.title = title;
  if(table.rows.length > 0){

    // for(let i = 1; i <= table.rows.length; i++) {
    //     let hiddenTID = document.getElementById("playlist"+1+"TID").value;
    //     console.log(hiddenTID)
    //     playlistObj.i = hiddenTID;
    // }

    let xhr = new XMLHttpRequest()
    for(let i = 1; i < table.rows.length; i++) {
      let hiddenTID = table.rows[i].title;
      let img = (table.rows[i].cells[0].title)    
      let track = (table.rows[i].cells[1].innerHTML);
      let artist = (table.rows[i].cells[2].innerHTML)
      
      
      
      playlistObj[i] = {"TID":hiddenTID, "index":i, "image":img, "artist":artist, "track":track};
      console.log(hiddenTID)
      console.log(playlistObj[i]);
 
    }
    console.log(JSON.stringify(playlistObj));
  xhr.open('POST', `/savePlaylist`, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(playlistObj))
      
  }
  else{
    alert("There is no playlist to save.")
  }
}

//Attach Enter-key Handler
const ENTER=13

function handleKeyUp(event) {
event.preventDefault()
   if (event.keyCode === ENTER) {
      document.getElementById("submit_button").click()
  }
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit_button').addEventListener('click', getSong)
  document.getElementById('save_button').addEventListener('click', savePlaylist)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keyup', handleKeyUp)
  
})
