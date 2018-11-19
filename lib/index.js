'use strict';

/**
 * Module dependencies
 */
const url = require('url');
const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

module.exports = {
  provider: 'dropbox',
  name: 'Dropbox',
  auth: {
    accessToken: {
      label: 'Access Token',
      type: 'text'
    }
  },
  init: (config) => {
    const dropbox = new Dropbox({ fetch, accessToken: config.accessToken });

    return {
      upload(file) {
        return dropbox.filesUpload({ path: `/uploads/${file.hash}${file.ext}`, contents: Buffer.from(file.buffer, 'binary') })
          .then(fileSaved => dropbox.sharingCreateSharedLinkWithSettings({ path: fileSaved.path_display }))
          .then(fileUrl => {
            let {protocol, hostname, pathname} = url.parse(fileUrl.url);
            file.public_id = fileUrl.id;
            file.url = url.format({
                protocol,
                hostname,
                pathname,
                query: {
                    raw: 1
                }
            });

            return Promise.resolve();
          })
      },
      delete(file) {
        return dropbox.filesDeleteV2({ path: `/uploads/${file.hash}${file.ext}` })
      }
    }
  }
}