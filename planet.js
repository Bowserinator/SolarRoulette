async function getData(){
    api_key = 'zEsyctgqv7GuG9zfr5IZLA==1fYgWoEeJCtcP5vq';


    data_url='https://api.le-systeme-solaire.net/rest/bodies/'
    let data = await fetch(data_url);
    let json_data = await data.json();
    console.log(json_data);
    console.log()
    let planets = json_data.bodies;

    i=Math.floor(Math.random() * 275);
    console.log(i);
    let planet = planets[i];
    let name = planet.name;
    let mass_value = planet.massValue;
    let mass_string;
    let massValue;
    let massExponent;

    if (planet.mass == null){
        console.log('the mass in null');
        mass_string=' The mass is unabilable.'
    }
    else{
        massValue = planet.mass.massValue;
        massExponent = planet.mass.massExponent;
        mass_string=massValue+' x 10^'+massExponent+'kg';
    }
    // console.log(mass_value);
    // let massExponent = planet.mass.massExponent;
    console.log(name);

    
    

    
    document.getElementById('name').textContent = name;
    document.getElementById('mass').textContent = mass_string ;

}


getData().catch(error =>{
    console.log('something is wrong');
    console.log(error);

    
});


