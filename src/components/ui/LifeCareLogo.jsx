import React from 'react';

/**
 * LifeCare Official Brand Logo
 * Stethoscope wrapped around a red heart with a bold red medical cross,
 * directly matching the user's uploaded logo asset.
 */
export function LifeCareLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Outer Heart (Red outline) */}
        <path
          d="M50 88C50 88 18 64 18 38C18 24 28 14 42 14C47.5 14 50 18 50 18C50 18 52.5 14 58 14C72 14 82 24 82 38C82 64 50 88 50 88Z"
          fill="#FFF1F2"
          stroke="#E11D48"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Inner Heart subtle border */}
        <path
          d="M50 82C50 82 23 60 23 38C23 27 31 19 42 19C46 19 48.5 22 50 22C51.5 22 54 19 58 19C69 19 77 27 77 38C77 60 50 82 50 82Z"
          fill="white"
          stroke="#FDA4AF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Center Medical Cross (+) */}
        <path
          d="M45 32H55V44H67V54H55V66H45V54H33V44H45V32Z"
          fill="#E11D48"
        />

        {/* Stethoscope Tubing and Ear-tubes wrapped around */}
        {/* Left Earpiece & Binaural tube */}
        <path
          d="M14 26C14 26 10 32 10 44C10 66 32 86 54 78"
          stroke="#BE123C"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Right Chest Piece (Diaphragm) */}
        <circle cx="68" cy="85" r="7" fill="#E11D48" stroke="#991B1B" strokeWidth="2.5" />
        <circle cx="68" cy="85" r="3" fill="white" />
        <path
          d="M54 78L64 82"
          stroke="#BE123C"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Ear-tips */}
        <rect x="8" y="24" width="7" height="4" rx="2" fill="#991B1B" />
        <path d="M11 26C11 26 15 28 16 35" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" />
        <rect x="22" y="24" width="7" height="4" rx="2" fill="#991B1B" />
        <path d="M24 26C24 26 21 32 18 36" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="text-left select-none">
          <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
            Life<span className="text-rose-600">Care</span>
          </span>
          <span className="text-[10px] text-rose-600 font-bold tracking-wider uppercase block -mt-0.5">
            Hospital & Medical Center
          </span>
        </div>
      )}
    </div>
  );
}
