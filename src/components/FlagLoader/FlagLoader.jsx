import React from "react";
import "./FlagLoader.css";

export default function FlagLoader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <svg width="410px" height="400px">
          <image
            href="https://media.istockphoto.com/photos/indian-flag-waving-symbol-of-india-picture-id961226424?k=20&m=961226424&s=170667a&w=0&h=ULsQ0FMFgJ0j29d6vlqbQBDDdaVWzSrieQ4zwfsKbho="
            height="215"
            width="410"
            preserveAspectRatio="none"
            id="lk"
          />
          <path
            id="p1"
            d="M -200 0
               L -200 10
               Q -150 0 -100 10 
               Q -50  20  0  10 
               Q  50   0 100 10 
               Q  150 20 200 10 
               Q  250  0 300 10 
               Q  350 20 400 10
               L  400 0 
               Z

               M -200 220
               L -200 210
               Q -150 200 -100 210 
               Q -50  220  0  210 
               Q  50  200 100 210 
               Q  150 220 200 210 
               Q  250 200 300 210 
               Q  350 220 400 210
               L  400 220 
               Z"
            stroke="blue"
            fill="white"
            strokeWidth="0"
            transform="translate(0)"
          />
          <path
            id="p2"
            d="M  410 -200
               L  400 -200
               Q  390  -150 400 -100 
               Q  410  -50 400 0 
               Q  390   50  400 100 
               Q  410  150 400 200 
               Q  390   250 400 300 
               Q  410  350 400 400 
               L  410 400
               Z"
            stroke="blue"
            fill="white"
            strokeWidth="0"
            transform="translate(0)"
          />

          <animateTransform
            xlinkHref="#p1"
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0"
            to="200"
            dur="2s"
            repeatCount="indefinite"
          />
          <animateTransform
            xlinkHref="#p2"
            attributeName="transform"
            attributeType="XML"
            type="translate"
            from="0,0"
            to="0,200"
            dur="2s"
            repeatCount="indefinite"
          />
        </svg>

        {/* Branding text */}
        <h1 className="loader-title">TO-LET INDIA</h1>
        <p className="loader-subtitle">Find your dream property with us</p>
      </div>
    </div>
  );
}
