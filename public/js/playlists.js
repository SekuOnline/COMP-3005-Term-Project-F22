document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit_new_playlist').addEventListener('click', createPlaylist);
    document.body.addEventListener( 'click', function ( event ) {
      if(event.target.id.startsWith('deleteBtn')) {
        pname = event.target.id.substring(9)
        console.log("Deleting: "+pname)
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `/rmvPlaylist?pname=${pname}`, true)
        xhr.send()
        
        
      };
    });

  })

function createPlaylist(){
    pname = document.getElementById("pname_text").value;
    while(pname.search(/\s/) != -1){
        pname = pname.replace(/\s/, "_")
    }
    plistCount = document.getElementById("plistCount").value;
    errorCheck = document.getElementById('errorCheck');
    if (pname.trim() == ''){
      errorCheck.innerHTML = '<p>Cannot create playlist with no name.</p>'
    }
    else if (plistCount >=3){
        errorCheck.innerHTML = '<p>Too many playlists, please remove one before creating more.</p>';
    }
    else{
        
      //Send a request to the server to create a new playlist within the DB.
      let xhr = new XMLHttpRequest()
      xhr.open('GET', `/playlists?pname=${pname}`, true)
      xhr.send()
    }
  }
