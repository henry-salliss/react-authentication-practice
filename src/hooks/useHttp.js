import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const sendRequest = useCallback(async (requestConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        headers: requestConfig.headers ? requestConfig.headers : {},
      });
      if (!response.ok) console.log("Request failed");
      const data = await response.json();
      setIsLoading(false);
      setData(data);
      return data;
    } catch (err) {
      setError(err);
    }
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    data,
  };
};

export default useHttp;
