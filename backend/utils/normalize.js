const normalizeData = (students) => {
  return students.map((student) => {
    // Si l'entrée est sous forme de chaîne clé-valeur (deuxième format)
    if (typeof student === 'object' && Object.keys(student).length === 1) {
      const [key, value] = Object.entries(student)[0];
      if (key.includes(';')) {
        const keys = key.split(';');
        const values = value.split(';');

        // Transformer en objet structuré
        return {
          mtknr: values[keys.indexOf('mtknr')] || '',
          nachname: values[keys.indexOf('nachname')] || '',
          vorname: values[keys.indexOf('vorname')] || '',
          pversuch: values[keys.indexOf('pversuch')] || '',
          pvermerk: values[keys.indexOf('pvermerk')] || '',
          sitzplatz: values[keys.indexOf('sitzplatz')] || ''
          
        };
      }
    }

    // Si la structure est déjà correcte
    return student;
  });
};

module.exports = { normalizeData };