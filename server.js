const express = require('express');

const app = express();

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
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

app.listen(3001,() => {
    console.log(`API server now on port 3001!`);
});

const { animals } = require('./data/animals.json')