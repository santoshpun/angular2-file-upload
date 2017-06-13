import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  dragOver: boolean;
  message: string = '';
  uploading: boolean = false;
  isUploaded: boolean = false;
  uploadedImage: string = '';

  constructor() {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  ngAfterViewInit() {
    $('.upload-btn').on('click', function () {
      $('#upload-input').click();
    });
  }

  onUploadOutput(output: UploadOutput): void {
    this.isUploaded = false;
    this.message = "";
    this.uploadedImage = '';
    console.log(output); // lets output to see what's going on in the console

    if (output.type === 'allAddedToQueue') { // when all files added in queue
      this.isUploaded = true;
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') { // drag over event
      this.dragOver = true;
    } else if (output.type === 'dragOut') { // drag out event
      this.dragOver = false;
    } else if (output.type === 'drop') { // on drop event
      this.dragOver = false;
    } else if (output.type === 'done') {
      this.message = "Image uploaded successfully";
      this.uploadedImage = "http://localhost:3000/public/uploads/" + output.file.response.filename;
      this.uploading = false;
    }
  }

  startUpload(): void {  // manually start uploading
    this.uploading = true;
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://localhost:3000/api/photo',
      method: 'POST',
      data: { foo: 'bar' },
      concurrency: 1 // set sequential uploading of files with concurrency 1
    }
    this.clear();
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  clear() {
    this.isUploaded = false;
    this.uploadedImage = '';
  }
}
