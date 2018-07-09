
import 'mocha';
import { expect } from 'chai';
const toupcam = require( '../toupcam.js' );

export function expectResult( result:number, msg?: string ){
    expect( result, toupcam.getError(result, msg) ).to.equal( 0 );
  }

export var CameraConfig = null ;

export class CameraPrep {

  handle: any = null;

  constructor( rgb: boolean = false ) {

    let count: number = toupcam.lib.Toupcam_Enum( toupcam.Cameras );
    if( count >= 1 ){
      this.loadConfig(toupcam.Cameras[0].model.deref().name);
    }

    before( 'Open Camera by enumb?', () => {
      expect( CameraConfig ).to.not.be.null;

      if ( rgb ) {
        this.handle = toupcam.lib.Toupcam_Open_RGB( toupcam.Cameras[0].id.buffer.readCString() );
      } else {
        this.handle = toupcam.lib.Toupcam_OpenByIndex( 0 );
      }
      expect( this.handle ).to.not.be.empty;
      expect( this.handle.isNull() ).to.be.false;
    });
    after( 'Close Camera', () => {
      toupcam.lib.Toupcam_Close(this.handle);
    });

  }

  private loadConfig( model: string ){
    try{
      CameraConfig = require('./models/'+ model);
    } catch (e){
      CameraConfig = require('./models/YOUR_MODEL');
    }
  }

  public wait( time: number) {
    it( `Wait ${time}s?`, function(done){
      this.timeout(2*time*1000);
      setTimeout(function () {
        done()
      }, time*1000 );
    });
  }
}
