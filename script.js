var companyListSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name Where { ?x rdf:type dbo:MusicalArtist. ?x foaf:name ?name. }";
var progress=10;
//Preparing SPARQL query against DBPedia
var companyNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(companyListSPARQL) + "&format=json";
var progress=20;

$.ajax({
    url: companyNameQuery,
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(data) {
       var singerArr = [];
        for (var i = 0; i < data.results.bindings.length; i++) {
            singerArr.push(data.results.bindings[i].name.value);
            
        }
        var progress=30;
        $('#singers').autocomplete({
            source: singerArr,
            delay: 30
        });
    },
    error: function(e) {
        alert(e);
    }
});

