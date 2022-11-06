async function getData(){
    api_key = 'zEsyctgqv7GuG9zfr5IZLA==1fYgWoEeJCtcP5vq';
    data_url = 'https://api.le-systeme-solaire.net/rest/bodies/';
    let data = await fetch(data_url);
    let json_data = await data.json();
    bodies = json_data.bodies;
    planets = [];
    moons = [];
    dwarfs = [];
    asteroids = [];
    comets = [];
    bodies.forEach(body => {
        if (body.isPlanet) {
            planets.splice(planets.length, 0, body);
        }
        else if (body.bodyType == "Moon") {
            moons.splice(moons.length, 0, body);
        } else if (body.bodyType == "Asteroid") {
            asteroids.splice(asteroids.length, 0, body);
        } else if (body.bodyType == "Comet") {
            comets.splice(comets.length, 0, body);
        } else if (body.bodyType == "Dwarf Planet") {
            dwarfs.splice(dwarfs.length, 0, body);
        }
    });

    prevBody = bodies[243];
    getRandomPlanet();
    //getBody("earth");
}
getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);
});

function displayBody(body){

    // let idata;
    // $.getJSON("./imgdata.json", function(data){
    //     $.each(data,function(key,value){
    //         if (key == body.englishName){
    //             document.getElementById("bimg").src = value;
    //         }
    //     })
    // })
    
    prevBody = body;
    let name = body.englishName;
    let discoveredBy;
    let discoveryDate;
    let bodyType=body.bodyType.toLowerCase();
    let axialTilt = body.axialTilt;
    let bodyTypeString;
    let mass_string;
    let massValue;
    let massExponent;
    let radius = body.meanRadius;
    console.log('radius is ', radius);
    let earthRadius = 6371.0084;
    let discoveredString;
    let ratio;
    let vol_string;
    let radius_string;
    console.log('radius is ', radius);

    if(radius>earthRadius){
        ratio=(radius/earthRadius)**3;
        console.log(ratio);
        ratio=Math.round(ratio).toLocaleString();
        vol_string='You can fit ≈ '+ratio+' Earths in '+name+'.';
        
    }
    else if(radius<earthRadius){
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio).toLocaleString();

        vol_string='You can fit ≈ '+ratio+' of '+name +' in  Earth.';
    }
    else{
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio).toLocaleString();

        vol_string='You can fit ≈ '+ratio+' of '+name +' in  Earth.';
    }

    if(radius!=0){
        if(radius>earthRadius){
            ratio=(radius/earthRadius)**3;
            console.log(ratio);
            ratio=Math.round(ratio);
            vol_string='You can fit '+ratio+' Earth in '+name+'.\n';
        }
        else {
            ratio=(earthRadius/radius)**3;
            console.log(ratio);
            ratio=Math.round(ratio);
    
            vol_string='You can fit '+ratio+' '+name +' in  Earth.\n';
        }

        document.getElementById('volumeComparison').textContent = vol_string;
        radius_string= 'The mean radius of '+name+' is '+radius.toLocaleString()+' km.';
        console.log('radisu is ', radius);
        document.getElementById('radius').textContent = radius_string;
    } else {
        document.getElementById('volumeComparison').textContent = "";
        document.getElementById('radius').textContent = "";
    }

    if (body.discoveredBy!='' && body.discoveryDate!=''){
        discoveredBy=body.discoveredBy;
        discoveryDate=body.discoveryDate;
        discoveryDate = discoveryDate.split('/');

        // Swap M/D for US format
        [discoveryDate[0], discoveryDate[1]] = [discoveryDate[1], discoveryDate[0]];
        discoveryDate = discoveryDate.join('/');

        console.log('hhhhh');
        console.log(discoveredBy);
        console.log(discoveryDate);
        console.log('hhhhh');
        discoveredString= 'It was discovered on <span class="text-primary">' + discoveryDate +
            '</span> by <span class="text-primary">'+ discoveredBy+'</span>.';
    }

    if (discoveredString){
        document.getElementById('discover').innerHTML = discoveredString;
    } else {
        document.getElementById('discover').innerHTML = "";
    }
    
    bodyTypeString=' is';

    if(bodyType[0]=='a'){
        bodyTypeString+=' an '+ bodyType;
    }else{
        bodyTypeString+=' a '+ bodyType;
    }

    console.log(bodyTypeString);
    bodyTypeString+='.';
    console.log(bodyTypeString);

    if (!body.mass){
        mass_string = '';
    }
    else{
        massValue = body.mass.massValue;
        massExponent = body.mass.massExponent;
        mass_string = ` It has a mass of ${massValue.toLocaleString()} x 10<sup>${massExponent}</sup> kg.`;
    }
    console.log(name);
    
    document.getElementById('name').textContent = name;
    document.getElementById('bodyType').textContent = bodyTypeString ;

    document.getElementById('mass').innerHTML = mass_string ;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "28px 'Roboto Condensed'";
    ctx.lineWidth = 1;
    if (radius*6.4 < earthRadius){
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(50, 300, 350, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("Earth (for scale)", 100, 400)

        var rad = 1+(350*radius/earthRadius);

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((700)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((700)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(700, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillText(name, 700-(8*name.length), 400)
    } else {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(400-(150*earthRadius/radius), 300, 150*earthRadius/radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText("Earth (for scale)", Math.max(294-(150*earthRadius/radius), 30), 400)

        var rad = 150;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((700)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((700)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();
        console.log(Math.sin(axialTilt*Math.PI/180));

        ctx.beginPath();
        ctx.arc(700, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillText(name, 700-(8*name.length), 400)
    }
}

function getRandomBody(){
    i=Math.floor(Math.random() * bodies.length);
    let body = bodies[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * bodies.length);
        body = bodies[i];
    }
    console.log(i);
    displayBody(body);
}

function getRandomPlanet(){
    i=Math.floor(Math.random() * planets.length);
    let planet = planets[i];
    while (planet.id == prevBody.id) {
        i=Math.floor(Math.random() * planets.length);
        planet = planets[i];
    }
    console.log(i);
    displayBody(planet);
}

function getRandomMoon(){
    i=Math.floor(Math.random() * moons.length);
    let body = moons[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * moons.length);
        body = moons[i];
    }
    console.log(i);
    displayBody(body);
}

function getRandomAsteroid(){
    i=Math.floor(Math.random() * asteroids.length);
    let body = asteroids[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * asteroids.length);
        body = asteroids[i];
    }
    console.log(i);
    displayBody(body);
}

function getRandomComet(){
    i=Math.floor(Math.random() * comets.length);
    let body = comets[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * comets.length);
        body = comets[i];
    }
    console.log(i);
    displayBody(body);
}

function getRandomDwarf(){
    i=Math.floor(Math.random() * dwarfs.length);
    let body = dwarfs[i];
    while (body.id == prevBody.id) {
        i=Math.floor(Math.random() * dwarfs.length);
        body = dwarfs[i];
    }
    console.log(i);
    displayBody(body);
}

function getSun(){
    displayBody(bodies[242]);
}

function getBody(bodyName) {
    console.log(bodyName);
    bodyName = bodyName.toLowerCase();
    bodies.forEach(body => {
        //console.log(body.englishName.toLowerCase());
        if (body.englishName.toLowerCase().includes(bodyName) || body.id.toLowerCase().includes(bodyName) || body.name.toLowerCase().includes(bodyName)){
            displayBody(body);
        }
    });
}

function searchBody() {
    var bodyName = document.getElementById('searchBar').value;
    if (bodyName == null || bodyName.length == 0){
        return false;
    }
    getBody(bodyName);
    return false;
}