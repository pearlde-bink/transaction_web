import { useEffect, useState } from "react";

const APIKEY = import.meta.env.VITE_GIPHY_API;

interface Props {
  keyword: string;
}

const useFetch = ({ keyword }: Props) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword
          .split(" ")
          .join("")}
          &limit=1`
      );
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      console.log(error);
      setGifUrl(
        "https://giphy.com/gifs/kpop-k-pop-blackpink-3otPoTyx14rYio7YLC"
      );
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
