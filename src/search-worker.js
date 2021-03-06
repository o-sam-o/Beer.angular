var query = null;
var alreadyReturned = null;
var indexDone = false;
// Ideally we woudn't have to do this and we could access the localstorage directly ...
var searchables = [];
var searchablesIds = [];

onmessage = function(oEvent) {
  var data = oEvent.data;

  switch(data.type) {
    case 'search':
      query = data.query;
      alreadyReturned = [];
      doSearch();
      break;
    case 'index': 
      doIndex(data.value)
      break;
    case 'indexDone':
      indexDone = true;
      doSearch();
      break;
    default:
      throw 'Unknown message type ' + data.type;
  }
}

var doSearch = function() {
  if(!query) {
    return;
  }
  searchables.forEach(function(searchable) {
    //TODO make search field configurable
    if(alreadyReturned.indexOf(searchable) === -1 && searchable.title.toLowerCase().indexOf(query.term.toLowerCase()) !== -1) {
      postMessage(searchable);
      alreadyReturned.push(searchable);
    }
  });
  if (indexDone) {
      postMessage('searchFinished');
  }
}

var doIndex = function(value) {
  if (searchablesIds.indexOf(value.id) === -1) {
    searchables.push(value);
    searchablesIds.push(value.id);
    doSearch();
  } else {
      //FIXME we shouldn't get here ...
  }
  //TODO add some indexing here
}
