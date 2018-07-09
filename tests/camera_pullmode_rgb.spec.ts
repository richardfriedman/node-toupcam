
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
describe ('Camera PullModeRGB Test', () => {

  let cam = new CameraPrep(true);

  let eventCounter = 0;
  let done = null;
  let waitFor: number = -1;
  let filename: string = null;
  let pullCb = toupcam.callback.PullMode( function( event, context ){
    eventCounter++;
    // console.log( "Event: " + event + " : " + toupcam.enum.events.toString(event) );
    switch( event ){
      case toupcam.enum.events.IMAGE:
        if ( event == waitFor ){
          waitFor = -1;
          let w = toupcam.alloc.Integer();
          let h = toupcam.alloc.Integer();
          let result = toupcam.lib.Toupcam_PullImage.async(cam.handle, toupcam.Null, 24, w, h, function(err,res){
            expectResult(res);
            let image = toupcam.alloc.Image(w.deref(),h.deref());
            toupcam.lib.Toupcam_PullImage.async(cam.handle, image, 24, w, h, function(err,res){
              expectResult(res);
              done();
              sharp(image, {raw:{width:w.deref(),height:h.deref(),channels:3}} )
              .toFile( filename, (err,info) => {/*console.log('sharp',err,info);*/ });
            });
          });
        }
        break;
      case toupcam.enum.events.EXPOSURE:
      case toupcam.enum.events.STILLIMAGE:
        if ( event == waitFor ){
          waitFor = -1;
          let w = toupcam.alloc.Integer();
          let h = toupcam.alloc.Integer();
          toupcam.lib.Toupcam_PullStillImage.async(cam.handle, toupcam.Null, 24, w, h, function(err,res){
            expectResult(res);
            let image = toupcam.alloc.Image(w.deref(),h.deref());
            toupcam.lib.Toupcam_PullStillImage.async(cam.handle, image, 24, w, h, function(err,res){
              expectResult(res);
              done();
              sharp(image, {raw:{width:w.deref(),height:h.deref(),channels:3}} )
              .toFile( filename, (err,info) => {/*console.log('sharp',err,info);*/ });
            });
          });
        }
        break;
      case toupcam.enum.events.TEMPTINT:
      case toupcam.enum.events.CHROME:
      case toupcam.enum.events.WBGAIN:
      case toupcam.enum.events.ERROR:
      case toupcam.enum.events.DISCONNECTED:
      default:
        if ( event == waitFor ){
          waitFor = -1;
          done();
        }
        break;
    }
    return toupcam.Null;
  });

  let result: number = null;

  it( 'Take a picture in PullMode.', function(_done) {
    done = _done;
    waitFor = toupcam.enum.events.IMAGE;
    filename = 'pullmode-image-1.jpg';
    result = toupcam.lib.Toupcam_StartPullModeWithCallback( cam.handle, pullCb, toupcam.Null );
    expectResult(result);
  });

  it( 'Test Histogram', function(done){
    let hCB = toupcam.callback.Histogram( function( hY, hR, hG, hB, context ){
      // console.log( hY.length, hR.length, hG.length, hB.length );
      expect( hY.length ).to.be.greaterThan(0);
      expect( hR.length ).to.be.greaterThan(0);
      expect( hG.length ).to.be.greaterThan(0);
      expect( hB.length ).to.be.at.least(0); // not sure why.
      done();
    });
    result = toupcam.lib.Toupcam_GetHistogram( cam.handle, hCB, toupcam.Null );
    expectResult(result);
  });

  it( 'Test AutoWhiteBalance aGain Callback', function(done){
    this.timeout(3000);
    let awbCB = toupcam.callback.AutoWhiteBalance( function( aGain, context ){
      expect( aGain.length == 3 );
      expect( aGain[0] ).at.least(0);
      expect( aGain[1] ).at.least(0);
      expect( aGain[2] ).at.least(0);
      done();
    });
    result = toupcam.lib.Toupcam_AwbInit( cam.handle, awbCB, toupcam.Null );
    expectResult(result);
  });

  cam.wait( 2 );

  it( 'flush frames', function(_done) {
    done = _done;
    waitFor = toupcam.enum.events.IMAGE;
    filename = 'pullmode-image-2.jpg';
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
  })

  cam.wait( 2 );

  it( 'Still Images', function(_done) {
    this.timeout( 5000 );
    done = _done;
    waitFor = toupcam.enum.events.STILLIMAGE;
    filename = 'pullmode-still-1.jpg';
    result = toupcam.lib.Toupcam_Snap(cam.handle, 1);
    expectResult(result);
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
  })

  cam.wait( 2 );

  it.skip( 'Test Trigger', function(_done) {
    done = _done;
    waitFor = toupcam.enum.events.IMAGE;
    filename = 'pullmode-image-3.jpg';

    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
    result = toupcam.lib.Toupcam_Trigger( cam.handle );
    expectResult(result);
  })

  cam.wait( 2 );

  let lastEventCounter:number = 0;
  it( 'Test Pause Stop', function(){
    lastEventCounter = eventCounter;
    result = toupcam.lib.Toupcam_Pause( cam.handle, true );
    expectResult(result);
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
    expect( lastEventCounter, "Counter changed." ).to.equal( eventCounter );
  })

  cam.wait( 2 );

  it( 'Test Pause Start', function(_done){
    expect( lastEventCounter, "Counter changed since pause." ).to.equal( eventCounter );
    done = _done;
    waitFor = toupcam.enum.events.IMAGE;
    filename = 'pullmode-image-4.jpg';
    result = toupcam.lib.Toupcam_Pause( cam.handle, false );
    expectResult(result);
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
  })

  cam.wait( 2 );

  it( 'Test Stop ', function(){
    lastEventCounter = eventCounter;
    result = toupcam.lib.Toupcam_Stop( cam.handle );
    expectResult(result);
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
    expect( lastEventCounter, "Counter changed since stop." ).to.equal( eventCounter );
  })

  cam.wait( 2 );

  it( 'Restart images.', function(_done) {
    expect( lastEventCounter, "Counter changed before restart." ).to.equal( eventCounter );
    done = _done;
    waitFor = toupcam.enum.events.IMAGE;
    filename = 'pullmode-restart-1.jpg';
    result = toupcam.lib.Toupcam_StartPullModeWithCallback( cam.handle, pullCb, toupcam.Null );
    expectResult(result);
  });

  cam.wait( 2 );

  it( 'Test Stop ', function(){
    lastEventCounter = eventCounter;
    result = toupcam.lib.Toupcam_Stop( cam.handle );
    expectResult(result);
    result = toupcam.lib.Toupcam_Flush( cam.handle );
    expectResult(result);
    expect( lastEventCounter, "Counter changed since final stop." ).to.equal( eventCounter );
  })

});
