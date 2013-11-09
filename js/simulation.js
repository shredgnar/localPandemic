function connect() {
  var edge_dist = 500;
  for (venue1 in venues) {
    for (venue2 in venues) {
      if (venue1 != venue2) {
        if (dist(venues[venue1],venues[venue2]) < edge_dist)
          venues[venue1].edges.push(new Edge(venues[venue2],venues[venue1]));
      }
    }
  }
}
function total_population() {
  var sum_pop = 0;
  for(v in venues) {
    sum_pop += venues[v].population;
  }
  return sum_pop
}

function total_infected() {
  var sum_infected = 0;
  for (v in venues)
    sum_infected += venues[v].infected;
  return sum_infected
}
function get_infected() {
  var ans = [];
  for (v in venues) {
    if(venues[v].infected > 0)
      ans.push(venues[v]);
  }
  return ans;
}
function update() {
  var sum_incoming_virus = 0;
  for (vi in venues) {
    sum_incoming_virus = 0;
    var v = venues[vi]
    for (edgei in v.edges) {
      var edge = v.edges[edgei]
      var incoming = edge.n1;
      sum_incoming_virus += Math.round(100*edge.weight()*incoming.infected);
    }
    //console.log(incoming)
    self_virus = Math.round(v.infected * 0.01);
    if(v.infected  >  0) {
    //console.log("Node " + vi + " has " + v.infected + " infected");
    //console.log("Node " + vi + " gets " + sum_incoming_virus + " from neighbors");
    //console.log("Node " + vi + " gets " + self_virus + " from itself");
    //console.log("Node " + vi + " has " + v.edges.length + " neighbors");
    }
    v.new_infected = Math.min(v.infected + sum_incoming_virus + self_virus, v.population)
  }

  for (v in venues) {
    venues[v].infected = venues[v].new_infected;
    //venues[v].population = venues[v].new_population;
  }
  $('#map_canvas').gmap('clear', 'markers');
  $.each(venues, function(i, venue) {
    var icon_string = 'images/blue_icon.png';
    if(venue.infected > 0) { icon_string = 'images/red_icon.png';}

    $('#map_canvas').gmap('addMarker', { 
      'position': new google.maps.LatLng(venue.lat, venue.lng), 
      'bounds': true,
      'icon': icon_string,
      'venue_id' : venue.id
    }).mouseover(function() {
      $('#map_canvas').gmap('openInfoWindow', { 'content': venue.contentString() }, this);
    });
  });
}

function randomRange(l,h){
  var range = (h-l);
  var random = Math.floor(Math.random()*range);
  if (random === 0){random+=1;}
  return l+random;
}
function init() {
  connect();
  start_i = randomRange(0,venues.length);
  console.log(venues[start_i]);
  console.log(start_i);
  venues[start_i].infected = Math.round(venues[start_i].population*0.1)
}

function simulate() { //venues is a list of JSON objects
  init();
  console.log("Connected");
  var total_pop = total_population();
  var total_inf= total_infected();
  console.log("Infected: " +  total_inf + ", Total population: " + total_pop);
  while(total_inf < total_pop) {
    update();
    new_total_inf = total_infected();
    console.log("Infected: " +  total_inf + ", Total population: " + total_pop);
    if(total_inf == new_total_inf)
      break;
    total_inf = new_total_inf;
  }
}
