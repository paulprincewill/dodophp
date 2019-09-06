function dd_dataFromLink() {
    // given a link 'http://localhost/dodo?name=paul&gender=male' ,
    // This code will get 'name=paul' and 'gender=male' in an object
    // First, we get the link without a '?'
    var link = window.location.search.slice(1);
    // Then we split each data by targetting '&'
    link = link.split('&');
    
    // Then we loop through each data and convert to object
    var allData = {};
    for (var i=0; i < link.length; i++) {
        var data = link[i].split('=');
        allData[data[0]] = data[1];
    }
    
    return allData;
}