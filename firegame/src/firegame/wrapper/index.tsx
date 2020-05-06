import Render from "./A_Render";

// this is implemented as a daisy chain of subclasses
class Wrapper<T> extends Render<T> {}

export default Wrapper;
