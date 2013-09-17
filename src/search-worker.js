var query = null;
var alreadyReturned = null;
var searchables = [];

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
    default:
      throw 'Unknown message type ' + type;
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
}

var doIndex = function(value) {
  searchables.push(value);
  doSearch();
  //TODO add some indexing here
}
