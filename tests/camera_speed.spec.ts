/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Speed Functions', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let maxSpeed = null;
  it( 'Get Max Speed', () => {
    maxSpeed = toupcam.lib.Toupcam_get_MaxSpeed( cam.handle );
    expect( maxSpeed ).to.equal( CameraConfig.ModelMaxSpeed );
  });

  let currentSpeed:Number = 0;
  it( 'Get current speed.', () => {
    let _speed:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_Speed( cam.handle, _speed );
    expectResult(result);
    expect( _speed.deref() ).to.be.lessThan( maxSpeed + 1 );
    currentSpeed = _speed.deref();
  });

  let newSpeed:Number = 0;
  it( 'Validate put speed.', () => {
    newSpeed = (currentSpeed == 0)? maxSpeed:0;
    result = toupcam.lib.Toupcam_put_Speed( cam.handle, newSpeed );
    expectResult(result);
  });

  it( 'Validate speed updated.', () => {
    let _speed:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_Speed( cam.handle, _speed );
    expectResult(result);
    expect( _speed.deref() ).to.equal( newSpeed );
  });

  it( 'Reset Speed.', () => {
    result = toupcam.lib.Toupcam_put_Speed( cam.handle, currentSpeed );
    expectResult(result);
  });

  it( 'Validate speed reset.', () => {
    let _speed:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_Speed( cam.handle, _speed );
    expectResult(result);
    expect( _speed.deref() ).to.equal( currentSpeed );
  });

});
