import React from "react";

class AppWrapper extends React.Component<{
  component: typeof React.Component;
  appName: string;
  roomId: number;
}> {
  componentDidMount() {
    document.title = this.props.appName.toLocaleUpperCase();
  }

  render() {
    // @ts-ignore
    this.props.component.roomId = this.props.roomId;
    return <this.props.component roomId={this.props.roomId} />;
  }
}

export default AppWrapper;
