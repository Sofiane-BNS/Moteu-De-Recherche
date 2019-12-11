$( document ).ready(function() {
    function loadAllSingers(){
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
    }

    loadAllSingers();
      $('#tableResult2').hide();
   

    


});








    $( "#research" ).click(function(e) {
	
      event.preventDefault();  
      researchSinger($( "#singers" ).val() );
      var res = $( "#singers" ).val() ;
      res = res.replace(" ", "_");
      console.log(res);
	  researchAlbum(res);
    });

    function researchSinger(singerName) {
         var singerSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name, ?birthName,?birthDate,?deathDate,str(?birthPlace),?spouse,?picture Where { ?x rdf:type dbo:MusicalArtist. ?x foaf:name ?name. filter contains(?name,\""+ singerName +"\"). optional{?x dbo:birthName ?birthName } optional{?x dbo:birthDate ?birthDate FILTER ( ?birthDate >= \"19000101\"^^xsd:date && ?birthDate <= \"20991231\"^^xsd:date ) } optional{?x dbo:deathDate ?deathDate  FILTER ( ?deathDate >= \"19000101\"^^xsd:date && ?deathDate <= \"20991231\"^^xsd:date )} optional{?x dbo:birthPlace ?birthPlace } optional{?x dbo:spouse ?spouse} optional{?x dbo:thumbnail ?picture} }";
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerSPARQL) + "&format=json";
         
         $.ajax({
             url: singerNameQuery,
             dataType: 'jsonp',
             jsonp: 'callback',
             success: function(data) {
                $('#tableResult tbody').empty();


                if(data.results.bindings[0].name != null){
                    $('#tableResult').append('<tr><td>Nom </td><td>'+ data.results.bindings[0].name.value +'</td></tr>');
                }

                if(data.results.bindings[0].birthName != null){
                    $('#tableResult').append('<tr><td>Nom de naissance </td><td>'+ data.results.bindings[0].birthName.value +'</td></tr>');
                }

                if(data.results.bindings[0].birthDate != null){
                    $('#tableResult').append('<tr><td>Date de naissance </td><td>'+ data.results.bindings[0].birthDate.value +'</td></tr>');
                }

                if(data.results.bindings[0].deathDate != null){
                    $('#tableResult').append('<tr><td>Date de decès </td><td>'+ data.results.bindings[0].deathDate.value +'</td></tr>');
                }

                if(data.results.bindings[0].spouse != null){
                    $('#tableResult').append('<tr><td>Epoux/Epouse </td><td>'+ data.results.bindings[0].spouse.value +'</td></tr>');
                }

                if(data.results.bindings[0].picture != null){
                    var image = "<img class=\"picture\" src=\""+ data.results.bindings[0].picture.value +"\"  alt=\"photo\">"
                    $('#tableResult').append('<tr><td>Photo </td><td> '+ image +'</td></tr>');
                }

                
              
             },  
            error: function(e) {
              alert(e);
             }
         });
	 }
         
         function researchAlbum(singerName) {
         var singerSPARQL = "prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dbo: <http://dbpedia.org/ontology/> prefix dbp: <http://dbpedia.org/property/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select distinct ?name ?artist ?releaseDate Where { ?x rdf:type dbo:MusicalWork. ?x dbo:artist ?artist. filter contains(str(?artist),\""+ singerName +"\"). ?x dbp:thisAlbum ?name. Optional{?x dbo:releaseDate ?releaseDate}. }";
         var singerNameQuery = "http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=" + escape(singerSPARQL) + "&format=json";    
         console.log(singerSPARQL);     
         $.ajax({
             url: singerNameQuery,
             dataType: 'jsonp',
             jsonp: 'callback',
             success: function(data) {
				 console.log(data);
				 $('#tableResult2').show();
                $('#tableResult2 tbody').empty();
				var i=0;
				var albums="";
				var count = data.results.bindings.length;
				console.log(count);
				for(i=0;i<count;i++){
					if(data.results.bindings[i].name != null && data.results.bindings[i].releaseDate != null){
						albums+=data.results.bindings[i].name.value;
						  $('#tableResult2').append('<tr><td>'+data.results.bindings[i].name.value +'</td><td>'+ data.results.bindings[i].releaseDate.value +'</td></tr>');
					}else{
						break;
					}
				}  
				
				albums = albums.slice(0,-1);
				console.log(albums);
				                                       
             },  
            error: function(e) {
              alert(e);
             }
         });
         
    }

