
import { useRef, useCallback } from 'react'
import mx from './config/mxGraph'
import { mxGraph, mxGraphExportObject } from 'mxgraph'
import './index.css';
import MxGraph from './components/mxgraph'

function App() {
  const ref = useRef(null)

  const setGraphStyle = useCallback((mxGraphObj: mxGraphExportObject, graph: mxGraph) => {
    const { mxConstants, mxUtils } = mxGraphObj

    let style: any = {}
    style[mxConstants.STYLE_ROUNDED] = true
    graph.getStylesheet().putCellStyle('html', style);

    style = mxUtils.clone(style)
    style[mxConstants.STYLE_ROUNDED] = false
    style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM
    graph.getStylesheet().putCellStyle('css', style);
  }, [])

  const handleMxAction = useCallback((graph: mxGraph) => {
    setGraphStyle(mx, graph)

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();
    console.debug('parent', parent)

    // Start edit the graph
    graph.getModel().beginUpdate()

    try {
      let v1 = graph.insertVertex(parent, null, 'HTML5', 20, 20, 80, 30, 'html')
      let v2 = graph.insertVertex(parent, null, "CSS3", 200, 150, 80, 30, 'css');
      let e1 = graph.insertEdge(parent, null, '', v1, v2, '');
    } finally {
      // Updates the display
      graph.getModel().endUpdate()
    }

  }, [setGraphStyle])

  return (
    <div className="App">
      <MxGraph
        className="graphInHome"
        forwardedRef={ref}
        mxOnAction={handleMxAction}
      />
    </div>
  );
}

export default App;
