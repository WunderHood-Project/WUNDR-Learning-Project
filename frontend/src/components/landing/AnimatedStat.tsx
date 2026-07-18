"use client";

import CountUp from "react-countup";

export default function AnimatedStat({ value, suffix, duration }: { value: number; suffix: string; duration: number }) {
  return <CountUp end={value} duration={duration} suffix={suffix} />;
}
