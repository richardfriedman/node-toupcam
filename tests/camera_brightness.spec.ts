/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Brightness Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentBrightness: number = 0;
  it( 'Validate get existing brightness.', () => {
    let _brightness:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Brightness( cam.handle, _brightness );
    expectResult(result);
    expect( _brightness.deref() ).to.be.at.least( toupcam.define.BRIGHTNESS_MIN );
    expect( _brightness.deref() ).to.be.at.most( toupcam.define.BRIGHTNESS_MAX );
    currentBrightness = _brightness.deref();
  });

  let newBrightness: number = 0;
  it( 'Validate setting brightness.', () => {
    newBrightness = ( currentBrightness == toupcam.define.BRIGHTNESS_DEF ) ? toupcam.define.BRIGHTNESS_MAX : toupcam.define.BRIGHTNESS_DEF;
    result = toupcam.lib.Toupcam_put_Brightness( cam.handle, newBrightness );
    expectResult(result);
  });

  it( 'Validate if brightness was set properly.', () => {
    let _brightness:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Brightness( cam.handle, _brightness );
    expectResult(result);
    expect( _brightness.deref() ).to.equal( newBrightness );
  });

  it( 'Reset brightness.', () => {
    result = toupcam.lib.Toupcam_put_Brightness( cam.handle, currentBrightness );
    expectResult(result);
  });

  it( 'Validate resetting brightness.', () => {
    let _brightness:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Brightness( cam.handle, _brightness );
    expectResult(result);
    expect( _brightness.deref() ).to.equal( currentBrightness );
  });

});
