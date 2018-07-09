

// Mocha tests will look for environment variable MODEL to find this file.
// MODEL=YOUR_MODEL mocha --reporter dot --require ts-node/register tests/**/*.spec.ts
// or
// EXPORT MODEL=YOUR_MODEL
// To get these parameters you might need to run the test once to find your models information
// EXPORT MODEL=YOUR_MODEL
// mocha --require ts-node/register tests/**/*.spec.ts --grep index
// mocha --require ts-node/register tests/**/*.spec.ts --grep Object
// mocha --require ts-node/register tests/**/*.spec.ts --grep Properties
//
// This is for my camera.

export const LibraryVersion:String = '17.9599.20170822';
export const CameraId:String = 'YOUR CAMERA ID';
export const DisplayName:String = 'U3CMOS18000KPA';
export const ModelName:String = 'U3CMOS18000KPA';
export const ModelFlag:Number = 16778337;

// Flags supported by your model, @see TOUPCAM_FLAGS in toupcam.js
export const ModelFlags:Array<String> = ["CMOS","BINSKIP_SUPPORTED","USB30","GETTEMPERATURE"]

export const ModelMaxSpeed:Number = 3;
export const ModelPreview:Number = 3;
export const ModelStill:Number = 3;

// Expected Resolution Array with Width, Height
export const ModelRes:Array<Array<Number>> = [[4912,3684],[2456,1842],[1228,922]];

export const HardwareVersion = '2.0';
export const FirmwareVersion = '1.4.0.20160912';
export const SerialNumber = 'YOUR SERIAL NUMBER';
export const ProductionDate = '20180122';
export const PixelDepth = 8;

// If you are black&white onley: 0 true, 1 false (supports color)
export const MonoMode = 1;

// Specify options to test.
export const Options:Array<String> = [
  "NOFRAME_TIMEOUT",
  // "THREAD_PRIORITY",  // Throws E_INVALIDARG, not sure why.
  "PROCESSMODE",
  "RAW",
  "HISTOGRAM",
  // "BITDEPTH",  // Set not implemented for this model
  // "FAN",  // Not Implemented for this model
  // "COOLER", // Not Implemented for this model
  "LINEAR",
  "CURVE",
  // "TRIGGER", // Set not implemented for this model
  // "RGB48", // Set not implemented for this model
];

// FourCC format for raw mode, Known formats include GBRG, RGGB, BGGR, GRBG, YUYV, YYYY (B&W)
export const RawFormat = 'GBRG';
