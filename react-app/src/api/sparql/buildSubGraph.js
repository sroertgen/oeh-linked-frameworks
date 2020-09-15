// construct query to return subgraph
const buildSubGraph = async (query, sources) => {
  const { newEngine } = require('@comunica/actor-init-sparql');
  const myEngine = newEngine();

  const result = await myEngine.query(
    query, { sources },
  );
  const quads = [];
  result.quadStream.on('data', (data) => {
    quads.push(data);
  });
  return new Promise((resolve) => {
    result.quadStream.on('end', () => {
      resolve(quads);
    });
  });
};

export default buildSubGraph;
