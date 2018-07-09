/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Resolution Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let maxIndex:number = 0;
  it( 'Validate get resolution Number.', () => {
    maxIndex = toupcam.lib.Toupcam_get_ResolutionNumber( cam.handle );
    expect( maxIndex ).to.be.greaterThan(0);
  });

  it( 'Validate get still resolution Number.', () => {
    let countStillRes: number = toupcam.lib.Toupcam_get_StillResolutionNumber( cam.handle );
    expect( countStillRes ).to.be.greaterThan(0);
  });

  it( 'Validate get resolution for index.', () => {
    let w: any = toupcam.alloc.Integer();
    let h: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Resolution( cam.handle, 0, w, h );
    expectResult(result);
    expect( w.deref() ).to.be.equal( CameraConfig.ModelRes[0][0] );
    expect( h.deref() ).to.be.equal( CameraConfig.ModelRes[0][1] );
  });

  it( 'Validate get still resolution for index.', () => {
    let w: any = toupcam.alloc.Integer();
    let h: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_StillResolution( cam.handle, 1, w, h );
    expectResult(result);
    expect( w.deref() ).to.be.equal( CameraConfig.ModelRes[1][0] );
    expect( h.deref() ).to.be.equal( CameraConfig.ModelRes[1][1] );
  });

  it( 'Validate get still resolution ration for index.', () => {
    let numerator: any = toupcam.alloc.Integer();
    let denominator: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_ResolutionRatio( cam.handle, 2, numerator, denominator );
    expectResult(result);
    expect( numerator.deref() ).to.be.equal( CameraConfig.ModelRes[0][0]/CameraConfig.ModelRes[2][0] );
    expect( denominator.deref() ).to.be.equal( 1 );
  });

  let currentIndex: number = 0;
  it( 'Get current resolution index.', () => {
    let i: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_eSize( cam.handle, i );
    expectResult(result);
    expect( i.deref() ).to.be.at.least(0);
    currentIndex = i.deref();
  });

  let newIndex: number = 0;
  it( 'Set resolution by index.', () => {
    newIndex = ((currentIndex == 0) ? (maxIndex - 1) : 0);
    result = toupcam.lib.Toupcam_put_eSize( cam.handle, newIndex );
    expectResult(result);
  });

  it( 'Validate index changed.', () => {
    let i: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_eSize( cam.handle, i );
    expectResult(result);
    expect( i.deref() ).to.be.equal( newIndex );
  });

  it( 'Reset resolution by index.', () => {
    result = toupcam.lib.Toupcam_put_eSize( cam.handle, currentIndex );
    expectResult(result);
  });

  it( 'Validate index reset.', () => {
    let i: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_eSize( cam.handle, i );
    expectResult(result);
    expect( i.deref() ).to.be.equal( currentIndex );
  });

  it( 'Validate can not set resolution to arbitrary w,h.', () => {
    result = toupcam.lib.Toupcam_put_Size( cam.handle, 1000, 1000 );
    expect(Math.abs(result)).to.equal( toupcam.enum.hresult.E_INVALIDARG );
  });

  it( 'Set size by w,h.', () => {
    result = toupcam.lib.Toupcam_put_Size( cam.handle, CameraConfig.ModelRes[newIndex][0], CameraConfig.ModelRes[newIndex][1] );
    expectResult(result);
  });

  it( 'Validate get size by w,h.', () => {
    let w: any = toupcam.alloc.Integer();
    let h: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Size( cam.handle, w, h );
    expectResult(result);
    expect( w.deref() ).to.be.equal( CameraConfig.ModelRes[newIndex][0] );
    expect( h.deref() ).to.be.equal( CameraConfig.ModelRes[newIndex][1] );
  });

  it( 'Reset size by w,h.', () => {
    result = toupcam.lib.Toupcam_put_Size( cam.handle, CameraConfig.ModelRes[currentIndex][0], CameraConfig.ModelRes[currentIndex][1] );
    expectResult(result);
  });

  it( 'Validate reset size by w,h.', () => {
    let w: any = toupcam.alloc.Integer();
    let h: any = toupcam.alloc.Integer();
    result = toupcam.lib.Toupcam_get_Size( cam.handle, w, h );
    expectResult(result);
    expect( w.deref() ).to.be.equal( CameraConfig.ModelRes[currentIndex][0] );
    expect( h.deref() ).to.be.equal( CameraConfig.ModelRes[currentIndex][1] );
  });

});
