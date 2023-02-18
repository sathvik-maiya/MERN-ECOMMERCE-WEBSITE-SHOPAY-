import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/_sathvik_sathvik_";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dmaaf8xtz/image/upload/v1676392238/products/IMG-20211221-WA0070_lfpegw.jpg"
              alt="Founder"
            />
            <Typography>Sathvik V Maiya</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @sathwikvmaiya. Only with the
              purpose to learn MERN stack.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="http://facebook.com/sathwikmaiya"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="facebookSvgIcon" />
            </a>

            <a
              href="http://instagram.com/_sathvik_sathvik_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
