
// @see: https://jgraph.github.io/mxgraph/docs/js-api
import React, { useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom';
import mx from './config/mxGraph'
import { mxGraph, mxGraphExportObject } from 'mxgraph'
import './index.css';
import txml from 'txml'
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
    mxOnAction,
    ...rest
  } = props;

  useEffect(() => {
    const {
      mxClient
      , mxUtils
      , mxEvent
      , mxGraph
      , mxRubberband
      , mxConstants
      , mxUndoManager
      , mxCodec
    } = mx


    const handleGraphBtnAction = (graph: mxGraph, container: HTMLElement) => {
      const undoManager = new mxUndoManager()
      const encoder = new mxCodec();
      const node = encoder.encode(graph.getModel());

      const listener = (_sender: unknown, event: any) => {
        undoManager.undoableEditHappened(event.getProperty('edit'))
      }
      graph.getModel().addListener(mxEvent.UNDO, listener)
      graph.getView().addListener(mxEvent.UNDO, listener)

      const parentNode = container?.parentNode

      if (parentNode) {
        parentNode.appendChild(
          mxUtils.button("undo", function () {
            undoManager.undo();
          })
        );

        parentNode.appendChild(
          mxUtils.button("redo", function () {
            undoManager.redo();
          })
        );

        parentNode.appendChild(
          mxUtils.button("View JSON", function () {
            window.alert('Look at your localstorage')
            localStorage.setItem(
              'jsonGraph', 
              JSON.stringify(txml.parse(mxUtils.getPrettyXml(node)))
            )
          })
        );
      }
    }

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
        graph.setConnectable(true)
        graph.setTooltips(true);
        graph.setAllowDanglingEdges(false);

        // Add another global context here
        //...

        handleGraphBtnAction(graph, container)

        if (newGraph) mxOnAction(newGraph);
      }

      return;
    }
  }, [forwardedRef, mxOnAction])

  return (
    <div {...rest} className={`mxContainer ${className}`} ref={forwardedRef}>
      {children || null}
    </div>
  )
}

function App() {
  const ref = useRef(null)

  const setGraphStyle = useCallback((mxGraphObj: mxGraphExportObject, graph: mxGraph) => {
    const { mxConstants, mxUtils } = mxGraphObj

    let style: any = {}

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
      {/* <h1 style={{ textAlign: 'center' }}>Frontend Roadmap | React Mx Graph</h1> */}

      <MxContainer
        className="graphInHome"
        forwardedRef={ref}
        mxOnAction={handleMxAction}
      />
    </div>
  );
}

export default App;
