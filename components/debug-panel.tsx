import * as React from "react";
import { cn } from "@/lib/utils";

export interface DebugPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  debugInfo?: any;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ debugInfo, className, ...props }) => {
  if (!debugInfo) return null;
  return (
    <div className={cn("fixed bottom-0 right-0 m-4 p-4 bg-white border rounded shadow-lg z-50 text-xs max-w-xs overflow-auto", className)} {...props}>
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};
