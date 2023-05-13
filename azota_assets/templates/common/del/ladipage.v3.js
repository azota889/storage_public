jQuery(document).ready(function(){
/* ------------------------------
  EDIT TEXT ELEMENTS
  --------------------------------
*/
document.querySelectorAll('*').forEach(function(node) {

    var childs = node.childNodes;

    childs.forEach(no => {
        var valuetxtarrs = '';
        var valuetxtarr = no.nodeValue;

        if(valuetxtarr){
              valuetxtarrs = valuetxtarr.replace(/\n/g,"");
        }

        if(!no.hasChildNodes() && valuetxtarrs.trim() != ''){
            var parentNode = no.parentNode;

            var att = document.createAttribute("contentEditable");
            att.value = "true";
            parentNode.setAttributeNode(att);

            parentNode.onfocus = ()=>{
                parentNode.style.border = "1px dashed red";
            };

            parentNode.onblur = ()=>{
                parentNode.style.border = "none";
            };

        }
    });

});


/* ------------------------------
  CHANGE IMAGE ELEMENTS
  --------------------------------
*/
  jQuery('#tpl-cropper-modal').show();

  var labelElement = "<label data-toggle='tooltip' data-original-title='Thay đổi hình ảnh' class='changeLabel'></label>";
  var inputFileElement = '<input multiple="false" type="file" class="sr-only tpl-input-file" name="image" accept="image/*">'

  var getChangeAblesImg = jQuery('.changeAble');

  var crHeight;
  var crWidth;

  getChangeAblesImg.wrap(labelElement);

  jQuery('.changeLabel').append(inputFileElement);

  var inputFiles = document.querySelectorAll('.tpl-input-file');

  jQuery('[data-toggle="tooltip"]').tooltip();

  // Thay ảnh nền hero
  var getSectionOne = jQuery('.section-one')[0];
  if(getSectionOne){
    getSectionOne.addEventListener('click', function(e){
      console.log(e);
      if(e.target.className == 'section-one'){
        jQuery('.section-one label input').click();
      }
    })
  }
  var targetImgSibling;
  var cropImage = document.getElementById('cropper-image');
  var $alert = jQuery('.alert');
  var $modal = jQuery('#modal');
  var cropper;
  var cropButton = document.getElementById('crop-button');

  var file;

  inputFiles.forEach((input) => {
    input.addEventListener("change", function (e) {


      var files = e.target.files;
      var reader;
      if (files && files.length > 0) {

        file = files[0];

        targetImgSibling = jQuery(e.target).siblings();

        crHeight = targetImgSibling.height;
        crWidth = targetImgSibling.width;

        reader = new FileReader();
        reader.onload = function (e) {

          done(reader.result);
        };
        reader.readAsDataURL(file);
      }

      function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;

      }

      var done = function(url){
        input.value = '';
        // cropImage.src = url;
        var loadingElement = '<div id="loadingIcon">Đang tải ảnh lên...</div>';

        jQuery('.section-one').append(loadingElement);
        
        var user = localStorage.getItem('user_obj');
        var token = JSON.parse(user)['rememberToken'];
        const headers = { Authorization: 'Bearer ' + token };
        var apiURL = `https://api.azota.vn/api/S3space/get_public_upload_url_for_ladipage?file_name=${file['name']}&file_size=${file['size']}&minetype=${file['type']}`;
        jQuery.ajax({url:apiURL, headers: headers, success: function(result){
          var uploadUrl = result['data']['upload_url'];
          var urlCdn = result['data']['url'];

          var blob = dataURItoBlob(url);

          jQuery.ajax({url: uploadUrl, type: 'PUT', processData: false, contentType: file['type'], headers: {'x-amz-acl': 'public-read'}, data: blob, success: function(result){
            targetImgSibling[0].src = urlCdn;
            jQuery('#loadingIcon').remove();
          }, error: function(){
            // $alert.hide();
            jQuery('#loadingIcon').remove();
            throw 'Đẩy file lên CDN không thành công';
          }});

        }, error: function(){
          // $alert.hide();
          jQuery('#loadingIcon').remove();
          throw 'Đẩy file lên CDN không thành công';
        }});

        // $alert.hide();
        // $modal.modal('show');
      }
    });
  });

  $modal.on('shown.bs.modal', function () {
    cropper = new Cropper(cropImage, {
      aspectRatio: crWidth/crHeight,
      viewMode: 3,
    });
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
    cropper = null;
  });

  cropButton.addEventListener('click', function () {
    var initialAvatarURL;
    var canvas;

    $modal.modal('hide');

    if (cropper) {
      canvas = cropper.getCroppedCanvas({
        width: 160,
        height: 160 * crHeight / crWidth,
      });
      initialAvatarURL = targetImgSibling.src;
      targetImgSibling[0].src = canvas.toDataURL();

      var user = localStorage.getItem('user_obj');
      var token = JSON.parse(user)['rememberToken'];
      const headers = { Authorization: 'Bearer ' + token };
      var apiURL = `https://api.azota.vn/api/S3space/get_public_upload_url_for_ladipage?file_name=${file['name']}&file_size=${file['size']}&minetype=${file['type']}`;
      jQuery.ajax({url:apiURL, headers: headers, success: function(result){
        var uploadUrl = result['data']['upload_url'];
        var urlCdn = result['data']['url'];

        canvas.toBlob(function(blob){
          jQuery.ajax({url: uploadUrl, type: 'PUT', processData: false, contentType: file['type'], headers: {'x-amz-acl': 'public-read'}, data: blob, success: function(result){
            targetImgSibling[0].src = urlCdn;
          }, error: function(){
            $alert.hide();
            throw 'Đẩy file lên CDN không thành công';
          }});

        })
      }, error: function(){
        $alert.hide();
        throw 'Đẩy file lên CDN không thành công';
      }});
    }
  });

});
