import React, { useRef, useEffect, useCallback } from 'react'
import Home from './components/Home'
import ReactDOM from 'react-dom';
import mx from './config/mxGraph'
import { mxGraph } from 'mxgraph'
import './index.css';

interface MxContainerIProps {
  className: string;
  children?: React.ReactNode;
  forwardedRef: React.MutableRefObject<any>;
  mxOnAction: (graph: mxGraph) => void;
}

type JSXAttrProps = (
  JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement>
)

const MxContainer = (props: MxContainerIProps & JSXAttrProps) => {
  const {
    className,
    children,
    forwardedRef,
    mxOnAction
  } = props;

  useEffect(() => {
    const {
      mxClient
      , mxUtils
      , mxEvent
      , mxGraph
      , mxRubberband
      , mxConstants
    } = mx

    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false)
    } else {
      const container = ReactDOM.findDOMNode(forwardedRef.current) as HTMLElement
      let newGraph = null;

      if (container) {
        // Disables the built-in context menu
        mxEvent.disableContextMenu(container)

        // Creates the graph inside the given container
        const graph = new mxGraph(container)
        newGraph = graph

        // Changes some default colors
        mxConstants.HANDLE_STROKECOLOR = "#00a8ff"

        // Enables rubberband selection
        new mxRubberband(graph);

        // Enables tooltips, new connections and panning
        // graph.setTooltips(true);
        // graph.setAllowDanglingEdges(false);
        // graph.gridSize = 30;
        // graph.centerZoom = true;
        // graph.autoSizeCellsOnAdd = true;

        // Add another global context here
        //...
      }

      if (newGraph) mxOnAction(newGraph);
      return;
    }
  }, [])

  return (
    <div {...props} className={`mxContainer ${className}`} ref={forwardedRef}>
      {children || null}
    </div>
  )
}

function App() {
  const ref = useRef(null)

  const setGraphStyle = useCallback((graph: mxGraph) => {
    const { mxConstants } = mx

    let style: any = []
    style[mxConstants.HANDLE_FILLCOLOR] = "#0000";
    graph.getStylesheet().putCellStyle('bottom', style)

    return style
  }, [])

  const handleMxAction = useCallback((graph: mxGraph) => {
    const { mxGraph, mxRectangle } = mx

    setGraphStyle(graph)

    // Gets the default parent for inserting new cells. This is normally the first
    // child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();
    console.debug('parent', parent)

    // Start edit the graph
    graph.getModel().beginUpdate()

    try {
      const v1 = graph.insertVertex(parent, 'bottom', 'Hello', 20, 20, 80, 30, 'bottom')
      const v2 = graph.insertVertex(parent, null, "World", 200, 150, 80, 30);
      const e1 = graph.insertEdge(parent, null, '', v1, v2);
    } finally {
      // Updates the display
      graph.getModel().endUpdate()
    }

  }, [])

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>React Mx Graph</h1>

      <MxContainer
        className="mxContainerFirst"
        forwardedRef={ref}
        mxOnAction={handleMxAction}
      />
    </div>
  );
}

export default App;
