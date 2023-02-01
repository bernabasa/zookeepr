const fs = require('fs');
const path = require('path');
const { create } = require('domain');
const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());


function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animal array as filteredResults here
    let filteredResults = animalsArray;
    if(query.personalityTraitsArray) {
        // save personalityTraits as a dedicated array.
        // if personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraitsArray === 'string') {
            personalityTraitsArray = [query.personalityTraitsArray];
        } else {
            personalityTraitsArray = query.personalityTraitsArray;
        }
        // loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraitsArray.indexOf(trait) !== -1
            );
            
        });
    }
    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraitsArray || !Array.isArray(animal.personalityTraitsArray)) {
        return false;
    }
    return true;
}
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
    res.json(result);
});
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {

    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});
app.get('/zookeeprs', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/zookeepers.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT,() => {
    console.log(`API server now on port ${PORT}!`);
});


  

const { animals } = require('./data/animals.json');
const exp = require('constants');
