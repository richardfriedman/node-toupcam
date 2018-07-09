/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Negative Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;
  let currentNegative: boolean = null;
  it( 'Validate get negative mode.', () => {
    let _negative:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Negative( cam.handle, _negative );
    expectResult(result);
    expect( _negative.deref() ).to.be.a('boolean');
    currentNegative = _negative.deref();
  });

  it( 'Validate setting negative.', () => {
    result = toupcam.lib.Toupcam_put_Negative( cam.handle, !currentNegative );
    expectResult(result);
  });

  it( 'Validate if negative was set properly.', () => {
    let _negative:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Negative( cam.handle, _negative );
    expectResult(result);
    expect( _negative.deref() ).to.equal( !currentNegative );
  });

  it( 'Reset negative.', () => {
    result = toupcam.lib.Toupcam_put_Negative( cam.handle, currentNegative );
    expectResult(result);
  });

  it( 'Validate resetting negative.', () => {
    let _negative:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Negative( cam.handle, _negative );
    expectResult(result);
    expect( _negative.deref() ).to.equal( currentNegative );
  });

});
