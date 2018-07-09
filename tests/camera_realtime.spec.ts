/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera RealTime Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentRealTime: boolean = null;
  it( 'Validate get realtime mode.', () => {
    let _realtime:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_RealTime( cam.handle, _realtime );
    expectResult(result);
    expect( _realtime.deref() ).to.be.a('boolean');
    currentRealTime = _realtime.deref();
  });

  it( 'Validate setting realtime.', () => {
    result = toupcam.lib.Toupcam_put_RealTime( cam.handle, !currentRealTime );
    expectResult(result);
  });

  it( 'Validate if realtime was set properly.', () => {
    let _realtime:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_RealTime( cam.handle, _realtime );
    expectResult(result);
    expect( _realtime.deref() ).to.equal( !currentRealTime );
  });

  it( 'Reset realtime.', () => {
    result = toupcam.lib.Toupcam_put_RealTime( cam.handle, currentRealTime );
    expectResult(result);
  });

  it( 'Validate resetting realtime.', () => {
    let _realtime:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_RealTime( cam.handle, _realtime );
    expectResult(result);
    expect( _realtime.deref() ).to.equal( currentRealTime );
  });

});
