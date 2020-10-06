// const { FilePond, registerPlugin } = require("filepond");
// const { encode } = require("punycode");

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 20 / 100,
  // imageResizeTargetWidth: 150,
  // imageResizeTargetHeight: 150,
});

FilePond.parse(document.body);
