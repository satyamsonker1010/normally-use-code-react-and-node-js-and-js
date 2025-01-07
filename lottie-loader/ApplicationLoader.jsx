import Lottie from "lottie-react";
import LoaderAnimation from "../../assets/animations/lottie/loader.json";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: LoaderAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ApplicationLoader = () => {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <Lottie animationData={LoaderAnimation} loop autoplay/>
   
    </div>
  );
};

export default ApplicationLoader;
