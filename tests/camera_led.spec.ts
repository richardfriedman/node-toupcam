/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera LEDState Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;

  it( 'Make LED Flash.', () => {
    result = toupcam.lib.Toupcam_put_LEDState( cam.handle, 0, 2, 1000 );
    expectResult(result);
  });

  it( 'Turn LED Off.', () => {
    result = toupcam.lib.Toupcam_put_LEDState( cam.handle, 0, 0, 1000 );
    expectResult(result);
  });

});
