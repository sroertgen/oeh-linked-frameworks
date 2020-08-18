module.exports = {
  queryData: (endpoint, graph, select, property) => {
    const query = `
      PREFIX sdo: <http://schema.org/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX oeh: <http://w3id.org/openeduhub/vocabs/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ${select}

      WHERE {
        GRAPH <${graph}> {
          ?s rdf:type sdo:Course ;
            ${property} ?bNodeAbout .
          ?bNodeAbout sdo:name ${select} .
        }
      }`;
    const target = `${select}`;
    const sources = [{ type: 'sparql', value: `${endpoint}` }];

    return { query, target, sources };
  },
  queryBuildSubGraph: (discipline, level, context, graph, endpoint) => {
    const query = `
    PREFIX sdo: <http://schema.org/>
    PREFIX curr: <http://w3id.org/openeduhub/curricula/curriculum_bayern/>
    PREFIX oeh: <http://w3id.org/openeduhub/vocabs/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>


    CONSTRUCT {
      ?nodes rdf:type sdo:Course ;
        sdo:name ?nodeName ;
        sdo:courseCode ?courseCode ;
        sdo:hasPart ?parts.
    }
    WHERE {
      GRAPH <${graph}> {
        ?nodes sdo:about ?o.
        ?o sdo:name ?discipline.
        filter(str(?discipline) = "${discipline}")

      ?nodes sdo:educationalLevel ?bNEduLevel.
      ?bNEduLevel sdo:name ?educationalLevel.
      filter(str(?educationalLevel) = "${level}")

      ?nodes oeh:educationalContext ?bNEducontext.
      ?bNEducontext sdo:name ?educationalContext.
      filter(str(?educationalContext) = "${context}")

      ?nodes sdo:name ?nodeName.
      ?nodes sdo:courseCode ?courseCode.
      OPTIONAL { ?nodes sdo:hasPart ?parts. }
    }
  }`;
    const sources = [{ type: 'sparql', value: `${endpoint}` }];
    return { query, sources };
  },
  queryBuildItemGraph: (nodes, itemGraph, endpoint) => {
    const query = `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    CONSTRUCT {
      ?nodes rdf:type sdo:CreativeWork ;
        sdo:name ?nodeName ;
        sdo:isPartOf ?parts .
    }
    WHERE {
      GRAPH <${itemGraph}> {
        ?nodes rdf:type sdo:CreativeWork ;
        sdo:name ?nodeName ;
        sdo:isPartOf ?parts .
        FILTER (STR(?parts) in (${nodes}) )
      }
    }
    `;
    const sources = [{ type: 'sparql', value: `${endpoint}` }];

    return { query, sources };
  },
  queryNodeName: {
    query: `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT DISTINCT ?s ?name

    WHERE {
      ?s rdf:type sdo:Course ;
        sdo:name ?name .
    }
    `,
    targetName: '?name',
    targetNode: '?s',
  },
  queryHasPart: {
    query: `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>


    SELECT DISTINCT ?s ?o

    WHERE {
      ?s rdf:type sdo:Course ;
        sdo:hasPart ?o
    }
    `,
    targetFrom: '?s',
    targetTo: '?o',
  },
  queryItemNodeName: {
    query: `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT DISTINCT ?s ?name

    WHERE {
      ?s rdf:type sdo:CreativeWork ;
        sdo:name ?name .
    }
    `,
    targetName: '?name',
    targetNode: '?s',
  },
  queryIsPartOf: {
    query: `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>


    SELECT DISTINCT ?s ?o

    WHERE {
      ?s rdf:type sdo:CreativeWork ;
        sdo:isPartOf ?o
    }
    `,
    targetFrom: '?o',
    targetTo: '?s',
  },
  queryCurriculaGraphs: (endpoint) => {
    const query = `
 SELECT DISTINCT ?g 
WHERE {
  GRAPH ?g { ?s ?p ?o }
}
    `;
    const sources = [{ type: 'sparql', value: `${endpoint}` }];
    const target = '?g';
    return { query, sources, target };
  },
  queryForLevelOptions: (graph, endpoint, discipline) => {
    const query = `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX oeh: <http://w3id.org/openeduhub/vocabs/> 


    SELECT DISTINCT ?level

    WHERE { 
      GRAPH <${graph}> {
    {
          ?s rdf:type sdo:Course ;
            sdo:about ?bAbout ;
            sdo:educationalLevel ?bLevel .
          ?bAbout sdo:name ?discipline .
          ?bLevel sdo:name ?level .
          
          filter(str(?discipline) = "${discipline}") .

      }
    }
    }
    `;
    const targetLevel = '?level';
    const sources = [{ type: 'sparql', value: `${endpoint}` }];
    return {
      query,
      sources,
      targetLevel,
    };
  },
  queryForContextOptions: (graph, endpoint, level, discipline) => {
    const query = `
    PREFIX sdo: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX oeh: <http://w3id.org/openeduhub/vocabs/> 


    SELECT DISTINCT ?context

    WHERE { 
      GRAPH <${graph}> {
    {
          ?s rdf:type sdo:Course ;
            sdo:about ?bAbout ;
            sdo:educationalLevel ?bLevel ;
            oeh:educationalContext ?bContext .
          ?bAbout sdo:name ?discipline .
          ?bLevel sdo:name ?level .
          ?bContext sdo:name ?context .
          
          filter(str(?discipline) = "${discipline}") .
          filter(str(?level) = "${level}") .

        }
      }
    }
    `;
    const targetLevel = '?context';
    const sources = [{ type: 'sparql', value: `${endpoint}` }];
    return {
      query,
      sources,
      targetLevel,
    };
  },
  defaultQuery: `
SELECT ?s ?p ?o
WHERE {
  GRAPH <http://w3id.org/openeduhub/curricula/curriculum_bayern/#> {
    ?s ?p ?o
  }
} LIMIT 100
  `,
};
