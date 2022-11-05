async function getData(){
    api_key = 'zEsyctgqv7GuG9zfr5IZLA==1fYgWoEeJCtcP5vq';
    data_url='https://api.le-systeme-solaire.net/rest/bodies/'
    let data = await fetch(data_url);
    let json_data = await data.json();
    bodies = json_data.bodies;
    planets = [];
    bodies.forEach(body => {
        if (body.isPlanet) {
            planets.splice(planets.length, 0, body);
        }
    });

    prevBody = bodies[3];
    getRandomPlanet();
}
getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);
});

function displayBody(body){
    prevBody = body;
    console.log(i);
    let name = body.englishName;
    let discoveredBy;
    let discoveryDate;
    let bodyType=body.bodyType.toLowerCase();
    let axialTilt = body.axialTilt;
    let bodyTypeString='';
    let mass_string;
    let massValue;
    let massExponent;
    let radius = body.meanRadius;
    console.log('radisu is ', radius);
    let earthRadius = 6371.0084;
    let discoveredString;
    let ratio;
    let vol_string;
    let radius_string;
    console.log('radisu is ', radius);

    if(radius>earthRadius){
        ratio=(radius/earthRadius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);
        vol_string='You can fit '+ratio+' Earth in '+name;
        
    }
    else if(radius<earthRadius){
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);

        vol_string='You can fit '+ratio+' '+name +' in  Earth';
    }
    else{
        ratio=(earthRadius/radius)**3;
        console.log(ratio);
        ratio=Math.round(ratio);

        vol_string='You can fit '+ratio+' '+name +' in  Earth';
    }

    if(radius!=0){

        document.getElementById('volumeComparison').textContent = vol_string;
        radius_string= 'The mean radius of '+name+' is '+radius+' km.';
        console.log('radisu is ', radius);
        document.getElementById('radius').textContent = radius_string;

    }

    if (body.discoveredBy!='' && body.discoveryDate!=''){

        discoveredBy=body.discoveredBy;
        discoveryDate=body.discoveryDate;
        console.log('hhhhh');
        console.log(discoveredBy);
        console.log(discoveryDate);
        console.log('hhhhh');
        discoveredString= 'It was discovered on ' + discoveryDate + ' by '+ discoveredBy;
    }

    if(discoveredString!=''){
        document.getElementById('discover').textContent = discoveredString;

    }
    

    if(bodyType[0]=='a'){
        bodyTypeString=' an '+ bodyType;
    }else{
        bodyTypeString=' a '+ bodyType;
    }

    console.log(bodyTypeString);

    if (body.mass == null){
        console.log('the mass in null');
        mass_string=' The mass is unabilable.'
    }
    else{
        massValue = body.mass.massValue;
        massExponent = body.mass.massExponent;
        mass_string=massValue+' x 10^'+massExponent+'kg';
    }
    console.log(name);
    
    document.getElementById('name').textContent = name;
    document.getElementById('mass').textContent = mass_string ;
    document.getElementById('bodyType').textContent = bodyTypeString ;

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    if (radius*6.4 < earthRadius){
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(150, 300, 350, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Earth (for scale)", 100, 400)

        var rad = 1+(350*radius/earthRadius);

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((800)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((800)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(800, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(name, 800-(8*name.length), 400)
    } else {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(500-(150*earthRadius/radius), 300, 150*earthRadius/radius, 0, 2 * Math.PI);
        ctx.fillStyle = "lightseagreen";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Earth (for scale)", Math.max(394-(150*earthRadius/radius), 30), 400)

        var rad = 150;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((800)-rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)-rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.lineTo((800)+rad*1.5*Math.sin(axialTilt*Math.PI/180), (300)+rad*1.5*Math.cos(axialTilt*Math.PI/180));
        ctx.stroke();
        console.log(Math.sin(axialTilt*Math.PI/180));

        ctx.beginPath();
        ctx.arc(800, 300, rad, 0, 2 * Math.PI);
        ctx.fillStyle = "brown";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(name, 800-(8*name.length), 400)
    }
}

function getRandomBody(){
    i=Math.floor(Math.random() * bodies.length);
    let body = bodies[i];
    while (body.name == prevBody.name) {
        i=Math.floor(Math.random() * bodies.length);
        body = bodies[i];
    }
    console.log(i);
    displayBody(body);
}

function getRandomPlanet(){
    i=Math.floor(Math.random() * planets.length);
    let planet = planets[i];
    while (planet.name == prevBody.name) {
        i=Math.floor(Math.random() * planets.length);
        planet = planets[i];
    }
    console.log(i);
    displayBody(planet);
}
