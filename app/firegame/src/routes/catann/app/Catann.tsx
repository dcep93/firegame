import React from "react";
import IframeScriptString from "./IframeScriptString";

class Catann extends React.Component {
  private iframeRef = React.createRef<HTMLIFrameElement>();
  private didInitIframe = false;

  private handleIframeLoad = () => {
    if (this.didInitIframe) return;
    const iframe = this.iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;
    this.didInitIframe = true;
    doc.open();
    doc.write(
      `<!doctype html><html><head><base href="/"></head><body><script>${IframeScriptString()};</script></body></html>`,
    );
    doc.close();
  };

  render() {
    return (
      <div
        style={{
          width: "100vW",
          height: "100vH",
          overflow: "hidden",
          overscrollBehavior: "none",
        }}
      >
        <iframe
          ref={this.iframeRef}
          title={"iframe"}
          src={"/#room420"}
          onLoad={this.handleIframeLoad}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </div>
    );
  }
}

export default Catann;
