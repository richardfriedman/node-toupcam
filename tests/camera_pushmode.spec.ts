
/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );
import sharp = require('sharp');
/**
 * Tests are meant to run against my Toupek,
 * Adjust test config for your camera.
 */
describe ('Camera PushMode Test', () => {

  let cam = new CameraPrep();

  let done = null;
  let flush = false;
  let imageCount = 0;
  let waitFor = 4;
  let pushCB = toupcam.callback.PushMode( function( image, info, snap, context ){
    imageCount++;
    // console.log( "Image: " + imageCount );
    if ( waitFor == imageCount ){
      done();
    }
    if ( !flush ) {
      let filename = `pushmode-image-${imageCount}.jpg`;
      sharp( image, {raw:{width:info.deref().biWidth,height:info.deref().biHeight,channels:3}} )
      .toFile( filename, (err,info) => { /*console.log('sharp',err,info);*/ });
    }
  });

  let result: number = null;

  it( 'Take a picture in PullMode.', function(_done) {
    done = _done;
    result = toupcam.lib.Toupcam_StartPushMode( cam.handle, pushCB, toupcam.Null );
    expectResult(result);
  });

  cam.wait( 2 );

  it( 'Test Stop ', function(done){
    flush = true;
    toupcam.lib.Toupcam_Stop.async( cam.handle, function(err,result){
      expectResult(result);
      done();
    } );
  })

  it( 'Flush', function(_done) {
    flush = true;
    result = toupcam.lib.Toupcam_Flush.async( cam.handle, function(err, result){
      expectResult(result);
      _done();
    });
  })

});
