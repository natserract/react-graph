import { mxGraphModel } from "mxgraph"

/**
 * Example:
 * 
 * Decode:
 * const jsonNodes = that.getJsonModel(graph);
 * let jsonStr = that.stringifyWithoutCircular(jsonNodes);
 * localStorage.setItem("json", jsonStr);
 * 
 * Decode:
 * var encoder = new mxCodec();
 * var node = encoder.encode(graph.getModel());
 * mxUtils.popup(mxUtils.getXml(node), true);
*/
export const jsonGraph = (mx: any) => {
  const { mxObjectCodec, mxUtils } = mx
  const value = new Object()
  const codec = new mxObjectCodec(value)

  const encode = (value: any) => {
    const xmlDoc = mxUtils.createXmlDocument();
    const newObject = xmlDoc.createElement("TaskObject");
    for (let prop in value) {
      newObject.setAttribute(prop, value[prop]);
    }
    return newObject;
  }

  const decode = (model: mxGraphModel) => {
    console.log('keys', Object.entries(model.cells))

    return Object.keys(model.cells)
      .map((iCell: string) => {
        const currentCell = model.getCell(iCell);
        return currentCell.value !== undefined ? currentCell : null;
      })
      .filter(item => item !== null);
  }

  return {
    encode,
    decode
  }
}

export const stringifyWithoutCircular = (json: string) => {
  return JSON.stringify(
    json,
    (key, value) => {
      if (
        (key === "parent" || key == "source" || key == "target") &&
        value !== null
      ) {
        return value.id;
      } else if (key === "value" && value !== null && value.localName) {
        let results: any = {};
        Object.keys(value.attributes).forEach(attrKey => {
          const attribute = value.attributes[attrKey];
          results[attribute.nodeName] = attribute.nodeValue;
        });
        return results;
      }
      return value;
    },
    4
  );
};