const querySparql = async (query, target, sources) => {
  const { newEngine } = require('@comunica/actor-init-sparql');
  const myEngine = newEngine();

  try {
    const result = await myEngine.query(query, {
      sources,
    });
    const results = [];
    result.bindingsStream.on('data', (data) => {
      results.push(data.get(target).value);
    });
    return new Promise((resolve) => {
      result.bindingsStream.on('end', () => {
        resolve(results);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export default querySparql;
