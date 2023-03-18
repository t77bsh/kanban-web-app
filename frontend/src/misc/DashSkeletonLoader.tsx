import React from "react";

import SidebarSkeletonLoader from "./SidebarSkeletonLoader";
import NavbarSkeletonLoader from "./NavbarSkeletonLoader";
import BoardSkeletonLoader from "./BoardSkeletonLoader";

function DashSkeletonLoader() {
  return (
    <div className="flex flex-col h-screen">
      <SidebarSkeletonLoader />
      <NavbarSkeletonLoader />
      <BoardSkeletonLoader />
    </div>
  );
}

export default DashSkeletonLoader;

