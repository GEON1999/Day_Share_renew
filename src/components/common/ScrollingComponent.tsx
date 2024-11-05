import React from "react";
import withScrolling from "react-dnd-scrolling";

const ScrollingComponent = withScrolling(
  React.forwardRef<HTMLDivElement, any>((props, ref) => (
    <div ref={ref} {...props} />
  ))
);

export default ScrollingComponent;
