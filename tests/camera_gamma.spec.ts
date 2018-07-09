/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Gamma Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  let currentGamma: number = 0;
  it( 'Validate get existing gamma.', () => {
    let _gamma:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Gamma( cam.handle, _gamma );
    expectResult(result);
    expect( _gamma.deref() ).to.be.at.least( toupcam.define.GAMMA_MIN );
    expect( _gamma.deref() ).to.be.at.most( toupcam.define.GAMMA_MAX );
    currentGamma = _gamma.deref();
  });

  let newGamma: number = 0;
  it( 'Validate setting gamma.', () => {
    newGamma = ( currentGamma == toupcam.define.GAMMA_DEF ) ? toupcam.define.GAMMA_MAX : toupcam.define.GAMMA_DEF;
    result = toupcam.lib.Toupcam_put_Gamma( cam.handle, newGamma );
    expectResult(result);
  });

  it( 'Validate if gamma was set properly.', () => {
    let _gamma:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Gamma( cam.handle, _gamma );
    expectResult(result);
    expect( _gamma.deref() ).to.equal( newGamma );
  });

  it( 'Reset gamma.', () => {
    result = toupcam.lib.Toupcam_put_Gamma( cam.handle, currentGamma );
    expectResult(result);
  });

  it( 'Validate resetting gamma.', () => {
    let _gamma:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Gamma( cam.handle, _gamma );
    expectResult(result);
    expect( _gamma.deref() ).to.equal( currentGamma );
  });

});
