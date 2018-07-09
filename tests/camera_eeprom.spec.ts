/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera EEPROM Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  it.skip( 'Read EEPROM.', () => {
    let _buffer = toupcam.alloc.UCharArrayPtr(11);
    result = toupcam.lib.Toupcam_read_EEPROM( cam.handle, 0, _buffer, 10 );
    expectResult(result);
  });

  it.skip( 'Write EEPROM.', () => {
    let _buffer = toupcam.alloc.UCharArrayPtr(11);
    result = toupcam.lib.Toupcam_write_EEPROM( cam.handle, 0, _buffer, 10 );
    expectResult(result);
  });

});
