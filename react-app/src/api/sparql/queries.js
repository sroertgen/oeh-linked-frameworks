import {cleanURL} from "./utils";

export const queryData = (endpoint, graph, select, property) => {
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
  }

export const queryBuildSubGraph = (discipline, level, context, graph, endpoint) => {
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
  }

export const queryBuildItemGraph = (nodes, itemGraph, endpoint) => {
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
  }

export const queryNodeName = {
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
  }

export const queryHasPart = {
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
  }

export const queryItemNodeName = {
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
  }

export const queryIsPartOf = {
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
  }

export const queryCurriculaGraphs = (endpoint) => {
    const query = `
 SELECT DISTINCT ?g 
WHERE {
  GRAPH ?g { ?s ?p ?o }
}
    `;
    const sources = [{ type: 'sparql', value: `${endpoint}` }];
    const target = '?g';
    return { query, sources, target };
  }

export const queryForLevelOptions = (graph, endpoint, discipline) => {
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
  }

export const queryForContextOptions = (graph, endpoint, level, discipline) => {
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
  }

export const queryForType = async(node) => {
    console.log(node)
    const query = `
JSON {
  "type": ?type
}

WHERE {
  <${node}> a ?type .
}
`;
    const queryUrl = cleanURL(`/store/ds/sparql?query=${query}`);
    let response = await fetch(queryUrl)
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
        );
    return [{ property: "No data found, might be a root node" }];
    };
    let data = await response.json();
    return data;
  }

export const queryForCourseProperties = async(node) => {
    const query = `
PREFIX sdo: <http://schema.org/>
PREFIX oeh: <http://w3id.org/openeduhub/vocabs/>

SELECT DISTINCT ?name ?about ?courseCode ?description ?license ?creator ?eduLevel ?eduContext ?publisher


WHERE {
  <${node}> sdo:name ?name ;
    sdo:courseCode ?courseCode ;
    sdo:about ?bAbout ;
    sdo:description ?description ;
    sdo:license ?license ;
    sdo:creator ?bCreator ;
    sdo:educationalLevel ?bLevel ;
    sdo:publisher ?bPublisher ;
    oeh:educationalContext ?bEduContext .
  ?bAbout sdo:name ?about .
  ?bCreator sdo:name ?creator .
  ?bLevel sdo:name ?eduLevel .
  ?bEduContext sdo:name ?eduContext .
  ?bPublisher sdo:name ?publisher .
}
    `;
    const queryUrl = cleanURL(`/store/ds/sparql?query=${query}`);
    let response = await fetch(queryUrl);

    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return [{ property: "No data found, might be a root node" }];
    }

    let data = await response.json();
    return data;
  }

export const queryForItemProps = async(node) => {
  const query = `
  PREFIX sdo: <http://schema.org/>

SELECT DISTINCT ?name ?lrt ?isPartOf

  WHERE {
    <${node}> sdo:name ?name ;
      sdo:isPartOf ?isPartOf ;
      sdo:learningResourceType ?bLRT .
    ?bLRT sdo:name ?lrt .
  }
  `;
  const queryURL = cleanURL(`/store/ds/sparql?query=${query}`);
  let response = await fetch(queryURL)
  if (response.status !== 200) {
    console.log(
      "Looks like there was a problem. Status Code: " + response.status
    );
    return [{ property: "No data found, might be a root node" }];
  }

  let data = await response.json();
  return data;
}

export const defaultQuery = `
SELECT ?s ?p ?o
WHERE {
  GRAPH <http://w3id.org/openeduhub/curricula/curriculum_bayern/#> {
    ?s ?p ?o
  }
} LIMIT 100
  `;