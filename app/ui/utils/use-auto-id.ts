import * as React from "react";
export function useAutoId(explicit?: string): string {
    const auto = React.useId();
    return explicit ?? auto;
}
