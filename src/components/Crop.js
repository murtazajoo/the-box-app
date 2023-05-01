import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Button, DialogContent } from "@mui/material";

import { Box, DialogActions, Slider, Typography } from "@mui/material";
import getCroppedImg from "../assets/cropImage";
import { toast } from "react-toastify";

export default function Crop({ photoUrl, setOpenCrop, setprofile, setFile }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  function cropComplete(croppedArea, croppedAreaPixels) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoUrl,
        croppedAreaPixels,
        rotation
      );
      setprofile(url);
      setFile(file);
      setOpenCrop(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="container m-auto" style={{ maxWidth: "500px" }}>
        <DialogContent
          dividers
          sx={{
            backgroundColor: "background.default",
            position: "relative",
            height: 400,
            width: "auto",
          }}
        >
          <Cropper
            image={photoUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={cropComplete}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: "Column", mx: 3, my: 2 }}>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Box>
              <Typography>Zoom</Typography>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={ZoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => {
                  setZoom(zoom);
                }}
              />
            </Box>
            <Box>
              <Typography>Rotate</Typography>
              <Slider
                valueLabelDisplay="auto"
                min={0}
                max={360}
                value={rotation}
                onChange={(e, rotation) => {
                  setRotation(rotation);
                }}
              />
            </Box>
          </Box>
          <Box sx={{ dislplay: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outLined"
              onClick={() => {
                setOpenCrop(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={cropImage}>
              Crop
            </Button>
          </Box>
        </DialogActions>
      </div>
    </>
  );
}

const ZoomPercent = (value) => {
  return Math.round(value * 100) + "%";
};
