/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Mode Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;
  let currentMode: boolean = null;
  it( 'Validate get mode mode.', () => {
    let _mode:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Mode( cam.handle, _mode );
    expectResult(result);
    expect( _mode.deref() ).to.be.a('boolean');
    currentMode = _mode.deref();
  });

  it( 'Validate setting mode.', () => {
    result = toupcam.lib.Toupcam_put_Mode( cam.handle, !currentMode );
    expectResult(result);
  });

  it( 'Validate if mode was set properly.', () => {
    let _mode:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Mode( cam.handle, _mode );
    expectResult(result);
    expect( _mode.deref() ).to.equal( !currentMode );
  });

  it( 'Reset mode.', () => {
    result = toupcam.lib.Toupcam_put_Mode( cam.handle, currentMode );
    expectResult(result);
  });

  it( 'Validate resetting mode.', () => {
    let _mode:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Mode( cam.handle, _mode );
    expectResult(result);
    expect( _mode.deref() ).to.equal( currentMode );
  });

});
