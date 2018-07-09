/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Hue Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentHue: number = 0;
  it( 'Validate get existing hue.', () => {
    let _hue:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Hue( cam.handle, _hue );
    expectResult(result);
    expect( _hue.deref() ).to.be.at.least( toupcam.define.HUE_MIN );
    expect( _hue.deref() ).to.be.at.most( toupcam.define.HUE_MAX );
    currentHue = _hue.deref();
  });

  let newHue: number = 0;
  it( 'Validate setting hue.', () => {
    newHue = ( currentHue == toupcam.define.HUE_DEF ) ? toupcam.define.HUE_MAX : toupcam.define.HUE_DEF;
    result = toupcam.lib.Toupcam_put_Hue( cam.handle, newHue );
    expectResult(result);
  });

  it( 'Validate if hue was set properly.', () => {
    let _hue:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Hue( cam.handle, _hue );
    expectResult(result);
    expect( _hue.deref() ).to.equal( newHue );
  });

  it( 'Reset hue.', () => {
    result = toupcam.lib.Toupcam_put_Hue( cam.handle, currentHue );
    expectResult(result);
  });

  it( 'Validate resetting hue.', () => {
    let _hue:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Hue( cam.handle, _hue );
    expectResult(result);
    expect( _hue.deref() ).to.equal( currentHue );
  });

});
