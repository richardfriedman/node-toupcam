/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera WhiteBalanceGain Functions.', () => {

  let cam = new CameraPrep(true);
  let result: number = null;

  let currentGain:any = 0;
  it( 'Validate get existing whitebalancegain.', () => {
    let _gain:any = toupcam.alloc.IntArray(3);
    result = toupcam.lib.Toupcam_get_WhiteBalanceGain( cam.handle, _gain );
    expectResult( result );
    currentGain = _gain;
  });

  let newGain:any = null;
  it( 'Validate setting whitebalancegain.', () => {
    newGain = toupcam.alloc.IntArray(3);
    newGain[0] = currentGain[0] == 0 ? 127 : 0;
    newGain[1] = currentGain[1] == 0 ? 127 : 0;
    newGain[2] = currentGain[2] == 0 ? 127 : 0;
    result = toupcam.lib.Toupcam_put_WhiteBalanceGain( cam.handle, newGain );
    expectResult( result );
  });

  it( 'Validate if whitebalancegain was set properly.', () => {
    let _gain:any = toupcam.alloc.IntArray(3);
    result = toupcam.lib.Toupcam_get_WhiteBalanceGain( cam.handle, _gain );
    expectResult( result );
    expect( _gain[0] ).to.equal( newGain[0] );
    expect( _gain[1] ).to.equal( newGain[1] );
    expect( _gain[2] ).to.equal( newGain[2] );
  });

  it( 'Reset whitebalancegain.', () => {
    result = toupcam.lib.Toupcam_put_WhiteBalanceGain( cam.handle, currentGain );
    expectResult( result );
  });

  it( 'Validate resetting whitebalancegain.', () => {
    let _gain:any = toupcam.alloc.IntArray(3);
    result = toupcam.lib.Toupcam_get_WhiteBalanceGain( cam.handle, _gain );
    expectResult( result );
    expect( _gain[0] ).to.equal( currentGain[0] );
    expect( _gain[1] ).to.equal( currentGain[1] );
    expect( _gain[2] ).to.equal( currentGain[2] );
  });

});
