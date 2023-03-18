import React from "react";

interface Props {
  children: React.ReactNode;
}

function Modall(props: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-neutral-900 opacity-75"></div>
      </div>
      <div
        className="relative flex-1 flex items-center justify-center min-w-0 w-full h-full rounded-lg shadow-lg overflow-y-auto"
        tabIndex={-1}
      >
        {/* Modal Content Here */}
        {props.children}
        {/*  End of Modal Content */}
      </div>
    </div>
  );
}

export default Modall;
