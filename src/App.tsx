import React, { useEffect, useState } from "react";
import "./App.css";

interface Palette {
  title: string;
  userName: string;
  numViews: number;
  numVotes: number;
  colors: string[];
}

const formatTime = (date: Date) => {
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes.toString().padStart(2, "0");
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

function App() {
  const [colorPalettes, setColorPalettes] = useState<Palette[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>();

  const fetchColorPalettes = async () => {
    try {
      const res = await fetch(
        "http://www.colourlovers.com/api/palettes/new?format=json"
      );
      const body = await res.json();
      setUpdatedAt(formatTime(new Date()));
      setColorPalettes(body);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchColorPalettes();

    const interval = setInterval(() => {
      fetchColorPalettes();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app text-white font-lato p-8 md:p-16 min-h-screen relative">
      <p className="text-4xl md:text-6xl md:mb-8">
        <span className="font-thin">ColourLovers.</span> Live.
      </p>
      <p className="md:absolute md:right-16 md:top-8 mb-8 md:mb-0">
        {updatedAt}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colorPalettes.length > 0 &&
          colorPalettes.map((palette, i) => (
            <div className="flex justify-between" key={i}>
              <div>
                <p className="text-2xl">{palette.title}</p>
                <p className="text-sm">by {palette.userName}</p>
                <div
                  className="mt-4 inline-block px-2 py-1"
                  style={{ background: "#1e70a9" }}
                >
                  <p>
                    {palette.numViews} views&nbsp;&nbsp;{palette.numVotes} votes
                  </p>
                </div>
              </div>

              <div className="flex">
                {palette.colors.map((color, j) => (
                  <div
                    style={{ background: `#${color}` }}
                    className="w-4 md:w-8 h-full"
                    key={j}
                  ></div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
