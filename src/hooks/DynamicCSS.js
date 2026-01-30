import React, { useEffect, useState } from 'react';
import { APP_LOCALE } from '../assets/data/config'; 
//import fallbackStyles from './fallbackStyles.json'; // Import the fallback styles as a JSON object

const DynamicCSS = ({ cssUrl }) => {
  const [cssContent, setCssContent] = useState('');
  const locale = APP_LOCALE; 
  useEffect(() => {
    console.log("cssUrl ",cssUrl)

    const fetchAndSaveCSS = async () => {
      try {
        // const response = await fetch(cssUrl);
        // if (!response.ok) throw new Error('Network response was not ok');
        // const jsonResponse = await response.json();
       // const cssText = convertStylesToCSS(jsonResponse.customStyles);
       const cssText = convertStylesToCSS(cssUrl[locale]["customStyles"]);
        localStorage.setItem('dynamicCSS', cssText);
      
        // localStorage.setItem('appConfign', cssUrl);
        setCssContent(cssText);
      } catch (error) {
        console.error('Error fetching CSS from API:', error);
        const savedCss = localStorage.getItem('dynamicCSS');
        if (savedCss) {
          setCssContent(savedCss);
        } else {
        //   const cssText = convertStylesToCSS(fallbackStyles.customStyles);
        //   setCssContent(cssText);
        }
      }
    };

    fetchAndSaveCSS();
  }, [cssUrl]);

  useEffect(() => {
    if (cssContent) {
      const styleElement = document.createElement('style');
      styleElement.textContent = cssContent;
      document.head.appendChild(styleElement);

      // Cleanup on component unmount
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [cssContent]);

  const convertStylesToCSS = (styles) => {
    let css = '';
    for (const selector in styles) {
      css += `${selector} {`;
      for (const property in styles[selector]) {
        css += `${property}: ${styles[selector][property]};`;
      }
      css += '} ';
    }
    return css;
  };

  return null; // This component doesn't render anything itself
};

export default DynamicCSS;
