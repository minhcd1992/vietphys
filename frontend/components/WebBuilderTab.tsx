import React from "react";
import LeftPanel from "./builder/LeftPanel";
import CanvasArea from "./builder/CanvasArea";

export default function WebBuilderTab() {
  return (
    <div className="flex h-full w-full bg-[#e9ebee] overflow-hidden font-sans">
      <LeftPanel />
      <CanvasArea />
    </div>
  );
}