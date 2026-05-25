import React from "react";
import { type ProgressAnimatedIndicator } from "../types";

interface Props {
  indicator: ProgressAnimatedIndicator;
  size: number;
  color?: string;
}

export function AnimatedIndicator({
  indicator,
  size,
  color = "#3b82f6",
}: Props) {
  if (indicator === "none") return null;

  const commonStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  switch (indicator) {
    case "walking-person":
      return (
        <div style={commonStyle} className="animate-walk">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <circle cx="12" cy="4" r="2.5" />
            <path d="M15 22v-6l-2-2v-4.5c0-.83-.67-1.5-1.5-1.5h-3c-.83 0-1.5.67-1.5 1.5V14l-2 2v6h2v-5l2-2v-4h2v4l2 2v5h2z" />
          </svg>
          <style jsx>{`
            @keyframes walk {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-3px);
              }
            }
            .animate-walk {
              animation: walk 0.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "running-dog":
      return (
        <div style={commonStyle} className="animate-run">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M18 4.5c-1 0-2 .7-2.5 1.5l-4 6L9 10l-1.5 1.5L11 14l-4 7h2.5l3-5.5L17 13c1.5 0 3-1.5 3-3V5.5c0-.55-.45-1-.5-1h-.5zm-14 11L2 18h3l1.5-1.5-2.5-1zM17 6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
          <style jsx>{`
            @keyframes run {
              0%,
              100% {
                transform: translateX(0) scaleX(1);
              }
              25% {
                transform: translateX(2px) scaleX(0.95);
              }
              75% {
                transform: translateX(-2px) scaleX(1.05);
              }
            }
            .animate-run {
              animation: run 0.3s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "flying-bird":
      return (
        <div style={commonStyle} className="animate-fly">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M4 8c0 1.1.9 2 2 2h2.5l5 5H15l-3-4h3l2.5 2h2l-1.5-3 1.5-3h-2l-2.5 2h-3l3-4H8.5l-5 5H6c-1.1 0-2 .9-2 2z" />
          </svg>
          <style jsx>{`
            @keyframes fly {
              0%,
              100% {
                transform: translateY(0) rotate(0deg);
              }
              25% {
                transform: translateY(-4px) rotate(-5deg);
              }
              75% {
                transform: translateY(4px) rotate(5deg);
              }
            }
            .animate-fly {
              animation: fly 0.6s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "swimming-fish":
      return (
        <div style={commonStyle} className="animate-swim">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M12 20L4 12l8-8c2.5 2.5 2.5 6.5 0 9-.3.3-.6.6-.9.8L12 12l1.5-1.5c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5L12 20z" />
            <circle cx="7" cy="12" r="1" />
          </svg>
          <style jsx>{`
            @keyframes swim {
              0%,
              100% {
                transform: translateX(0) rotate(0deg);
              }
              50% {
                transform: translateX(3px) rotate(10deg);
              }
            }
            .animate-swim {
              animation: swim 0.8s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "crawling-snail":
      return (
        <div style={commonStyle} className="animate-crawl">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M19 9c0-3.87-3.13-7-7-7S5 5.13 5 9c0 1.83.71 3.5 1.86 4.76L4 16.5v1.5h4l2.09-2.09C10.71 16.62 11.34 17 12 17c2.21 0 4-1.79 4-4 0-.74-.21-1.43-.56-2.02.36-.18.72-.43 1.02-.74A6.981 6.981 0 0 0 19 9zm-7 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
          <style jsx>{`
            @keyframes crawl {
              0%,
              100% {
                transform: translateX(0);
              }
              50% {
                transform: translateX(2px);
              }
            }
            .animate-crawl {
              animation: crawl 1.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "bouncing-ball":
      return (
        <div style={commonStyle} className="animate-bounce-ball">
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <circle cx="12" cy="12" r="10" fill={color} />
            <ellipse cx="12" cy="22" rx="6" ry="1" fill="rgba(0,0,0,0.2)" />
          </svg>
          <style jsx>{`
            @keyframes bounce-ball {
              0%,
              100% {
                transform: translateY(0) scaleY(1);
              }
              50% {
                transform: translateY(-10px) scaleY(1.1);
              }
              90% {
                transform: translateY(0) scaleY(0.9);
              }
            }
            .animate-bounce-ball {
              animation: bounce-ball 0.6s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "spinning-star":
      return (
        <div style={commonStyle} className="animate-spin-star">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
          <style jsx>{`
            @keyframes spin-star {
              0% {
                transform: rotate(0deg) scale(1);
              }
              50% {
                transform: rotate(180deg) scale(1.1);
              }
              100% {
                transform: rotate(360deg) scale(1);
              }
            }
            .animate-spin-star {
              animation: spin-star 1s linear infinite;
            }
          `}</style>
        </div>
      );

    case "rocket":
      return (
        <div style={commonStyle} className="animate-rocket">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M12 2C8 2 4 4 4 8c0 2.39 1.4 4.52 3.55 5.69L6 22l6-4 6 4-1.55-8.31C18.6 12.52 20 10.39 20 8c0-4-4-6-8-6zm0 2c2.76 0 5 1.79 5 4s-2.24 4-5 4-5-1.79-5-4 2.24-4 5-4z" />
            <circle cx="12" cy="8" r="2" fill="white" />
          </svg>
          <style jsx>{`
            @keyframes rocket {
              0%,
              100% {
                transform: translateY(0) rotate(-45deg);
              }
              50% {
                transform: translateY(-5px) rotate(-45deg);
              }
            }
            .animate-rocket {
              animation: rocket 0.4s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "car":
      return (
        <div style={commonStyle} className="animate-car">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
          <style jsx>{`
            @keyframes car {
              0%,
              100% {
                transform: translateY(0);
              }
              25% {
                transform: translateY(-1px);
              }
              75% {
                transform: translateY(1px);
              }
            }
            .animate-car {
              animation: car 0.2s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    case "bicycle":
      return (
        <div style={commonStyle} className="animate-bicycle">
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.8-.6-3.8-1.6L13.7 6c-.3-.4-.8-.6-1.3-.5s-.9.3-1.2.6l-1.9 1.9c-.5.5-.5 1.3 0 1.8l3.5 3.1V19h2v-7.4l-2-1.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
          </svg>
          <style jsx>{`
            @keyframes bicycle {
              0%,
              100% {
                transform: translateY(0) rotate(0deg);
              }
              25% {
                transform: translateY(-1px) rotate(-2deg);
              }
              75% {
                transform: translateY(1px) rotate(2deg);
              }
            }
            .animate-bicycle {
              animation: bicycle 0.3s ease-in-out infinite;
            }
          `}</style>
        </div>
      );

    default:
      return null;
  }
}
