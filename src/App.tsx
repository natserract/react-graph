
/**
 * 
 * @issues (fixed)
 * Image doesn't show, 
 * 
 * If you want to use STYLE_IMAGE/STYLE_IMAGE_BACKGROUND, you must add this first
 * style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
 * 
 * I don't know why mxImageBasePath doesn't work
 * mxImageBasePath: "assets/img",
*/
import { useRef, useCallback } from 'react'
import mx from './config/mxGraph'
import { mxGraph, mxGraphExportObject } from 'mxgraph'
import './index.css';
import MxGraph from './components/mxgraph'

const imgPath = {
  html: 'assets/img/html5.png',
  css: 'assets/img/css3.png',
}

function App() {
  const ref = useRef(null)

  const setGraphStyle = useCallback((mxGraphObj: mxGraphExportObject, graph: mxGraph) => {
    const { mxConstants, mxUtils } = mxGraphObj

    let style: any = {}
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_IMAGE] = imgPath.html
    style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
    style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
    style[mxConstants.STYLE_SPACING_TOP] = '56';
    style[mxConstants.STYLE_SPACING] = '8';
    graph.getStylesheet().putCellStyle('html', style);

    style = mxUtils.clone(style)
    style[mxConstants.STYLE_IMAGE] = imgPath.css
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
