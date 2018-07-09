/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Saturation Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentSaturation: number = 0;
  it( 'Validate get existing saturation.', () => {
    let _saturation:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Saturation( cam.handle, _saturation );
    expectResult(result);
    expect( _saturation.deref() ).to.be.at.least( toupcam.define.SATURATION_MIN );
    expect( _saturation.deref() ).to.be.at.most( toupcam.define.SATURATION_MAX );
    currentSaturation = _saturation.deref();
  });

  let newSaturation: number = 0;
  it( 'Validate setting saturation.', () => {
    newSaturation = ( currentSaturation == toupcam.define.SATURATION_DEF ) ? toupcam.define.SATURATION_MAX : toupcam.define.SATURATION_DEF;
    result = toupcam.lib.Toupcam_put_Saturation( cam.handle, newSaturation );
    expectResult(result);
  });

  it( 'Validate if saturation was set properly.', () => {
    let _saturation:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Saturation( cam.handle, _saturation );
    expectResult(result);
    expect( _saturation.deref() ).to.equal( newSaturation );
  });

  it( 'Reset saturation.', () => {
    result = toupcam.lib.Toupcam_put_Saturation( cam.handle, currentSaturation );
    expectResult(result);
  });

  it( 'Validate resetting saturation.', () => {
    let _saturation:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Saturation( cam.handle, _saturation );
    expectResult(result);
    expect( _saturation.deref() ).to.equal( currentSaturation );
  });

});
