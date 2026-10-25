// Function from Stack Overflow https://stackoverflow.com/q/19395458/17493431
export function isUriImage(uri: string) {
    //make sure we remove any nasty GET params 
    uri = uri.split('?')[0];
    //moving on now
    var parts = uri.split('.');
    var extension = parts[parts.length-1];
    var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp']
    if(imageTypes.indexOf(extension) !== -1) {
        return true;   
    }
}