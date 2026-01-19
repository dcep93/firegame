import { useEffect } from "react";
import store from "../../../shared/store";

export function handleServerUpdate(clientData: any) {
  console.log("handleServerUpdate", clientData);
}

export default function FirebaseWrapper() {
  useEffect(() => {
    // console.log(store);
  }, [store]);
  return <div></div>;
}

// // https://console.firebase.google.com/u/0/project/firebase-320421/database/firebase-320421-default-rtdb/data
// import React from "react";

// function setData(data: DataType): Promise<void> {
//   return firebase._set(data.userId, data);
// }

// export class FirebaseWrapper<T> extends React.Component<{}, { state: T }> {
//   static handleServerUpdate(clientData: any) {
//     console.log("handleServerUpdate", clientData);
//   }

//   static firebaseWrapperComponent: FirebaseWrapper<any>;
//   componentDidMount() {
//     const oldComponent = FirebaseWrapper.firebaseWrapperComponent;
//     FirebaseWrapper.firebaseWrapperComponent = this;
//     if (oldComponent) {
//       window.location.reload();
//     }
//     const title = this.getTitle();
//     if (title !== null) document.title = title;
//     firebase._connect(this.getFirebasePath(), (state) =>
//       FirebaseWrapper.firebaseWrapperComponent.setState.bind(
//         FirebaseWrapper.firebaseWrapperComponent,
//       )({ state }),
//     );
//   }

//   render() {
//     return <pre>{JSON.stringify(this.state, null, 2)}</pre>;
//   }
// }

// const ex = { setData };

// export default ex;
