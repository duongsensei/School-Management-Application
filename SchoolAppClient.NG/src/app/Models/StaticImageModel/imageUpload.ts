export class ImageUpload {

  public ImageData!: string | any;
  public ImageName?: string;


  public getBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.ImageData = e.target.result as string;
      this.ImageName = file.name;
      //console.log(reader.result);

    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
      return error;
    };

    reader.readAsDataURL(file);
  }
}
