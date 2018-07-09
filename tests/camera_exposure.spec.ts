/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Exposure Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  it( 'Setup callback', function() {
    let cb = toupcam.callback.Exposure( function(context){
      console.log( "CALLBACK INVOKED", context );
    });

    result = toupcam.lib.Toupcam_put_ExpoCallback( cam.handle, cb, toupcam.Null );
    expectResult(result);
  });

  let gainMin:number = 0;
  let gainMax:number = 0;
  let gainDef:number = 0;
  it( 'Get gain range', ()=>{
    let min:any = toupcam.alloc.UShort();
    let max:any = toupcam.alloc.UShort();
    let def:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_ExpoAGainRange( cam.handle, min, max, def );
    expectResult(result);
    expect( min.deref() ).to.be.greaterThan( 0 );
    expect( def.deref() ).to.be.at.least( min.deref() );
    expect( max.deref() ).to.be.greaterThan( def.deref() );
    gainMin = min.deref();
    gainMax = max.deref();
    gainDef = def.deref();
  });

  let currentGain: number = 0;
  it( 'Get current AGain.', () => {
    let _again:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_ExpoAGain( cam.handle, _again );
    expectResult(result);
    expect( _again.deref() ).to.greaterThan( 0 );
    currentGain = _again.deref();
  });

  let newGain: number = 0;
  it( 'Set AGain.', () => {
    newGain = ( currentGain == gainDef ) ? gainMax : gainDef;
    result = toupcam.lib.Toupcam_put_ExpoAGain( cam.handle, newGain );
    expectResult(result);
  });

  it( 'Check AGain.', () => {
    let _again:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_ExpoAGain( cam.handle, _again );
    expectResult(result);
    expect( _again.deref() ).to.equal( newGain );
  });

  it( 'Reset AGain.', () => {
    result = toupcam.lib.Toupcam_put_ExpoAGain( cam.handle, currentGain );
    expectResult(result);
  });

  it( 'Check AGain.', () => {
    let _again:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_ExpoAGain( cam.handle, _again );
    expectResult(result);
    expect( _again.deref() ).to.equal( currentGain );
  });

  let exposureMin:number = 0;
  let exposureMax:number = 0;
  let exposureDef:number = 0;
  it( 'Get exposure time range.', ()=>{
    let min:any = toupcam.alloc.Integer();
    let max:any = toupcam.alloc.Integer();
    let def:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_ExpTimeRange( cam.handle, min, max, def );
    expectResult(result);
    expect( min.deref() ).to.be.greaterThan( 0 );
    expect( def.deref() ).to.be.greaterThan( min.deref() );
    expect( max.deref() ).to.be.greaterThan( def.deref() );
    exposureMin = min.deref();
    exposureMax = max.deref();
    exposureDef = def.deref();
  });

  let currentExposure: number = 0;
  it( 'Get current exposure time.', () => {
    let _exposure:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_ExpoTime( cam.handle, _exposure );
    expectResult(result);
    expect( _exposure.deref() ).to.greaterThan( 0 );
    currentExposure = _exposure.deref();
  });

  let newExposure: number = 0;
  it( 'Set Exposure time.', () => {
    newExposure = ( currentExposure == exposureDef ) ? exposureMax : exposureDef;
    result = toupcam.lib.Toupcam_put_ExpoTime( cam.handle, newExposure );
    expectResult(result);
  });

  it( 'Check exposure time.', () => {
    let _exposure:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_ExpoTime( cam.handle, _exposure );
    expectResult(result);
    expect( _exposure.deref() ).to.equal( newExposure );
  });

  it( 'Reset Exposure time.', () => {
    result = toupcam.lib.Toupcam_put_ExpoTime( cam.handle, currentExposure );
    expectResult(result);
  });

  it( 'Check exposure time.', () => {
    let _exposure:any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_ExpoTime( cam.handle, _exposure );
    expectResult(result);
    expect( _exposure.deref() ).to.equal( currentExposure );
  });

  let currentExpandable: boolean = null;
  it( 'Get Enable/Disable AutoExposure.', () => {
    let _autoExpand:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_AutoExpoEnable( cam.handle, _autoExpand );
    expectResult(result);
    expect( _autoExpand.deref() ).to.be.a( 'boolean' );
    currentExpandable = _autoExpand.deref();
  });

  it( 'Set Enable/Disable AutoExposure.', () => {
    result = toupcam.lib.Toupcam_put_AutoExpoEnable( cam.handle, !currentExpandable );
    expectResult(result);
  });

  it( 'Check Enable/Disable AutoExposure.', () => {
    let _autoExpand:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_AutoExpoEnable( cam.handle, _autoExpand );
    expectResult(result);
    expect( _autoExpand.deref() ).to.be.equal( !currentExpandable );
  });

  it( 'Reset Enable/Disable AutoExposure.', () => {
    result = toupcam.lib.Toupcam_put_AutoExpoEnable( cam.handle, currentExpandable );
    expectResult(result);
  });

  it( 'Check reset Enable/Disable AutoExposure.', () => {
    let _autoExpand:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_AutoExpoEnable( cam.handle, _autoExpand );
    expectResult(result);
    expect( _autoExpand.deref() ).to.be.equal( currentExpandable );
  });

  let currentTarget: number = null;
  it( 'Get AutoExposure Target.', () => {
    let _target:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_AutoExpoTarget( cam.handle, _target );
    expectResult(result);
    expect( _target.deref() ).to.be.greaterThan(0);
    currentTarget = _target.deref();
  });

  let newTarget: number = null;
  it( 'Set AutoExposure Target.', () => {
    newTarget = currentTarget / 2;
    result = toupcam.lib.Toupcam_put_AutoExpoTarget( cam.handle, newTarget );
    expectResult(result);
  });

  it( 'Check AutoExposure Target.', () => {
    let _target:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_AutoExpoTarget( cam.handle, _target );
    expectResult(result);
    expect( _target.deref() ).to.be.equal(newTarget);
  });

  it( 'Reset AutoExposure Target.', () => {
    result = toupcam.lib.Toupcam_put_AutoExpoTarget( cam.handle, currentTarget );
    expectResult(result);
  });

  it( 'Check reset AutoExposure Target.', () => {
    let _target:any = toupcam.alloc.UShort();
    result = toupcam.lib.Toupcam_get_AutoExpoTarget( cam.handle, _target );
    expectResult(result);
    expect( _target.deref() ).to.be.equal(currentTarget);
  });

  it( 'Set Max Auto Exposure and Time Again', () => {
    result = toupcam.lib.Toupcam_put_MaxAutoExpoTimeAGain( cam.handle, newExposure, newGain );
    expectResult(result);
  });

  // it( 'Wait 1 minutes?', function(done){
  //   this.timeout(30000);
  //   setTimeout(function () {
  //     console.log( "TIME");
  //     done()
  //   }, 2000);
  // });

});
