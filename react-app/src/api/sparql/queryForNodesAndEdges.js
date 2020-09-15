export const queryForNodes = async (query, store) => {
  const { newEngine } = require('@comunica/actor-init-sparql');
  const myEngine = newEngine();
  const sources = [{ type: 'rdfjsSource', value: store }];

  try {
    const result = await myEngine.query(query.query, {
      sources,
    });
    const results = [];
    result.bindingsStream.on('data', (data) => {
      results.push({
        id: data.get(query.targetNode).value,
        label: data.get(query.targetName).value,
      });
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

export const queryForEdges = async (query, store) => {
  const { newEngine } = require('@comunica/actor-init-sparql');
  const myEngine = newEngine();
  const sources = [{ type: 'rdfjsSource', value: store }];

  try {
    const result = await myEngine.query(query.query, {
      sources,
    });
    const results = [];
    result.bindingsStream.on('data', (data) => {
      results.push({
        from: data.get(query.targetFrom).value,
        to: data.get(query.targetTo).value,
      });
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
