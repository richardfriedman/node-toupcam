/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Chrome Functions.', () => {

  let cam = new CameraPrep();

  let result: number = null;
  it( 'Setup callback', function() {
    let cb = toupcam.callback.Chrome( function(context){
      console.log( "CALLBACK INVOKED", context );
    });

    result = toupcam.lib.Toupcam_put_ChromeCallback( cam.handle, cb, toupcam.Null );
    expectResult(result);
  });

  let currentChrome: boolean = null;
  it( 'Validate get chrome mode.', () => {
    let _chrome:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Chrome( cam.handle, _chrome );
    expectResult(result);
    expect( _chrome.deref() ).to.be.a('boolean');
    currentChrome = _chrome.deref();
  });

  it( 'Validate setting chrome.', () => {
    result = toupcam.lib.Toupcam_put_Chrome( cam.handle, !currentChrome );
    expectResult(result);
  });

  it( 'Validate if chrome was set properly.', () => {
    let _chrome:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Chrome( cam.handle, _chrome );
    expectResult(result);
    expect( _chrome.deref() ).to.equal( !currentChrome );
  });

  it( 'Reset chrome.', () => {
    result = toupcam.lib.Toupcam_put_Chrome( cam.handle, currentChrome );
    expectResult(result);
  });

  it( 'Validate resetting chrome.', () => {
    let _chrome:any = toupcam.alloc.Boolean();
    result = toupcam.lib.Toupcam_get_Chrome( cam.handle, _chrome );
    expectResult(result);
    expect( _chrome.deref() ).to.equal( currentChrome );
  });

});
