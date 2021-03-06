import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Xapi } from '../../xmodule/providers/xapi';
import * as xi from '../../xmodule/interfaces/xapi';
import { FileUploader } from 'ng2-file-upload/components/file-upload/file-uploader.class';
import { Config } from '../../xmodule/providers/config'
/*
  Generated class for the Createupdate component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'createupdate',
  templateUrl: 'createupdate.html'
})
export class Createupdate {isCordova = false;
    name;
    address;
    quesiton_title;
    question_content;
    
    images = {};

    frmTitle:string;
    
    
    
    private uploader = new FileUploader({ url: Config.uploadUrl });
    private result:xi.FileUploadResponse = <xi.FileUploadResponse> {};

    constructor( private platform: Platform, private x: Xapi, private navPar: NavParams ) {
        this.frmTitle = navPar.get('title');
        this.platform.ready().then( () => {
            if ( this.platform.is('cordova') ) {
                console.log("Yes, you are on cordova");
                this.isCordova = true;
            }
            else {
                console.log("No, you are NOT on cordova");
                this.initBrowserUpload();
            }
        });
    }
    
    
    get imageKeys() {
        return Object.keys( this.images );
    }
    
    
    initBrowserUpload() {
        console.log("initBrowserUpload()");

      this.uploader.onSuccessItem = (item, response, status, headers) => {
        this.result = {
          "success": true,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        console.log( 'onSuccessItem : ', this.result );
      };
      this.uploader.onErrorItem = (item, response, status, headers) => {
        this.result = {
          "success": false,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        console.log( 'onErrorItem : ', this.result );
      };
      this.uploader.onCompleteAll = () => {
          this.onBrowserUploadComplete();
      };
      this.uploader.onAfterAddingFile = ( fileItem ) => {
        console.log('onAfterAddingFile: ', fileItem);
        fileItem.withCredentials = false; // remove credentials
        fileItem.upload(); // upload file.
    }
  }


    
    onChangeFileBrowser( $event ) {
        console.log("onChangeFileBrowser()");
        try {
            this.uploader.addToQueue( $event.target.files );
        }
        catch ( e ) {
            this.x.error( "Failed to addToQueue() onBrowserUpload()" );
        }
        finally {
            // this.removeUploadIcon();
        }
    }
   
   private onBrowserUploadComplete() {
    let response = this.result.response;
    if ( response ) {

      // try {
      //   re = JSON.parse( response );
      // }
      // catch ( e ) {
      //   return this.x.error( "Failed on JSON.parse() try in onBrowserUploadComplete(). Please show this message to admin.", e);
      // }

      let re = this.x.json( response );
      if ( re.success ) this.onSuccessFileUpload( re.data );
      else return this.x.error( re.data );
    }
    else return this.errorMaybeServerError();
  }
  
  /**
   * @note this method is called on file upload success.
   *
   * @todo let mobile upload to call this method.
   */
  private onSuccessFileUpload( file: xi.FileUpload ) {
    this.images[ file.id ] = file.url ;
    //this.post.file_id = file.id;
  }
  
  errorMaybeServerError() {
    return this.x.error("Please check if file server is alive and check if the photo size is too big.");
  }


  onDelete( id ) {
      console.log('delete: ' + id );
  }


}
