import Init from "./wrapper/A_Init";

// this is implemented as a daisy chain of subclasses
class Wrapper<T> extends Init<T> {}

export default Wrapper;
