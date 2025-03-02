import React from "react";

export interface CustomIcons extends React.SVGProps<SVGSVGElement> {
  size?: number;
  pathFill?: string;
  spaceFill?: string;
  //   : string;
}
