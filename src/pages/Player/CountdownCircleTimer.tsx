import { Props, useCountdown } from "react-countdown-circle-timer";

import { cn } from "@/utils";

export const timeStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

export function CountdownCircleTimer(props: Props) {
  const { children, strokeLinecap, trailStrokeWidth } = props;
  const {
    path,
    pathLength,
    stroke,
    strokeDashoffset,
    remainingTime,
    elapsedTime,
    size,
    strokeWidth,
  } = useCountdown(props);

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          fill="none"
          strokeWidth={trailStrokeWidth ?? strokeWidth}
        />
        <path
          d={path}
          fill="none"
          className="stroke-muted-foreground"
          strokeLinecap={strokeLinecap ?? "round"}
          strokeWidth={strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {typeof children === "function" && (
        <div style={timeStyle}>
          {children({ remainingTime, elapsedTime, color: stroke })}
        </div>
      )}
    </div>
  );
}
