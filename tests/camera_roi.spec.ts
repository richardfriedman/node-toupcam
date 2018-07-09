/** Testing Framework, but not using import because compiler */
import 'mocha';
import { expect } from 'chai';
import { expectResult, CameraPrep, CameraConfig } from './TestHelper';

/** Library we are testing */
const toupcam = require( '../toupcam.js' );

describe ('Camera Roi Functions.', () => {

  let cam = new CameraPrep();
  let result: number = null;

  let currentX: number = 0;
  let currentY: number = 0;
  let currentW: number = 0;
  let currentH: number = 0;
  it( 'Validate get existing roi.', () => {
    let _x = toupcam.alloc.Unsigned();
    let _y = toupcam.alloc.Unsigned();
    let _w = toupcam.alloc.Unsigned();
    let _h = toupcam.alloc.Unsigned();
    result = toupcam.lib.Toupcam_get_Roi( cam.handle, _x, _y, _w, _h );
    expectResult(result);
    expect( _x.deref() ).to.be.at.least( 0 );
    expect( _w.deref() ).to.be.at.greaterThan( _x.deref() );
    expect( _y.deref() ).to.be.at.least( 0 );
    expect( _h.deref() ).to.be.at.greaterThan( _y.deref() );
    currentX = _x.deref();
    currentY = _y.deref();
    currentW = _w.deref();
    currentH = _h.deref();
  });

  let newX: number = 0;
  let newY: number = 0;
  let newW: number = 0;
  let newH: number = 0;
  it( 'Set ROI.', () => {
    newX = Math.floor( currentW / 10 );
    newX = (newX%2)? newX+1:newX;
    newY = Math.floor( currentH / 10 );
    newY = (newY%2)? newY+1:newY;
    newW = Math.floor( currentW / 2 );
    newH = Math.floor( currentH / 2 );
    result = toupcam.lib.Toupcam_put_Roi( cam.handle, newX, newY, newW, newH );
    expectResult(result);
  });

  it( 'Check set ROI.', () => {
    let _x = toupcam.alloc.Unsigned();
    let _y = toupcam.alloc.Unsigned();
    let _w = toupcam.alloc.Unsigned();
    let _h = toupcam.alloc.Unsigned();
    result = toupcam.lib.Toupcam_get_Roi( cam.handle, _x, _y, _w, _h );
    expectResult(result);
    expect( _x.deref() ).to.equal( newX );
    expect( _y.deref() ).to.equal( newY );
    expect( _w.deref() ).to.equal( newW );
    expect( _h.deref() ).to.equal( newH );
  });

  it( 'Reset roi.', () => {
    result = toupcam.lib.Toupcam_put_Roi( cam.handle, currentX, currentY, currentW, currentH );
    expectResult(result);
  });

  it( 'Validate resetting roi.', () => {
    let _x = toupcam.alloc.Unsigned();
    let _y = toupcam.alloc.Unsigned();
    let _w = toupcam.alloc.Unsigned();
    let _h = toupcam.alloc.Unsigned();
    result = toupcam.lib.Toupcam_get_Roi( cam.handle, _x, _y, _w, _h );
    expectResult(result);
    expect( _x.deref() ).to.equal( currentX );
    expect( _y.deref() ).to.equal( currentY );
    expect( _w.deref() ).to.equal( currentW );
    expect( _h.deref() ).to.equal( currentH );
  });

});
