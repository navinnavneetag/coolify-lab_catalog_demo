import { TextShimmerWave } from "../ui/text-shimmer-wave";
import { memo } from "react";
import PropTypes from "prop-types";

const TextLoader = memo(function TextLoader({ text }) {
  return (
    <TextShimmerWave className="flex justify-center items-center h-[calc(100vh-10rem)]">
      {text}
    </TextShimmerWave>
  );
});

TextLoader.propTypes = {
  text: PropTypes.string,
};

export default TextLoader;
