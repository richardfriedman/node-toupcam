/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera LevelRange Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;

  // it( 'Test LevelRange Auto.', () => {
  //   result = toupcam.lib.Toupcam_LevelRangeAuto( cam.handle );
  //   expectResult(result);
  // });
  //
  let currentLow:any = 0;
  let currentHigh:any = 0;
  it( 'Validate get existing levelrange.', () => {
    let _low:any = toupcam.alloc.UShortArray(4);
    let _high:any = toupcam.alloc.UShortArray(4);
    result = toupcam.lib.Toupcam_get_LevelRange( cam.handle, _low, _high );
    expectResult(result);
    currentLow = _low;
    currentHigh = _high;
  });

  let newLow:any = null;
  let newHigh:any = null;
  it( 'Validate setting levelrange.', () => {
    newLow = toupcam.alloc.UShortArray(4);
    newHigh = toupcam.alloc.UShortArray(4);
    newLow[0] = newLow[1] = newLow[2] = newLow[3] = Math.floor( currentHigh[0] / 10 );
    newHigh[0] = newHigh[1] = newHigh[2] = newHigh[3] = Math.floor( 9 * (currentHigh[0] / 10) );
    result = toupcam.lib.Toupcam_put_LevelRange( cam.handle, newLow, newHigh );
    expectResult(result);
  });

  it( 'Validate if levelrange was set properly.', () => {
    let _low:any = toupcam.alloc.UShortArray(4);
    let _high:any = toupcam.alloc.UShortArray(4);
    result = toupcam.lib.Toupcam_get_LevelRange( cam.handle, _low, _high );
    expectResult(result);
    for ( let i = 0; i < 4; i++ ){
      expect( _low[i], `Low: ${i}`).to.equal( newLow[i] );
      expect( _high[i], `Low: ${i}`).to.equal( newHigh[i] );
    }
  });

  it( 'Reset levelrange.', () => {
    result = toupcam.lib.Toupcam_put_LevelRange( cam.handle, currentLow, currentHigh );
    expectResult(result);
  });

  it( 'Validate resetting levelrange.', () => {
    let _low:any = toupcam.alloc.UShortArray(4);
    let _high:any = toupcam.alloc.UShortArray(4);
    result = toupcam.lib.Toupcam_get_LevelRange( cam.handle, _low, _high );
    expectResult(result);
    for ( let i = 0; i < 4; i++ ){
      expect( _low[i], `Low: ${i}`).to.equal( currentLow[i] );
      expect( _high[i], `Low: ${i}`).to.equal( currentHigh[i] );
    }
  });

});
