import React, {useEffect} from "react";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import  {defaultQuery} from "../api/sparql/queries"

export default function YasguiEditor() {
  
    useEffect(() => {
      const yasgui = new Yasgui(document.getElementById("yasgui"), {
        requestConfig: { endpoint: "http://localhost:3030/ds/sparql" },
        copyEndpointOnNewTab: false,
      });
      const yasque = yasgui.getTab().getYasqe();
      yasque.setValue(defaultQuery);
      yasque.addPrefixes({ oeh: "http://w3id.org/openeduhub/vocabs/" });
      yasque.addPrefixes({ sdo: "http://schema.org/" });
      yasque.addPrefixes({
        curr: "http://w3id.org/openeduhub/curricula/curriculum_bayern/",
      });
      return () => {};
    }, []);

  return <div id="yasgui" />;
}