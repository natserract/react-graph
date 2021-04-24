
// @see: https://jgraph.github.io/mxgraph/docs/js-api

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';
import { mxGraph } from 'mxgraph'
import txml from 'txml'
import mx from '../../config/mxGraph'

interface MxContainerIProps {
  className: string;
  forwardedRef: React.MutableRefObject<any>;
  mxOnAction: (graph: mxGraph) => void;
  children?: React.ReactNode;
}

type JSXAttrProps = (
  JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement>
)

const KEYOF_JSONGRAPH = 'jsonGraph'

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
      const model = encoder.encode(graph.getModel());
      const parentNode = container?.parentNode

      const listener = (_sender: unknown, event: any) => {
        undoManager.undoableEditHappened(event.getProperty('edit'))
      }
      graph.getModel().addListener(mxEvent.UNDO, listener)
      graph.getView().addListener(mxEvent.UNDO, listener)

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
              KEYOF_JSONGRAPH, 
              JSON.stringify(txml.parse(mxUtils.getPrettyXml(model)))
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

    return () => {
      localStorage.removeItem(KEYOF_JSONGRAPH)
    }
  }, [forwardedRef, mxOnAction])

  return (
    <div {...rest} className={`mxContainer ${className}`} ref={forwardedRef}>
      {children || null}
    </div>
  )
}

export default MxContainer