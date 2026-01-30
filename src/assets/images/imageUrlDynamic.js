const getImgUrl = () => {
    const runtime = window.RUNTIME_CONFIG || {};
  
    return {
      'navbarimage': `${runtime.baseUrl}media/flag.png`,
      'who-logo': `${runtime.baseUrl}media/logo.png`,
      'bangladesh-logo': `${runtime.baseUrl}media/bangladesh-logo.png`,
      'cdic-logo': `${runtime.baseUrl}media/cdic-logo.png`,
    };
  };
  
  export default getImgUrl;
  