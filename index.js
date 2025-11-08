require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Localhost

const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// Route principale : liste tous les contacts
app.get('/', async (req, res) => {
  const contactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const resp = await axios.get(contactsUrl, { headers });
    const contacts = resp.data.results;
    res.render('homepage', { title: 'Contacts | HubSpot Practicum', contacts });
  } catch (error) {
    console.error('Erreur récupération contacts:', error.response?.data || error.message);
    res.send('Erreur lors de la récupération des contacts HubSpot');
  }
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



// form page
app.get('/update-cobj', async (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});


// add new contact
app.post('/update-cobj', async (req, res) => {
  const { firstname, lastname, email } = req.body;

  const newContact = {
    properties: {
      firstname,
      lastname,
      email
    }
  };

  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, newContact, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Erreur création contact:', error.response?.data || error.message);
    res.send('Erreur lors de la création du contact');
  }
});